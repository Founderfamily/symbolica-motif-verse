-- Corriger la fonction pour utiliser la bonne structure de cultural_periods
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
    COALESCE(tp.display_order, 999) as temporal_period_order,
    tp.name as temporal_period_name,
    cp.specific_name as cultural_period_name
  FROM public.collection_symbols cs
  JOIN public.symbols s ON cs.symbol_id = s.id
  LEFT JOIN public.cultural_periods cp ON s.cultural_taxonomy_code = cp.cultural_taxonomy_code AND s.period = cp.specific_name
  LEFT JOIN public.temporal_periods tp ON cp.temporal_period_id = tp.id
  WHERE cs.collection_id = p_collection_id
  ORDER BY cs.position;
END;
$function$;