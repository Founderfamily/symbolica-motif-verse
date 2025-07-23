-- Créer la table quest_evidence pour stocker les preuves des quêtes
CREATE TABLE public.quest_evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  evidence_type TEXT NOT NULL DEFAULT 'photo',
  image_url TEXT,
  location_latitude DECIMAL,
  location_longitude DECIMAL,
  location_name TEXT,
  submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  validation_status TEXT NOT NULL DEFAULT 'pending',
  validation_score DECIMAL DEFAULT 0.0,
  validation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table evidence_validations pour les validations des preuves
CREATE TABLE public.evidence_validations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evidence_id UUID NOT NULL REFERENCES public.quest_evidence(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('validate', 'dispute', 'reject')),
  comment TEXT,
  expertise_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(evidence_id, user_id)
);

-- Créer la table quest_activities pour l'activité en direct
CREATE TABLE public.quest_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  entity_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table quest_participants pour les utilisateurs connectés
CREATE TABLE public.quest_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(quest_id, user_id)
);

-- Activer RLS
ALTER TABLE public.quest_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_participants ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour quest_evidence
CREATE POLICY "Evidence is viewable by authenticated users" ON public.quest_evidence
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can submit evidence" ON public.quest_evidence
  FOR INSERT WITH CHECK (auth.uid() = submitted_by);

CREATE POLICY "Users can update their own evidence" ON public.quest_evidence
  FOR UPDATE USING (auth.uid() = submitted_by);

-- Politiques RLS pour evidence_validations
CREATE POLICY "Validations are viewable by authenticated users" ON public.evidence_validations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can validate evidence" ON public.evidence_validations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politiques RLS pour quest_activities
CREATE POLICY "Activities are viewable by authenticated users" ON public.quest_activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System can insert activities" ON public.quest_activities
  FOR INSERT WITH CHECK (true);

-- Politiques RLS pour quest_participants
CREATE POLICY "Participants are viewable by authenticated users" ON public.quest_participants
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join quests" ON public.quest_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their participation" ON public.quest_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Triggers pour mise à jour automatique
CREATE TRIGGER update_quest_evidence_updated_at
  BEFORE UPDATE ON public.quest_evidence
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour mettre à jour le score de validation des preuves
CREATE OR REPLACE FUNCTION public.update_evidence_validation_score()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Trigger pour mettre à jour le score de validation
CREATE TRIGGER update_evidence_validation_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.evidence_validations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_evidence_validation_score();