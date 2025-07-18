-- Final collection reorganization - corrected with proper UUID casting

-- Step 1: Remove duplicate entries first
DELETE FROM collection_symbols cs1 
USING collection_symbols cs2 
WHERE cs1.collection_id = cs2.collection_id 
AND cs1.symbol_id = cs2.symbol_id 
AND cs1.ctid > cs2.ctid;

-- Step 2: Safely move misplaced symbols from "Traditions Françaises" to their proper collections
-- Move Asian symbols to "Cultures Asiatiques"
DELETE FROM collection_symbols 
WHERE collection_id = '44444444-4444-4444-4444-444444444444'::uuid 
AND symbol_id IN (
  SELECT cs.symbol_id FROM collection_symbols cs
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE cs.collection_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND (s.name ILIKE '%seigaiha%' OR s.name ILIKE '%om%' OR s.name ILIKE '%mandala%'
       OR s.culture ILIKE '%japon%' OR s.culture ILIKE '%asie%' OR s.culture ILIKE '%inde%')
);

UPDATE collection_symbols 
SET collection_id = '44444444-4444-4444-4444-444444444444'::uuid
WHERE collection_id = '11111111-1111-1111-1111-111111111111'::uuid
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%seigaiha%' 
  OR s.name ILIKE '%om%' 
  OR s.name ILIKE '%mandala%'
  OR s.culture ILIKE '%japon%'
  OR s.culture ILIKE '%asie%'
  OR s.culture ILIKE '%inde%'
);

-- Move African/Oceanic symbols to "Cultures Africaines"
DELETE FROM collection_symbols 
WHERE collection_id = '66666666-6666-6666-6666-666666666666'::uuid
AND symbol_id IN (
  SELECT cs.symbol_id FROM collection_symbols cs
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE cs.collection_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND (s.name ILIKE '%aborig%' OR s.name ILIKE '%maori%' OR s.name ILIKE '%adinkra%'
       OR s.culture ILIKE '%aborig%' OR s.culture ILIKE '%maori%' OR s.culture ILIKE '%afric%' OR s.culture ILIKE '%ghana%')
);

UPDATE collection_symbols 
SET collection_id = '66666666-6666-6666-6666-666666666666'::uuid
WHERE collection_id = '11111111-1111-1111-1111-111111111111'::uuid
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%aborig%' 
  OR s.name ILIKE '%maori%'
  OR s.name ILIKE '%adinkra%'
  OR s.culture ILIKE '%aborig%'
  OR s.culture ILIKE '%maori%'
  OR s.culture ILIKE '%afric%'
  OR s.culture ILIKE '%ghana%'
);

-- Move Ancient/Middle Eastern symbols to "Cultures Antiques"
DELETE FROM collection_symbols 
WHERE collection_id = '22222222-2222-2222-2222-222222222222'::uuid
AND symbol_id IN (
  SELECT cs.symbol_id FROM collection_symbols cs
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE cs.collection_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND (s.name ILIKE '%hamsa%' OR s.name ILIKE '%arabesque%'
       OR s.culture ILIKE '%arabe%' OR s.culture ILIKE '%islam%' OR s.culture ILIKE '%orient%')
);

UPDATE collection_symbols 
SET collection_id = '22222222-2222-2222-2222-222222222222'::uuid
WHERE collection_id = '11111111-1111-1111-1111-111111111111'::uuid
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%hamsa%' 
  OR s.name ILIKE '%arabesque%'
  OR s.culture ILIKE '%arabe%'
  OR s.culture ILIKE '%islam%'
  OR s.culture ILIKE '%orient%'
);

-- Move Native American symbols to "Cultures Amérindiennes"
DELETE FROM collection_symbols 
WHERE collection_id = '55555555-5555-5555-5555-555555555555'::uuid
AND symbol_id IN (
  SELECT cs.symbol_id FROM collection_symbols cs
  JOIN symbols s ON cs.symbol_id = s.id
  WHERE cs.collection_id = '11111111-1111-1111-1111-111111111111'::uuid
  AND (s.name ILIKE '%totem%' OR s.name ILIKE '%dreamcatcher%' OR s.name ILIKE '%attrape%'
       OR s.culture ILIKE '%amérind%' OR s.culture ILIKE '%indien%')
);

UPDATE collection_symbols 
SET collection_id = '55555555-5555-5555-5555-555555555555'::uuid
WHERE collection_id = '11111111-1111-1111-1111-111111111111'::uuid
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%totem%' 
  OR s.name ILIKE '%dreamcatcher%'
  OR s.name ILIKE '%attrape%'
  OR s.culture ILIKE '%amérind%'
  OR s.culture ILIKE '%indien%'
);

-- Step 3: Remove old collections and transfer their symbols
-- Transfer symbols from old collections to appropriate new ones
UPDATE collection_symbols 
SET collection_id = CASE 
  WHEN EXISTS (SELECT 1 FROM symbols s WHERE s.id = collection_symbols.symbol_id AND s.culture ILIKE '%celt%') 
    THEN '33333333-3333-3333-3333-333333333333'::uuid -- Cultures Celtiques
  WHEN EXISTS (SELECT 1 FROM symbols s WHERE s.id = collection_symbols.symbol_id AND s.culture ILIKE '%franc%') 
    THEN '11111111-1111-1111-1111-111111111111'::uuid -- Traditions Françaises
  ELSE '77777777-7777-7777-7777-777777777777'::uuid -- Géométrie et Motifs
END
WHERE collection_id IN (
  SELECT DISTINCT c.id 
  FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333'::uuid)
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111'::uuid)
);

-- Now remove the old collections entirely
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

-- Step 4: Reorder positions in all collections
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