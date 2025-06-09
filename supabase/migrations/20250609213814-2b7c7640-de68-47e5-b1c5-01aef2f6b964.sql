
-- Créer les tables pour le système d'enquête historique

-- Table pour les documents historiques liés aux quêtes
CREATE TABLE public.quest_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL, -- 'historical', 'map', 'manuscript', 'archaeological', 'photograph'
  document_url TEXT,
  source TEXT,
  date_created TEXT, -- Date historique du document
  author TEXT,
  credibility_score NUMERIC DEFAULT 0.0,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Table pour les preuves/contributions des utilisateurs
CREATE TABLE public.quest_evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  clue_index INTEGER,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  evidence_type TEXT NOT NULL, -- 'photo', 'document', 'location', 'testimony', 'artifact'
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  location_name TEXT,
  validation_status TEXT DEFAULT 'pending', -- 'pending', 'validated', 'disputed', 'rejected'
  validation_score NUMERIC DEFAULT 0.0,
  validation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Table pour les validations communautaires des preuves
CREATE TABLE public.evidence_validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES public.quest_evidence(id) ON DELETE CASCADE,
  validator_id UUID NOT NULL REFERENCES auth.users(id),
  vote_type TEXT NOT NULL, -- 'validate', 'dispute', 'reject'
  expertise_level TEXT DEFAULT 'amateur', -- 'amateur', 'enthusiast', 'expert', 'academic'
  comment TEXT,
  confidence_score INTEGER DEFAULT 50, -- 1-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(evidence_id, validator_id)
);

-- Table pour les discussions par indice/lieu
CREATE TABLE public.quest_discussions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  clue_index INTEGER,
  location_id TEXT, -- Identifiant du lieu de discussion
  topic_type TEXT NOT NULL, -- 'clue_analysis', 'location_theory', 'evidence_review', 'general'
  title TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  pinned BOOLEAN DEFAULT false,
  locked BOOLEAN DEFAULT false,
  replies_count INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les réponses aux discussions
CREATE TABLE public.quest_discussion_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discussion_id UUID NOT NULL REFERENCES public.quest_discussions(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  content TEXT NOT NULL,
  reply_to_id UUID REFERENCES public.quest_discussion_replies(id),
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les théories/hypothèses collaboratives
CREATE TABLE public.quest_theories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  theory_type TEXT DEFAULT 'hypothesis', -- 'hypothesis', 'interpretation', 'connection', 'solution'
  supporting_evidence JSONB DEFAULT '[]'::jsonb, -- Array of evidence IDs
  confidence_level INTEGER DEFAULT 50, -- 1-100
  community_score NUMERIC DEFAULT 0.0,
  votes_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'archived', 'debunked', 'validated'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour les votes sur les théories
CREATE TABLE public.theory_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  theory_id UUID NOT NULL REFERENCES public.quest_theories(id) ON DELETE CASCADE,
  voter_id UUID NOT NULL REFERENCES auth.users(id),
  vote_type TEXT NOT NULL, -- 'support', 'oppose', 'neutral'
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(theory_id, voter_id)
);

-- Table pour les lieux emblématiques/points d'intérêt
CREATE TABLE public.quest_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  location_type TEXT NOT NULL, -- 'historical_site', 'archaeological', 'landmark', 'clue_location', 'discovery_site'
  historical_significance TEXT,
  current_status TEXT, -- 'accessible', 'restricted', 'private', 'destroyed', 'lost'
  images JSONB DEFAULT '[]'::jsonb,
  sources JSONB DEFAULT '[]'::jsonb,
  added_by UUID REFERENCES auth.users(id),
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table pour l'expertise des utilisateurs
CREATE TABLE public.user_expertise (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  expertise_area TEXT NOT NULL, -- 'history', 'archaeology', 'linguistics', 'geography', 'art_history', etc.
  level TEXT NOT NULL, -- 'amateur', 'enthusiast', 'student', 'professional', 'expert', 'academic'
  credentials TEXT,
  verified BOOLEAN DEFAULT false,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, expertise_area)
);

-- Activer RLS sur toutes les nouvelles tables
ALTER TABLE public.quest_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_theories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theory_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_expertise ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour quest_documents
CREATE POLICY "Documents are viewable by all users" ON public.quest_documents FOR SELECT USING (true);
CREATE POLICY "Users can upload documents" ON public.quest_documents FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Document uploaders and admins can edit" ON public.quest_documents FOR UPDATE USING (
  auth.uid() = uploaded_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques RLS pour quest_evidence
CREATE POLICY "Evidence is viewable by all users" ON public.quest_evidence FOR SELECT USING (true);
CREATE POLICY "Users can submit evidence" ON public.quest_evidence FOR INSERT WITH CHECK (auth.uid() = submitted_by);
CREATE POLICY "Evidence submitters and admins can edit" ON public.quest_evidence FOR UPDATE USING (
  auth.uid() = submitted_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques RLS pour evidence_validations
CREATE POLICY "Validations are viewable by all users" ON public.evidence_validations FOR SELECT USING (true);
CREATE POLICY "Users can validate evidence" ON public.evidence_validations FOR INSERT WITH CHECK (auth.uid() = validator_id);
CREATE POLICY "Validators can edit their validations" ON public.evidence_validations FOR UPDATE USING (auth.uid() = validator_id);

-- Politiques RLS pour quest_discussions
CREATE POLICY "Discussions are viewable by all users" ON public.quest_discussions FOR SELECT USING (true);
CREATE POLICY "Users can create discussions" ON public.quest_discussions FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Discussion creators and admins can edit" ON public.quest_discussions FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques RLS pour quest_discussion_replies
CREATE POLICY "Replies are viewable by all users" ON public.quest_discussion_replies FOR SELECT USING (true);
CREATE POLICY "Users can reply to discussions" ON public.quest_discussion_replies FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Reply authors can edit their replies" ON public.quest_discussion_replies FOR UPDATE USING (auth.uid() = author_id);

-- Politiques RLS pour quest_theories
CREATE POLICY "Theories are viewable by all users" ON public.quest_theories FOR SELECT USING (true);
CREATE POLICY "Users can create theories" ON public.quest_theories FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Theory authors and admins can edit" ON public.quest_theories FOR UPDATE USING (
  auth.uid() = author_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques RLS pour theory_votes
CREATE POLICY "Votes are viewable by all users" ON public.theory_votes FOR SELECT USING (true);
CREATE POLICY "Users can vote on theories" ON public.theory_votes FOR INSERT WITH CHECK (auth.uid() = voter_id);
CREATE POLICY "Voters can change their votes" ON public.theory_votes FOR UPDATE USING (auth.uid() = voter_id);

-- Politiques RLS pour quest_locations
CREATE POLICY "Locations are viewable by all users" ON public.quest_locations FOR SELECT USING (true);
CREATE POLICY "Users can add locations" ON public.quest_locations FOR INSERT WITH CHECK (auth.uid() = added_by);
CREATE POLICY "Location submitters and admins can edit" ON public.quest_locations FOR UPDATE USING (
  auth.uid() = added_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques RLS pour user_expertise
CREATE POLICY "Expertise is viewable by all users" ON public.user_expertise FOR SELECT USING (true);
CREATE POLICY "Users can add their expertise" ON public.user_expertise FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can edit their expertise" ON public.user_expertise FOR UPDATE USING (auth.uid() = user_id);

-- Triggers pour mettre à jour les compteurs
CREATE OR REPLACE FUNCTION update_discussion_replies_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.quest_discussions
    SET replies_count = replies_count + 1,
        last_activity_at = now()
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.quest_discussions
    SET replies_count = replies_count - 1
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER discussion_replies_count_trigger
  AFTER INSERT OR DELETE ON public.quest_discussion_replies
  FOR EACH ROW EXECUTE FUNCTION update_discussion_replies_count();

-- Fonction pour calculer le score de validation des preuves
CREATE OR REPLACE FUNCTION calculate_evidence_validation_score(p_evidence_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  validate_count INTEGER;
  dispute_count INTEGER;
  reject_count INTEGER;
  total_votes INTEGER;
  weighted_score NUMERIC;
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE vote_type = 'validate') as validates,
    COUNT(*) FILTER (WHERE vote_type = 'dispute') as disputes,
    COUNT(*) FILTER (WHERE vote_type = 'reject') as rejects,
    COUNT(*) as total
  FROM public.evidence_validations 
  WHERE evidence_id = p_evidence_id
  INTO validate_count, dispute_count, reject_count, total_votes;
  
  IF total_votes = 0 THEN
    RETURN 0.0;
  END IF;
  
  -- Score pondéré : validate=1, dispute=0, reject=-1
  weighted_score := (validate_count * 1.0 + dispute_count * 0.0 + reject_count * (-1.0)) / total_votes;
  
  RETURN ROUND(weighted_score, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour mettre à jour le score de validation automatiquement
CREATE OR REPLACE FUNCTION update_evidence_validation_score()
RETURNS TRIGGER AS $$
DECLARE
  new_score NUMERIC;
  validation_count INTEGER;
BEGIN
  -- Calculer le nouveau score
  new_score := calculate_evidence_validation_score(COALESCE(NEW.evidence_id, OLD.evidence_id));
  
  -- Compter le nombre de validations
  SELECT COUNT(*) INTO validation_count
  FROM public.evidence_validations 
  WHERE evidence_id = COALESCE(NEW.evidence_id, OLD.evidence_id);
  
  -- Mettre à jour le score et le statut
  UPDATE public.quest_evidence 
  SET 
    validation_score = new_score,
    validation_count = validation_count,
    validation_status = CASE 
      WHEN validation_count >= 3 AND new_score >= 0.6 THEN 'validated'
      WHEN validation_count >= 3 AND new_score <= -0.6 THEN 'rejected'
      WHEN validation_count >= 2 AND new_score < 0.3 AND new_score > -0.3 THEN 'disputed'
      ELSE 'pending'
    END,
    updated_at = now()
  WHERE id = COALESCE(NEW.evidence_id, OLD.evidence_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER evidence_validation_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.evidence_validations
  FOR EACH ROW EXECUTE FUNCTION update_evidence_validation_score();
