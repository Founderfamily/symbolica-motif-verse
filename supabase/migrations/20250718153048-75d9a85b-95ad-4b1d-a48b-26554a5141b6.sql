
-- Ajouter le rôle symbol_validator à l'enum existant
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'symbol_validator';

-- Ajouter des colonnes pour améliorer le système de contributions
ALTER TABLE public.user_contributions 
ADD COLUMN IF NOT EXISTS significance TEXT,
ADD COLUMN IF NOT EXISTS historical_context TEXT,
ADD COLUMN IF NOT EXISTS sources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS validator_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS validator_comments TEXT,
ADD COLUMN IF NOT EXISTS validation_score INTEGER CHECK (validation_score >= 1 AND validation_score <= 5),
ADD COLUMN IF NOT EXISTS revision_requested BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS community_score DECIMAL(3,2) DEFAULT 0.0;

-- Table pour les révisions demandées
CREATE TABLE IF NOT EXISTS public.contribution_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.user_contributions(id) ON DELETE CASCADE,
  validator_id UUID NOT NULL REFERENCES auth.users(id),
  revision_type TEXT NOT NULL CHECK (revision_type IN ('content', 'sources', 'images', 'classification')),
  requested_changes TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'addressed', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les votes communautaires sur les contributions
CREATE TABLE IF NOT EXISTS public.contribution_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contribution_id UUID NOT NULL REFERENCES public.user_contributions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('approve', 'reject', 'needs_work')),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(contribution_id, user_id)
);

-- Politiques RLS pour les nouvelles tables
ALTER TABLE public.contribution_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contribution_votes ENABLE ROW LEVEL SECURITY;

-- Politiques pour contribution_revisions
CREATE POLICY "Validators can create revision requests" ON public.contribution_revisions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'symbol_validator'))
  );

CREATE POLICY "Contributors and validators can view revisions" ON public.contribution_revisions
  FOR SELECT USING (
    validator_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.user_contributions WHERE id = contribution_revisions.contribution_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'symbol_validator'))
  );

CREATE POLICY "Contributors can update revision status" ON public.contribution_revisions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_contributions WHERE id = contribution_revisions.contribution_id AND user_id = auth.uid())
  );

-- Politiques pour contribution_votes
CREATE POLICY "Users can vote on contributions" ON public.contribution_votes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view all votes" ON public.contribution_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own votes" ON public.contribution_votes
  FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour calculer le score communautaire
CREATE OR REPLACE FUNCTION public.calculate_community_score(p_contribution_id UUID)
RETURNS DECIMAL(3,2)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  approve_count INTEGER;
  reject_count INTEGER;
  total_votes INTEGER;
  score DECIMAL(3,2);
BEGIN
  SELECT 
    COUNT(*) FILTER (WHERE vote_type = 'approve') as approves,
    COUNT(*) FILTER (WHERE vote_type = 'reject') as rejects,
    COUNT(*) as total
  FROM public.contribution_votes 
  WHERE contribution_id = p_contribution_id
  INTO approve_count, reject_count, total_votes;
  
  IF total_votes = 0 THEN
    RETURN 0.0;
  END IF;
  
  score := (approve_count::DECIMAL / total_votes::DECIMAL) * 5.0;
  RETURN ROUND(score, 2);
END;
$$;

-- Trigger pour mettre à jour le score communautaire
CREATE OR REPLACE FUNCTION public.update_community_score()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.user_contributions 
  SET community_score = public.calculate_community_score(COALESCE(NEW.contribution_id, OLD.contribution_id))
  WHERE id = COALESCE(NEW.contribution_id, OLD.contribution_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER update_community_score_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.contribution_votes
  FOR EACH ROW EXECUTE FUNCTION public.update_community_score();

-- Fonction pour assigner le rôle de validateur de symboles
CREATE OR REPLACE FUNCTION public.assign_symbol_validator_role(
  p_admin_id UUID,
  p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Vérifier que l'admin a les permissions
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_admin_id AND role = 'admin') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;
  
  -- Assigner le rôle
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (p_user_id, 'symbol_validator', p_admin_id)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Logger l'action
  INSERT INTO public.admin_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (
    p_admin_id,
    'assign_symbol_validator_role',
    'user',
    p_user_id,
    jsonb_build_object('assigned_at', now())
  );
END;
$$;
