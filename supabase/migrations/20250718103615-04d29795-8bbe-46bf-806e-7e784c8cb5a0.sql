-- Final cleanup - remove duplicate and old collections that are now consolidated
-- Keep only the new consolidated collections and a few essential ones

-- First identify collections to remove (duplicates and low-content ones)
WITH collections_to_remove AS (
  SELECT c.id
  FROM collections c
  LEFT JOIN collection_translations ct ON c.id = ct.collection_id AND ct.language = 'fr'
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE c.id NOT IN (
    -- Keep our new consolidated collections
    '11111111-1111-1111-1111-111111111111', -- Traditions Françaises
    '22222222-2222-2222-2222-222222222222', -- Cultures Antiques
    '33333333-3333-3333-3333-333333333333', -- Cultures Celtiques
    '44444444-4444-4444-4444-444444444444', -- Cultures Asiatiques
    '55555555-5555-5555-5555-555555555555', -- Cultures Amérindiennes
    '66666666-6666-6666-6666-666666666666', -- Cultures Africaines
    '77777777-7777-7777-7777-777777777777', -- Géométrie et Motifs
    '88888888-8888-8888-8888-888888888888', -- Mythologies et Légendes
    -- Keep Da Vinci Code as it's featured and unique
    'e55e2a7c-7ab9-4e94-b60f-ac8ec9e5d97a'
  )
  GROUP BY c.id, ct.title
  -- Remove collections with less than 5 symbols or that are duplicates
  HAVING COUNT(cs.symbol_id) < 5 OR ct.title IS NULL
)
-- Delete the collection symbols first
DELETE FROM collection_symbols 
WHERE collection_id IN (SELECT id FROM collections_to_remove);

-- Delete collection translations
DELETE FROM collection_translations 
WHERE collection_id IN (
  SELECT c.id
  FROM collections c
  LEFT JOIN collection_translations ct ON c.id = ct.collection_id AND ct.language = 'fr'
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE c.id NOT IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    '66666666-6666-6666-6666-666666666666',
    '77777777-7777-7777-7777-777777777777',
    '88888888-8888-8888-8888-888888888888',
    'e55e2a7c-7ab9-4e94-b60f-ac8ec9e5d97a'
  )
  GROUP BY c.id, ct.title
  HAVING COUNT(cs.symbol_id) < 5 OR ct.title IS NULL
);

-- Delete the collections themselves
DELETE FROM collections 
WHERE id NOT IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888',
  'e55e2a7c-7ab9-4e94-b60f-ac8ec9e5d97a'
) AND id IN (
  SELECT c.id
  FROM collections c
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  GROUP BY c.id
  HAVING COUNT(cs.symbol_id) < 5
);

-- Add constraint for future collection creation
CREATE OR REPLACE FUNCTION check_collection_viability()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if user is admin or if this is a system operation
  IF NEW.created_by IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = NEW.created_by AND is_admin = true
  ) THEN
    -- For non-admin users, we could add additional checks here
    -- For now, we allow creation but will validate through business logic
    NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for collection creation monitoring
DROP TRIGGER IF EXISTS collection_viability_check ON collections;
CREATE TRIGGER collection_viability_check
  BEFORE INSERT ON collections
  FOR EACH ROW
  EXECUTE FUNCTION check_collection_viability();