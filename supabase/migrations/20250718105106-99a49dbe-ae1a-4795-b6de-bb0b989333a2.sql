-- Final collection reorganization - correctly assign symbols to their cultural collections
-- and clean up misplaced symbols

-- Step 1: Correctly reassign misplaced symbols from "Traditions Françaises" to their proper cultural collections
-- Move Asian symbols to "Cultures Asiatiques"
UPDATE collection_symbols 
SET collection_id = '44444444-4444-4444-4444-444444444444' -- Cultures Asiatiques
WHERE collection_id = '11111111-1111-1111-1111-111111111111' -- Traditions Françaises
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
UPDATE collection_symbols 
SET collection_id = '66666666-6666-6666-6666-666666666666' -- Cultures Africaines
WHERE collection_id = '11111111-1111-1111-1111-111111111111' -- Traditions Françaises
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
UPDATE collection_symbols 
SET collection_id = '22222222-2222-2222-2222-222222222222' -- Cultures Antiques
WHERE collection_id = '11111111-1111-1111-1111-111111111111' -- Traditions Françaises
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%hamsa%' 
  OR s.name ILIKE '%arabesque%'
  OR s.culture ILIKE '%arabe%'
  OR s.culture ILIKE '%islam%'
  OR s.culture ILIKE '%orient%'
);

-- Move Native American symbols to "Cultures Amérindiennes"
UPDATE collection_symbols 
SET collection_id = '55555555-5555-5555-5555-555555555555' -- Cultures Amérindiennes
WHERE collection_id = '11111111-1111-1111-1111-111111111111' -- Traditions Françaises
AND symbol_id IN (
  SELECT s.id FROM symbols s 
  WHERE s.name ILIKE '%totem%' 
  OR s.name ILIKE '%dreamcatcher%'
  OR s.name ILIKE '%attrape%'
  OR s.culture ILIKE '%amérind%'
  OR s.culture ILIKE '%indien%'
);

-- Step 2: Transfer symbols from old "Celtique" collection to "Cultures Celtiques"
UPDATE collection_symbols 
SET collection_id = '33333333-3333-3333-3333-333333333333' -- Cultures Celtiques
WHERE collection_id IN (
  SELECT c.id FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE ct.title ILIKE '%celtique%' 
  AND c.id != '33333333-3333-3333-3333-333333333333'
);

-- Step 3: Transfer remaining symbols from old "Traditionnelle" collection to appropriate collections
-- First, try to match by culture for precise assignment
UPDATE collection_symbols 
SET collection_id = CASE 
  WHEN EXISTS (SELECT 1 FROM symbols s WHERE s.id = collection_symbols.symbol_id AND s.culture ILIKE '%franc%') 
    THEN '11111111-1111-1111-1111-111111111111' -- Keep in Traditions Françaises
  WHEN EXISTS (SELECT 1 FROM symbols s WHERE s.id = collection_symbols.symbol_id AND s.culture ILIKE '%celt%') 
    THEN '33333333-3333-3333-3333-333333333333' -- Cultures Celtiques
  WHEN EXISTS (SELECT 1 FROM symbols s WHERE s.id = collection_symbols.symbol_id AND s.culture ILIKE '%antique%') 
    THEN '22222222-2222-2222-2222-222222222222' -- Cultures Antiques
  ELSE '77777777-7777-7777-7777-777777777777' -- Géométrie et Motifs (default for unclear ones)
END
WHERE collection_id IN (
  SELECT c.id FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE ct.title ILIKE '%traditionnelle%' 
  AND c.id != '11111111-1111-1111-1111-111111111111'
);

-- Step 4: Remove the old collections entirely
-- First remove their symbols relationships
DELETE FROM collection_symbols 
WHERE collection_id IN (
  SELECT c.id FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333')
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111')
);

-- Remove their translations
DELETE FROM collection_translations 
WHERE collection_id IN (
  SELECT c.id FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333')
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111')
);

-- Remove the old collections themselves
DELETE FROM collections 
WHERE id IN (
  SELECT c.id FROM collections c
  JOIN collection_translations ct ON c.id = ct.collection_id
  WHERE (ct.title ILIKE '%celtique%' AND c.id != '33333333-3333-3333-3333-333333333333')
  OR (ct.title ILIKE '%traditionnelle%' AND c.id != '11111111-1111-1111-1111-111111111111')
);

-- Step 5: Update positions in collections to maintain order
-- Reorder symbols in each collection
UPDATE collection_symbols 
SET position = row_number() OVER (PARTITION BY collection_id ORDER BY symbol_id)
WHERE collection_id IN (
  '11111111-1111-1111-1111-111111111111', -- Traditions Françaises
  '22222222-2222-2222-2222-222222222222', -- Cultures Antiques
  '33333333-3333-3333-3333-333333333333', -- Cultures Celtiques
  '44444444-4444-4444-4444-444444444444', -- Cultures Asiatiques
  '55555555-5555-5555-5555-555555555555', -- Cultures Amérindiennes
  '66666666-6666-6666-6666-666666666666', -- Cultures Africaines
  '77777777-7777-7777-7777-777777777777', -- Géométrie et Motifs
  '88888888-8888-8888-8888-888888888888'  -- Mythologies et Légendes
);