-- Create archive contributions table
CREATE TABLE public.archive_contributions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  archive_id TEXT NOT NULL, -- Reference to the original archive document
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contribution_type TEXT NOT NULL CHECK (contribution_type IN ('photo', 'comment', 'correction', 'source', 'location')),
  title TEXT,
  description TEXT,
  image_url TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  votes_count INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create contribution votes table
CREATE TABLE public.contribution_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contribution_id UUID NOT NULL REFERENCES public.archive_contributions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(contribution_id, user_id)
);

-- Create storage bucket for archive images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('archive-images', 'archive-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.archive_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for archive_contributions
CREATE POLICY "Users can view approved contributions"
ON public.archive_contributions FOR SELECT
USING (status = 'approved' OR user_id = auth.uid());

CREATE POLICY "Users can create contributions"
ON public.archive_contributions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending contributions"
ON public.archive_contributions FOR UPDATE
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can manage all contributions"
ON public.archive_contributions FOR ALL
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- RLS Policies for contribution_votes
CREATE POLICY "Users can vote on contributions"
ON public.contribution_votes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all votes"
ON public.contribution_votes FOR SELECT
USING (true);

CREATE POLICY "Users can update their own votes"
ON public.contribution_votes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
ON public.contribution_votes FOR DELETE
USING (auth.uid() = user_id);

-- Storage policies for archive images
CREATE POLICY "Anyone can view archive images"
ON storage.objects FOR SELECT
USING (bucket_id = 'archive-images');

CREATE POLICY "Authenticated users can upload archive images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'archive-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own archive images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'archive-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own archive images"
ON storage.objects FOR DELETE
USING (bucket_id = 'archive-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Trigger to update vote counts
CREATE OR REPLACE FUNCTION update_contribution_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.archive_contributions
    SET votes_count = votes_count + 1,
        score = score + CASE WHEN NEW.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.archive_contributions
    SET votes_count = votes_count - 1,
        score = score - CASE WHEN OLD.vote_type = 'upvote' THEN 1 ELSE -1 END
    WHERE id = OLD.contribution_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle vote type change
    UPDATE public.archive_contributions
    SET score = score + CASE WHEN NEW.vote_type = 'upvote' THEN 2 ELSE -2 END
    WHERE id = NEW.contribution_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contribution_vote_counts_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.contribution_votes
FOR EACH ROW EXECUTE FUNCTION update_contribution_vote_counts();

-- Update timestamps trigger
CREATE TRIGGER update_archive_contributions_updated_at
BEFORE UPDATE ON public.archive_contributions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();