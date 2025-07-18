-- Final collection reorganization - handle all duplicates with UPSERT approach

-- Step 1: Clean up any existing duplicates
DELETE FROM collection_symbols cs1 
USING collection_symbols cs2 
WHERE cs1.collection_id = cs2.collection_id 
AND cs1.symbol_id = cs2.symbol_id 
AND cs1.ctid > cs2.ctid;

-- Step 2: Create a temporary table to reorganize symbols safely
CREATE TEMP TABLE symbol_reassignments AS 
SELECT 
  cs.symbol_id,
  CASE 
    -- Asian symbols go to Cultures Asiatiques
    WHEN (s.name ILIKE '%seigaiha%' OR s.name ILIKE '%om%' OR s.name ILIKE '%mandala%'
          OR s.culture ILIKE '%japon%' OR s.culture ILIKE '%asie%' OR s.culture ILIKE '%inde%')
      THEN '44444444-4444-4444-4444-444444444444'::uuid
    -- African/Oceanic symbols go to Cultures Africaines  
    WHEN (s.name ILIKE '%aborig%' OR s.name ILIKE '%maori%' OR s.name ILIKE '%adinkra%'
          OR s.culture ILIKE '%aborig%' OR s.culture ILIKE '%maori%' 
          OR s.culture ILIKE '%afric%' OR s.culture ILIKE '%ghana%')
      THEN '66666666-6666-6666-6666-666666666666'::uuid
    -- Ancient/Middle Eastern symbols go to Cultures Antiques
    WHEN (s.name ILIKE '%hamsa%' OR s.name ILIKE '%arabesque%'
          OR s.culture ILIKE '%arabe%' OR s.culture ILIKE '%islam%' OR s.culture ILIKE '%orient%')
      THEN '22222222-2222-2222-2222-222222222222'::uuid
    -- Native American symbols go to Cultures Amérindiennes
    WHEN (s.name ILIKE '%totem%' OR s.name ILIKE '%dreamcatcher%' OR s.name ILIKE '%attrape%'
          OR s.culture ILIKE '%amérind%' OR s.culture ILIKE '%indien%')
      THEN '55555555-5555-5555-5555-555555555555'::uuid
    -- Celtic symbols go to Cultures Celtiques
    WHEN s.culture ILIKE '%celt%'
      THEN '33333333-3333-3333-3333-333333333333'::uuid
    -- French symbols stay in Traditions Françaises
    WHEN s.culture ILIKE '%franc%'
      THEN '11111111-1111-1111-1111-111111111111'::uuid
    -- Everything else goes to Géométrie et Motifs
    ELSE '77777777-7777-7777-7777-777777777777'::uuid
  END as new_collection_id,
  cs.collection_id as old_collection_id
FROM collection_symbols cs
JOIN symbols s ON cs.symbol_id = s.id
WHERE cs.collection_id = '11111111-1111-1111-1111-111111111111'::uuid -- Traditions Françaises
   OR cs.collection_id IN (
     SELECT DISTINCT c.id 
     FROM collections c
     JOIN collection_translations ct ON c.id = ct.collection_id
     WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333'::uuid)
     OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111'::uuid)
   );

-- Step 3: Remove symbols that need to be moved from their current collections
DELETE FROM collection_symbols 
WHERE (collection_id, symbol_id) IN (
  SELECT old_collection_id, symbol_id FROM symbol_reassignments
);

-- Step 4: Insert symbols into their new collections (handle conflicts)
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT 
  new_collection_id,
  symbol_id,
  1 -- Will be reordered later
FROM symbol_reassignments
ON CONFLICT (collection_id, symbol_id) DO NOTHING;

-- Step 5: Remove old collections completely
DELETE FROM collection_symbols 
WHERE collection_id IN (
  SELECT DISTINCT c.id 
  FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333'::uuid)
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111'::uuid)
);

DELETE FROM collection_translations 
WHERE collection_id IN (
  SELECT DISTINCT c.id 
  FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333'::uuid)
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111'::uuid)
);

DELETE FROM collections 
WHERE id IN (
  SELECT DISTINCT c.id 
  FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333'::uuid)
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111'::uuid)
);

-- Step 6: Reorder positions in all collections
UPDATE collection_symbols 
SET position = row_number() OVER (PARTITION BY collection_id ORDER BY symbol_id)
WHERE collection_id IN (
  '11111111-1111-1111-1111-111111111111'::uuid, -- Traditions Françaises
  '22222222-2222-2222-2222-222222222222'::uuid, -- Cultures Antiques
  '33333333-3333-3333-3333-333333333333'::uuid, -- Cultures Celtiques
  '44444444-4444-4444-4444-444444444444'::uuid, -- Cultures Asiatiques
  '55555555-5555-5555-5555-555555555555'::uuid, -- Cultures Amérindiennes
  '66666666-6666-6666-6666-666666666666'::uuid, -- Cultures Africaines
  '77777777-7777-7777-7777-777777777777'::uuid, -- Géométrie et Motifs
  '88888888-8888-8888-8888-888888888888'::uuid, -- Mythologies et Légendes
  'e55e2a7c-7ab9-4e94-b60f-ac8ec9e5d97a'::uuid  -- Le Code Da Vinci
);

-- Drop the temporary table
DROP TABLE symbol_reassignments;