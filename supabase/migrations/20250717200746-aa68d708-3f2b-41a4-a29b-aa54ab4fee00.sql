-- Create tables for enhanced symbol content
-- Mantras table for spiritual content
CREATE TABLE public.symbol_mantras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  mantra_text TEXT NOT NULL,
  pronunciation TEXT,
  language TEXT NOT NULL DEFAULT 'sanskrit',
  meaning TEXT,
  audio_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Chakras table for spiritual energy centers
CREATE TABLE public.symbol_chakras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  chakra_name TEXT NOT NULL,
  position INTEGER, -- 1-7 for main chakras
  color TEXT,
  element TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Rituals table for ceremonial uses
CREATE TABLE public.symbol_rituals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  ritual_name TEXT NOT NULL,
  description TEXT,
  instructions TEXT,
  materials_needed TEXT[],
  occasion TEXT,
  difficulty_level TEXT DEFAULT 'beginner',
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Symbol relationships for connections between symbols
CREATE TABLE public.symbol_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  related_symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'evolution', 'variation', 'opposite', 'complementary', 'derived_from'
  strength INTEGER DEFAULT 5 CHECK (strength >= 1 AND strength <= 10),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  UNIQUE(symbol_id, related_symbol_id, relationship_type)
);

-- Sacred sites for geographic locations
CREATE TABLE public.symbol_sacred_sites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  site_name TEXT NOT NULL,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  country TEXT,
  region TEXT,
  site_type TEXT, -- 'temple', 'monastery', 'shrine', 'pilgrimage', 'archaeological'
  description TEXT,
  historical_significance TEXT,
  visit_info TEXT,
  image_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  verified BOOLEAN DEFAULT false,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Interactive elements for quizzes and engagement
CREATE TABLE public.symbol_quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT DEFAULT 'multiple_choice', -- 'multiple_choice', 'true_false', 'fill_blank'
  options JSONB, -- Array of possible answers for multiple choice
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  difficulty_level TEXT DEFAULT 'medium', -- 'easy', 'medium', 'hard'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- User testimonials and experiences
CREATE TABLE public.symbol_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  testimonial_text TEXT NOT NULL,
  experience_type TEXT, -- 'spiritual', 'artistic', 'academic', 'personal'
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  verified BOOLEAN DEFAULT false,
  verified_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Events calendar for symbol-related events
CREATE TABLE public.symbol_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_id UUID NOT NULL REFERENCES public.symbols(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL,
  description TEXT,
  event_type TEXT, -- 'festival', 'ceremony', 'workshop', 'exhibition'
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  latitude NUMERIC(10, 8),
  longitude NUMERIC(11, 8),
  website_url TEXT,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT, -- 'yearly', 'monthly', 'weekly'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Enable RLS on all new tables
ALTER TABLE public.symbol_mantras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_chakras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_rituals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_sacred_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symbol_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for symbol_mantras
CREATE POLICY "Anyone can view mantras" ON public.symbol_mantras FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create mantras" ON public.symbol_mantras FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own mantras" ON public.symbol_mantras FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for symbol_chakras
CREATE POLICY "Anyone can view chakras" ON public.symbol_chakras FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create chakras" ON public.symbol_chakras FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can update chakras" ON public.symbol_chakras FOR UPDATE USING (auth.uid() IS NOT NULL);

-- RLS Policies for symbol_rituals
CREATE POLICY "Anyone can view rituals" ON public.symbol_rituals FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create rituals" ON public.symbol_rituals FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own rituals" ON public.symbol_rituals FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for symbol_relationships
CREATE POLICY "Anyone can view relationships" ON public.symbol_relationships FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create relationships" ON public.symbol_relationships FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own relationships" ON public.symbol_relationships FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for symbol_sacred_sites
CREATE POLICY "Anyone can view sacred sites" ON public.symbol_sacred_sites FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create sites" ON public.symbol_sacred_sites FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own sites" ON public.symbol_sacred_sites FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for symbol_quiz_questions
CREATE POLICY "Anyone can view quiz questions" ON public.symbol_quiz_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create questions" ON public.symbol_quiz_questions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own questions" ON public.symbol_quiz_questions FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for symbol_testimonials
CREATE POLICY "Anyone can view verified testimonials" ON public.symbol_testimonials FOR SELECT USING (verified = true OR auth.uid() = user_id);
CREATE POLICY "Authenticated users can create testimonials" ON public.symbol_testimonials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own testimonials" ON public.symbol_testimonials FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for symbol_events
CREATE POLICY "Anyone can view events" ON public.symbol_events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.symbol_events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update their own events" ON public.symbol_events FOR UPDATE USING (auth.uid() = created_by);

-- Create triggers for updated_at columns
CREATE TRIGGER update_symbol_mantras_updated_at
  BEFORE UPDATE ON public.symbol_mantras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symbol_chakras_updated_at
  BEFORE UPDATE ON public.symbol_chakras
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symbol_rituals_updated_at
  BEFORE UPDATE ON public.symbol_rituals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symbol_sacred_sites_updated_at
  BEFORE UPDATE ON public.symbol_sacred_sites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_symbol_testimonials_updated_at
  BEFORE UPDATE ON public.symbol_testimonials
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_symbol_mantras_symbol_id ON public.symbol_mantras(symbol_id);
CREATE INDEX idx_symbol_chakras_symbol_id ON public.symbol_chakras(symbol_id);
CREATE INDEX idx_symbol_rituals_symbol_id ON public.symbol_rituals(symbol_id);
CREATE INDEX idx_symbol_relationships_symbol_id ON public.symbol_relationships(symbol_id);
CREATE INDEX idx_symbol_relationships_related_id ON public.symbol_relationships(related_symbol_id);
CREATE INDEX idx_symbol_sacred_sites_symbol_id ON public.symbol_sacred_sites(symbol_id);
CREATE INDEX idx_symbol_sacred_sites_location ON public.symbol_sacred_sites(latitude, longitude);
CREATE INDEX idx_symbol_quiz_questions_symbol_id ON public.symbol_quiz_questions(symbol_id);
CREATE INDEX idx_symbol_testimonials_symbol_id ON public.symbol_testimonials(symbol_id);
CREATE INDEX idx_symbol_events_symbol_id ON public.symbol_events(symbol_id);
CREATE INDEX idx_symbol_events_dates ON public.symbol_events(start_date, end_date);