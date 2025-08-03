-- Créer une fonction SECURITY DEFINER pour insérer des investigations IA
CREATE OR REPLACE FUNCTION public.insert_ai_investigation(
  p_quest_id UUID,
  p_investigation_type TEXT,
  p_request_data JSONB,
  p_result JSONB,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  investigation_id UUID;
BEGIN
  -- Insérer l'investigation avec ou sans utilisateur
  INSERT INTO public.ai_investigations (
    quest_id,
    investigation_type,
    request_data,
    result,
    created_by
  ) VALUES (
    p_quest_id,
    p_investigation_type,
    p_request_data,
    p_result,
    p_user_id
  ) RETURNING id INTO investigation_id;
  
  RETURN investigation_id;
END;
$$;

-- Supprimer les anciennes politiques RLS
DROP POLICY IF EXISTS "Users can insert their own investigations" ON public.ai_investigations;
DROP POLICY IF EXISTS "Users can view their own investigations" ON public.ai_investigations;
DROP POLICY IF EXISTS "Users can view investigations for accessible quests" ON public.ai_investigations;

-- Créer de nouvelles politiques RLS plus flexibles
CREATE POLICY "Anyone can view ai investigations" 
ON public.ai_investigations 
FOR SELECT 
USING (true);

CREATE POLICY "System can insert ai investigations" 
ON public.ai_investigations 
FOR INSERT 
WITH CHECK (true);

-- Permettre `created_by` NULL pour les investigations anonymes
ALTER TABLE public.ai_investigations 
ALTER COLUMN created_by DROP NOT NULL;