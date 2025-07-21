-- Fonction temporaire qui trie les symboles par ordre chronologique logique
CREATE OR REPLACE FUNCTION public.get_collection_symbols_with_temporal_periods(p_collection_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  culture text,
  period text,
  created_at timestamp with time zone,
  symbol_position integer,
  image_url text,
  temporal_period_order integer,
  temporal_period_name text,
  cultural_period_name text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.description,
    s.culture,
    s.period,
    s.created_at,
    cs.position as symbol_position,
    (SELECT si.image_url FROM public.symbol_images si WHERE si.symbol_id = s.id AND si.is_primary = true LIMIT 1) as image_url,
    -- Ordre chronologique basé sur l'analyse des périodes existantes
    CASE 
      WHEN s.period ILIKE '%âge du fer%' OR s.period ILIKE '%gauloise%' THEN 1
      WHEN s.period ILIKE '%antiquité%' OR s.period ILIKE '%gallo-romain%' THEN 2
      WHEN s.period ILIKE '%moyen%âge%' OR s.period ILIKE '%moyen-âge%' OR s.period ILIKE '%médiéval%' THEN 3
      WHEN s.period ILIKE '%renaissance%' OR s.period ILIKE '%xvie%' THEN 4
      WHEN s.period ILIKE '%moderne%' OR s.period ILIKE '%xviie%' OR s.period ILIKE '%xviiie%' THEN 5
      WHEN s.period ILIKE '%19e%' OR s.period ILIKE '%xixe%' THEN 6
      WHEN s.period ILIKE '%seconde guerre mondiale%' OR s.period ILIKE '%20e%' OR s.period ILIKE '%xxe%' THEN 7
      WHEN s.period ILIKE '%aujourd''hui%' OR s.period ILIKE '%contemporain%' THEN 8
      ELSE 999
    END as temporal_period_order,
    -- Nom de période standardisé
    CASE 
      WHEN s.period ILIKE '%âge du fer%' OR s.period ILIKE '%gauloise%' THEN 'Âge du Fer'
      WHEN s.period ILIKE '%antiquité%' OR s.period ILIKE '%gallo-romain%' THEN 'Antiquité'
      WHEN s.period ILIKE '%moyen%âge%' OR s.period ILIKE '%moyen-âge%' OR s.period ILIKE '%médiéval%' THEN 'Moyen Âge'
      WHEN s.period ILIKE '%renaissance%' OR s.period ILIKE '%xvie%' THEN 'Renaissance'
      WHEN s.period ILIKE '%moderne%' OR s.period ILIKE '%xviie%' OR s.period ILIKE '%xviiie%' THEN 'Époque Moderne'
      WHEN s.period ILIKE '%19e%' OR s.period ILIKE '%xixe%' THEN 'XIXe siècle'
      WHEN s.period ILIKE '%seconde guerre mondiale%' OR s.period ILIKE '%20e%' OR s.period ILIKE '%xxe%' THEN 'XXe siècle'
      WHEN s.period ILIKE '%aujourd''hui%' OR s.period ILIKE '%contemporain%' THEN 'Époque Contemporaine'
      ELSE s.period
    END as temporal_period_name,
    s.period as cultural_period_name
  FROM public.collection_symbols cs
  JOIN public.symbols s ON cs.symbol_id = s.id
  WHERE cs.collection_id = p_collection_id
  ORDER BY 
    -- Tri par ordre chronologique puis par position originale
    CASE 
      WHEN s.period ILIKE '%âge du fer%' OR s.period ILIKE '%gauloise%' THEN 1
      WHEN s.period ILIKE '%antiquité%' OR s.period ILIKE '%gallo-romain%' THEN 2
      WHEN s.period ILIKE '%moyen%âge%' OR s.period ILIKE '%moyen-âge%' OR s.period ILIKE '%médiéval%' THEN 3
      WHEN s.period ILIKE '%renaissance%' OR s.period ILIKE '%xvie%' THEN 4
      WHEN s.period ILIKE '%moderne%' OR s.period ILIKE '%xviie%' OR s.period ILIKE '%xviiie%' THEN 5
      WHEN s.period ILIKE '%19e%' OR s.period ILIKE '%xixe%' THEN 6
      WHEN s.period ILIKE '%seconde guerre mondiale%' OR s.period ILIKE '%20e%' OR s.period ILIKE '%xxe%' THEN 7
      WHEN s.period ILIKE '%aujourd''hui%' OR s.period ILIKE '%contemporain%' THEN 8
      ELSE 999
    END,
    cs.position;
END;
$function$;