-- Phase 1: Consolidation des Collections et Communautés
-- Création des nouvelles collections consolidées

-- 1. Supprimer les collections vides
DELETE FROM collection_translations WHERE collection_id IN (
  SELECT c.id FROM collections c
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE cs.symbol_id IS NULL
);

DELETE FROM collections WHERE id IN (
  SELECT c.id FROM collections c
  LEFT JOIN collection_symbols cs ON c.id = cs.collection_id
  WHERE cs.symbol_id IS NULL
);

-- 2. Créer les nouvelles collections consolidées
INSERT INTO collections (id, slug, is_featured, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'traditions-francaises', true, now(), now()),
('22222222-2222-2222-2222-222222222222', 'cultures-antiques', true, now(), now()),
('33333333-3333-3333-3333-333333333333', 'cultures-celtiques', true, now(), now()),
('44444444-4444-4444-4444-444444444444', 'cultures-asiatiques', true, now(), now()),
('55555555-5555-5555-5555-555555555555', 'cultures-amerindiennes', true, now(), now()),
('66666666-6666-6666-6666-666666666666', 'cultures-africaines', false, now(), now()),
('77777777-7777-7777-7777-777777777777', 'geometrie-et-motifs', false, now(), now()),
('88888888-8888-8888-8888-888888888888', 'mythologies-legendes', false, now(), now());

-- 3. Ajouter les traductions pour les nouvelles collections
INSERT INTO collection_translations (collection_id, language, title, description) VALUES
('11111111-1111-1111-1111-111111111111', 'fr', 'Traditions Françaises', 'Symboles et traditions des régions françaises'),
('11111111-1111-1111-1111-111111111111', 'en', 'French Traditions', 'Symbols and traditions from French regions'),
('22222222-2222-2222-2222-222222222222', 'fr', 'Cultures Antiques', 'Symboles des civilisations anciennes'),
('22222222-2222-2222-2222-222222222222', 'en', 'Ancient Cultures', 'Symbols from ancient civilizations'),
('33333333-3333-3333-3333-333333333333', 'fr', 'Cultures Celtiques', 'Traditions et symboles celtiques'),
('33333333-3333-3333-3333-333333333333', 'en', 'Celtic Cultures', 'Celtic traditions and symbols'),
('44444444-4444-4444-4444-444444444444', 'fr', 'Cultures Asiatiques', 'Symboles des cultures asiatiques'),
('44444444-4444-4444-4444-444444444444', 'en', 'Asian Cultures', 'Symbols from Asian cultures'),
('55555555-5555-5555-5555-555555555555', 'fr', 'Cultures Amérindiennes', 'Traditions des peuples autochtones'),
('55555555-5555-5555-5555-555555555555', 'en', 'Indigenous Cultures', 'Indigenous peoples traditions'),
('66666666-6666-6666-6666-666666666666', 'fr', 'Cultures Africaines', 'Symboles et traditions africaines'),
('66666666-6666-6666-6666-666666666666', 'en', 'African Cultures', 'African symbols and traditions'),
('77777777-7777-7777-7777-777777777777', 'fr', 'Géométrie et Motifs', 'Motifs géométriques et patterns'),
('77777777-7777-7777-7777-777777777777', 'en', 'Geometry and Patterns', 'Geometric patterns and designs'),
('88888888-8888-8888-8888-888888888888', 'fr', 'Mythologies et Légendes', 'Symboles mythologiques'),
('88888888-8888-8888-8888-888888888888', 'en', 'Mythologies and Legends', 'Mythological symbols');

-- 4. Migrer les symboles vers les nouvelles collections
-- Traditions Françaises (régions françaises)
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '11111111-1111-1111-1111-111111111111', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Provence%' OR 
  ct.title LIKE '%Aquitaine%' OR 
  ct.title LIKE '%Bretagne%' OR
  ct.title LIKE '%Champagne%' OR
  ct.title LIKE '%Dauphin%' OR
  ct.title LIKE '%Lorraine%' OR
  ct.title LIKE '%Normandie%' OR
  ct.title LIKE '%Occitanie%' OR
  ct.title LIKE '%Poitou%' OR
  ct.title LIKE '%Île-de-France%' OR
  ct.title LIKE '%Franche-Comté%' OR
  ct.title LIKE '%Alsace%'
);

-- Cultures Antiques
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '22222222-2222-2222-2222-222222222222', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Égypte%' OR 
  ct.title LIKE '%Antiquité%' OR
  ct.title LIKE '%Grecque%' OR
  ct.title LIKE '%Romain%' OR
  ct.title LIKE '%Minoenne%' OR
  ct.title LIKE '%Ottoman%'
);

-- Cultures Celtiques
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '33333333-3333-3333-3333-333333333333', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND ct.title LIKE '%Celtique%';

-- Cultures Asiatiques
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '44444444-4444-4444-4444-444444444444', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Chinoise%' OR 
  ct.title LIKE '%Japonaise%' OR
  ct.title LIKE '%Indienne%' OR
  ct.title LIKE '%Bouddhisme%' OR
  ct.title LIKE '%Hindouisme%' OR
  ct.title LIKE '%Corée%'
);

-- Cultures Amérindiennes
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '55555555-5555-5555-5555-555555555555', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Amérindienne%' OR 
  ct.title LIKE '%Mésoaméricaine%' OR
  ct.title LIKE '%Maya%' OR
  ct.title LIKE '%Aztèque%' OR
  ct.title LIKE '%Inca%' OR
  ct.title LIKE '%Moche%' OR
  ct.title LIKE '%Zapotèque%'
);

-- Cultures Africaines
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '66666666-6666-6666-6666-666666666666', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Ashanti%' OR 
  ct.title LIKE '%Akan%' OR
  ct.title LIKE '%Bamana%' OR
  ct.title LIKE '%Adinkra%'
);

-- Géométrie et Motifs
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '77777777-7777-7777-7777-777777777777', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Géométrie%' OR 
  ct.title LIKE '%Motif%' OR
  ct.title LIKE '%Pattern%'
);

-- Mythologies
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '88888888-8888-8888-8888-888888888888', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id)
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND (
  ct.title LIKE '%Mythologie%' OR 
  ct.title LIKE '%Nordique%' OR
  ct.title LIKE '%Maorie%' OR
  ct.title LIKE '%Aborigène%'
);

-- 5. Ajouter les symboles restants à la collection la plus appropriée (Traditions françaises pour la collection "Traditionnelle")
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT '11111111-1111-1111-1111-111111111111', cs.symbol_id, 
       ROW_NUMBER() OVER (ORDER BY cs.symbol_id) + 100
FROM collection_symbols cs
JOIN collections c ON cs.collection_id = c.id
JOIN collection_translations ct ON c.id = ct.collection_id
WHERE ct.language = 'fr' AND ct.title = 'Traditionnelle'
AND cs.symbol_id NOT IN (
  SELECT symbol_id FROM collection_symbols 
  WHERE collection_id IN (
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    '44444444-4444-4444-4444-444444444444',
    '55555555-5555-5555-5555-555555555555',
    '66666666-6666-6666-6666-666666666666',
    '77777777-7777-7777-7777-777777777777',
    '88888888-8888-8888-8888-888888888888'
  )
);