-- Fonction pour nettoyer les articles au début des noms de symboles
CREATE OR REPLACE FUNCTION public.clean_symbol_name(input_name text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  cleaned_name text;
BEGIN
  cleaned_name := input_name;
  
  -- Supprimer "Le " au début (avec espace)
  IF cleaned_name ILIKE 'Le %' THEN
    cleaned_name := SUBSTRING(cleaned_name FROM 4);
  END IF;
  
  -- Supprimer "La " au début (avec espace)
  IF cleaned_name ILIKE 'La %' THEN
    cleaned_name := SUBSTRING(cleaned_name FROM 4);
  END IF;
  
  -- Supprimer "Les " au début (avec espace)
  IF cleaned_name ILIKE 'Les %' THEN
    cleaned_name := SUBSTRING(cleaned_name FROM 5);
  END IF;
  
  -- Supprimer "L'" au début
  IF cleaned_name ILIKE 'L''%' THEN
    cleaned_name := SUBSTRING(cleaned_name FROM 3);
  END IF;
  
  -- Mettre en majuscule la première lettre
  cleaned_name := UPPER(LEFT(cleaned_name, 1)) || SUBSTRING(cleaned_name FROM 2);
  
  RETURN cleaned_name;
END;
$$;

-- Mettre à jour les noms de symboles qui commencent par des articles
UPDATE public.symbols 
SET name = public.clean_symbol_name(name)
WHERE name ILIKE 'Le %' 
   OR name ILIKE 'La %' 
   OR name ILIKE 'Les %' 
   OR name ILIKE 'L''%';

-- Logger les modifications effectuées
INSERT INTO public.admin_logs (admin_id, action, entity_type, details)
SELECT 
  '00000000-0000-0000-0000-000000000000'::uuid, -- ID système pour les migrations automatiques
  'clean_symbol_names',
  'symbol',
  jsonb_build_object(
    'description', 'Suppression automatique des articles au début des noms de symboles',
    'symbols_updated', COUNT(*),
    'migration_date', now()
  )
FROM public.symbols 
WHERE name ILIKE 'Le %' 
   OR name ILIKE 'La %' 
   OR name ILIKE 'Les %' 
   OR name ILIKE 'L''%';

-- Supprimer la fonction temporaire après utilisation
DROP FUNCTION public.clean_symbol_name(text);