
-- Corriger la fonction convert_contribution_to_symbol pour résoudre le conflit de noms
CREATE OR REPLACE FUNCTION public.convert_contribution_to_symbol(p_contribution_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  contribution_record RECORD;
  new_symbol_id uuid;
  target_collection_id uuid;
BEGIN
  -- Récupérer les données de la contribution
  SELECT * FROM public.user_contributions 
  WHERE id = p_contribution_id AND status = 'approved'
  INTO contribution_record;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Contribution not found or not approved';
  END IF;
  
  -- Créer le symbole
  INSERT INTO public.symbols (
    name,
    culture,
    period,
    description,
    translations
  ) VALUES (
    contribution_record.title,
    contribution_record.cultural_context,
    contribution_record.period,
    contribution_record.description,
    jsonb_build_object(
      'fr', jsonb_build_object(
        'name', contribution_record.title,
        'description', contribution_record.description
      ),
      'en', jsonb_build_object(
        'name', contribution_record.title,
        'description', contribution_record.description
      )
    )
  ) RETURNING id INTO new_symbol_id;
  
  -- Trouver la collection appropriée basée sur la culture
  SELECT c.id INTO target_collection_id
  FROM public.collections c
  JOIN public.collection_translations ct ON c.id = ct.collection_id
  WHERE LOWER(ct.title) LIKE '%' || LOWER(contribution_record.cultural_context) || '%'
    OR LOWER(ct.title) LIKE '%' || LOWER(SPLIT_PART(contribution_record.cultural_context, ' ', 1)) || '%'
  LIMIT 1;
  
  -- Si une collection est trouvée, ajouter le symbole
  IF target_collection_id IS NOT NULL THEN
    INSERT INTO public.collection_symbols (collection_id, symbol_id, position)
    VALUES (
      target_collection_id, 
      new_symbol_id, 
      COALESCE((SELECT MAX(position) FROM public.collection_symbols WHERE collection_id = target_collection_id), 0) + 1
    );
  END IF;
  
  -- Copier les images de la contribution vers le symbole
  INSERT INTO public.symbol_images (symbol_id, image_url, image_type, title, description)
  SELECT 
    new_symbol_id,
    ci.image_url,
    'primary'::symbol_image_type,
    contribution_record.title,
    contribution_record.description
  FROM public.contribution_images ci
  WHERE ci.contribution_id = p_contribution_id;
  
  -- Logger l'action
  INSERT INTO public.admin_logs (admin_id, action, entity_type, entity_id, details)
  VALUES (
    contribution_record.reviewed_by,
    'convert_contribution_to_symbol',
    'symbol',
    new_symbol_id,
    jsonb_build_object(
      'contribution_id', p_contribution_id,
      'collection_id', target_collection_id,
      'culture', contribution_record.cultural_context
    )
  );
  
  RETURN new_symbol_id;
END;
$function$;
