
-- Fonction optimisée pour récupérer les symboles avec pagination et filtres
CREATE OR REPLACE FUNCTION get_symbols_paginated(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_search TEXT DEFAULT NULL,
  p_culture_filter TEXT DEFAULT NULL,
  p_period_filter TEXT DEFAULT NULL,
  p_sort_column TEXT DEFAULT 'created_at',
  p_sort_direction TEXT DEFAULT 'DESC'
)
RETURNS TABLE(
  id uuid,
  name text,
  culture text,
  period text,
  description text,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  image_count bigint,
  verification_count bigint,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  query_text TEXT;
  count_query TEXT;
BEGIN
  -- Construction de la requête de base
  query_text := '
    SELECT 
      s.id,
      s.name,
      s.culture,
      s.period,
      s.description,
      s.created_at,
      s.updated_at,
      COALESCE(img_count.count, 0) as image_count,
      COALESCE(ver_count.count, 0) as verification_count,
      COUNT(*) OVER() as total_count
    FROM public.symbols s
    LEFT JOIN (
      SELECT symbol_id, COUNT(*) as count 
      FROM public.symbol_images 
      GROUP BY symbol_id
    ) img_count ON s.id = img_count.symbol_id
    LEFT JOIN (
      SELECT symbol_id, COUNT(*) as count 
      FROM public.symbol_verifications 
      GROUP BY symbol_id
    ) ver_count ON s.id = ver_count.symbol_id
    WHERE 1=1';

  -- Ajout des filtres
  IF p_search IS NOT NULL AND p_search != '' THEN
    query_text := query_text || ' AND (s.name ILIKE ''%' || p_search || '%'' OR s.description ILIKE ''%' || p_search || '%'' OR s.culture ILIKE ''%' || p_search || '%'')';
  END IF;

  IF p_culture_filter IS NOT NULL AND p_culture_filter != '' THEN
    query_text := query_text || ' AND s.culture = ''' || p_culture_filter || '''';
  END IF;

  IF p_period_filter IS NOT NULL AND p_period_filter != '' THEN
    query_text := query_text || ' AND s.period = ''' || p_period_filter || '''';
  END IF;

  -- Ajout du tri
  IF p_sort_column IN ('name', 'culture', 'period', 'created_at', 'updated_at') THEN
    query_text := query_text || ' ORDER BY s.' || p_sort_column;
    IF p_sort_direction = 'ASC' THEN
      query_text := query_text || ' ASC';
    ELSE
      query_text := query_text || ' DESC';
    END IF;
  ELSE
    query_text := query_text || ' ORDER BY s.created_at DESC';
  END IF;

  -- Ajout de la pagination
  query_text := query_text || ' LIMIT ' || p_limit || ' OFFSET ' || p_offset;

  -- Exécution de la requête
  RETURN QUERY EXECUTE query_text;
END;
$$;

-- Fonction pour obtenir les statistiques des symboles
CREATE OR REPLACE FUNCTION get_symbols_stats()
RETURNS TABLE(
  total_symbols bigint,
  cultures_count bigint,
  periods_count bigint,
  verified_symbols bigint,
  symbols_with_images bigint,
  recent_symbols_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM public.symbols) as total_symbols,
    (SELECT COUNT(DISTINCT culture) FROM public.symbols WHERE culture IS NOT NULL) as cultures_count,
    (SELECT COUNT(DISTINCT period) FROM public.symbols WHERE period IS NOT NULL) as periods_count,
    (SELECT COUNT(DISTINCT s.id) FROM public.symbols s 
     INNER JOIN public.symbol_verifications sv ON s.id = sv.symbol_id) as verified_symbols,
    (SELECT COUNT(DISTINCT s.id) FROM public.symbols s 
     INNER JOIN public.symbol_images si ON s.id = si.symbol_id) as symbols_with_images,
    (SELECT COUNT(*) FROM public.symbols WHERE created_at >= NOW() - INTERVAL '7 days') as recent_symbols_count;
END;
$$;

-- Fonction pour obtenir les filtres disponibles
CREATE OR REPLACE FUNCTION get_symbols_filters()
RETURNS TABLE(
  filter_type text,
  filter_value text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 'culture'::text as filter_type, culture as filter_value, COUNT(*) as count
  FROM public.symbols 
  WHERE culture IS NOT NULL AND culture != ''
  GROUP BY culture
  ORDER BY count DESC, culture
  
  UNION ALL
  
  SELECT 'period'::text as filter_type, period as filter_value, COUNT(*) as count
  FROM public.symbols 
  WHERE period IS NOT NULL AND period != ''
  GROUP BY period
  ORDER BY count DESC, period;
END;
$$;

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_symbols_search ON public.symbols USING gin(to_tsvector('french', name || ' ' || COALESCE(description, '') || ' ' || culture));
CREATE INDEX IF NOT EXISTS idx_symbols_culture ON public.symbols(culture);
CREATE INDEX IF NOT EXISTS idx_symbols_period ON public.symbols(period);
CREATE INDEX IF NOT EXISTS idx_symbols_created_at ON public.symbols(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_symbols_updated_at ON public.symbols(updated_at DESC);
