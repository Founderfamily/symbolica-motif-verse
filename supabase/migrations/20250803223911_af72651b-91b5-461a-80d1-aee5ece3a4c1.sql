-- Supprimer l'ancienne fonction et recréer avec les bonnes colonnes
DROP FUNCTION IF EXISTS public.insert_ai_investigation(uuid,text,jsonb,jsonb,uuid);

CREATE OR REPLACE FUNCTION public.insert_ai_investigation(
  p_quest_id uuid, 
  p_investigation_type text, 
  p_evidence_used jsonb, 
  p_result_content jsonb, 
  p_user_id uuid DEFAULT NULL::uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  investigation_id UUID;
BEGIN
  -- Insérer l'investigation avec les bonnes colonnes
  INSERT INTO public.ai_investigations (
    quest_id,
    investigation_type,
    evidence_used,
    result_content,
    created_by
  ) VALUES (
    p_quest_id,
    p_investigation_type,
    p_evidence_used,
    p_result_content,
    p_user_id
  ) RETURNING id INTO investigation_id;
  
  RETURN investigation_id;
END;
$function$