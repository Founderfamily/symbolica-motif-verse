-- Phase 1: Nettoyage base de données - Suppression des tables en trop

-- Drop tables created in excess (keeping only essential tables for voting/moderation system)
DROP TABLE IF EXISTS public.symbol_chakras CASCADE;
DROP TABLE IF EXISTS public.symbol_mantras CASCADE;
DROP TABLE IF EXISTS public.symbol_rituals CASCADE;
DROP TABLE IF EXISTS public.symbol_quiz_questions CASCADE;
DROP TABLE IF EXISTS public.symbol_sacred_sites CASCADE;
DROP TABLE IF EXISTS public.symbol_testimonials CASCADE;
DROP TABLE IF EXISTS public.symbol_events CASCADE;
DROP TABLE IF EXISTS public.symbol_relationships CASCADE;

-- Keep existing essential tables:
-- - symbols (main symbol data)
-- - symbol_images (for symbol images)
-- - symbol_locations (for map functionality)
-- - symbol_verifications (for verification system)
-- - profiles (for user management)
-- - symbol_verification_community (for community verification)

-- Create tables needed for source voting system if they don't exist
CREATE TABLE IF NOT EXISTS public.symbol_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  author TEXT,
  date_added TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  added_by UUID REFERENCES public.profiles(id),
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  credibility_score NUMERIC DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for source votes
CREATE TABLE IF NOT EXISTS public.symbol_source_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES public.symbol_sources(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(source_id, user_id)
);

-- Create table for moderation items
CREATE TABLE IF NOT EXISTS public.symbol_moderation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('comment', 'source', 'verification')),
  content TEXT NOT NULL,
  reported_by UUID REFERENCES public.profiles(id),
  reported_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.symbol_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_source_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_moderation_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for symbol_sources
CREATE POLICY "Anyone can view symbol sources" ON public.symbol_sources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add sources" ON public.symbol_sources FOR INSERT WITH CHECK (auth.uid() = added_by);
CREATE POLICY "Users can update their own sources" ON public.symbol_sources FOR UPDATE USING (auth.uid() = added_by);

-- RLS policies for symbol_source_votes
CREATE POLICY "Users can view source votes" ON public.symbol_source_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on sources" ON public.symbol_source_votes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own votes" ON public.symbol_source_votes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own votes" ON public.symbol_source_votes FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for symbol_moderation_items
CREATE POLICY "Users can view moderation items" ON public.symbol_moderation_items FOR SELECT USING (true);
CREATE POLICY "Users can report items" ON public.symbol_moderation_items FOR INSERT WITH CHECK (auth.uid() = reported_by);
CREATE POLICY "Admins can manage moderation" ON public.symbol_moderation_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Create triggers for updating vote counts
CREATE OR REPLACE FUNCTION update_source_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'up' THEN
      UPDATE public.symbol_sources SET upvotes = upvotes + 1 WHERE id = NEW.source_id;
    ELSE
      UPDATE public.symbol_sources SET downvotes = downvotes + 1 WHERE id = NEW.source_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'up' THEN
      UPDATE public.symbol_sources SET upvotes = upvotes - 1 WHERE id = OLD.source_id;
    ELSE
      UPDATE public.symbol_sources SET downvotes = downvotes - 1 WHERE id = OLD.source_id;
    END IF;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote change
    IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
      UPDATE public.symbol_sources SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.source_id;
    ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
      UPDATE public.symbol_sources SET downvotes = downvotes - 1, upvotes = upvotes + 1 WHERE id = NEW.source_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER symbol_source_vote_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.symbol_source_votes
  FOR EACH ROW EXECUTE FUNCTION update_source_vote_counts();

-- Function to calculate credibility score
CREATE OR REPLACE FUNCTION calculate_source_credibility()
RETURNS TRIGGER AS $$
DECLARE
  total_votes INTEGER;
  score NUMERIC;
BEGIN
  total_votes := NEW.upvotes + NEW.downvotes;
  
  IF total_votes = 0 THEN
    NEW.credibility_score = 0.0;
  ELSE
    score := (NEW.upvotes::NUMERIC / total_votes::NUMERIC) * 100;
    NEW.credibility_score = ROUND(score, 1);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_source_credibility_trigger
  BEFORE UPDATE ON public.symbol_sources
  FOR EACH ROW EXECUTE FUNCTION calculate_source_credibility();