-- Créer une vue pour les collections avec leurs symboles
CREATE OR REPLACE VIEW collections_with_symbols AS
SELECT 
  c.id,
  c.slug,
  c.created_by,
  c.created_at,
  c.updated_at,
  c.is_featured,
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'id', ct.id,
        'collection_id', ct.collection_id,
        'language', ct.language,
        'title', ct.title,
        'description', ct.description
      )
    ) FILTER (WHERE ct.id IS NOT NULL),
    '[]'::jsonb
  ) as collection_translations,
  COALESCE(
    jsonb_agg(
      DISTINCT jsonb_build_object(
        'position', cs.position,
        'symbol_id', cs.symbol_id,
        'symbols', jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'culture', s.culture,
          'period', s.period,
          'description', s.description,
          'created_at', s.created_at,
          'updated_at', s.updated_at,
          'medium', s.medium,
          'technique', s.technique,
          'function', s.function,
          'translations', s.translations
        )
      )
    ) FILTER (WHERE cs.symbol_id IS NOT NULL),
    '[]'::jsonb
  ) as collection_symbols
FROM collections c
LEFT JOIN collection_translations ct ON c.id = ct.collection_id
LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
LEFT JOIN symbols s ON cs.symbol_id = s.id
GROUP BY c.id, c.slug, c.created_by, c.created_at, c.updated_at, c.is_featured;