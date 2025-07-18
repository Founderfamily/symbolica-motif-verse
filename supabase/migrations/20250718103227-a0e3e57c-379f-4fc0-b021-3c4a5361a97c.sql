-- Phase 2: Consolidate collections safely
-- First, create the new consolidated collections
INSERT INTO collections (id, slug, is_featured, created_at, updated_at) VALUES
('11111111-1111-1111-1111-111111111111', 'traditions-francaises', true, now(), now()),
('22222222-2222-2222-2222-222222222222', 'cultures-antiques', true, now(), now()),
('33333333-3333-3333-3333-333333333333', 'cultures-celtiques', true, now(), now()),
('44444444-4444-4444-4444-444444444444', 'cultures-asiatiques', true, now(), now()),
('55555555-5555-5555-5555-555555555555', 'cultures-amerindiennes', true, now(), now()),
('66666666-6666-6666-6666-666666666666', 'cultures-africaines', false, now(), now()),
('77777777-7777-7777-7777-777777777777', 'geometrie-et-motifs', false, now(), now()),
('88888888-8888-8888-8888-888888888888', 'mythologies-legendes', false, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Add translations for new collections
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
('88888888-8888-8888-8888-888888888888', 'en', 'Mythologies and Legends', 'Mythological symbols')
ON CONFLICT (collection_id, language) DO NOTHING;

-- Create a temporary function to safely migrate symbols
CREATE OR REPLACE FUNCTION migrate_symbols_to_collection(
  p_collection_id UUID,
  p_search_patterns TEXT[]
) RETURNS INTEGER AS $$
DECLARE
  symbol_count INTEGER := 0;
  pattern TEXT;
BEGIN
  FOREACH pattern IN ARRAY p_search_patterns LOOP
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT 
      p_collection_id, 
      cs.symbol_id, 
      ROW_NUMBER() OVER (ORDER BY cs.symbol_id) + symbol_count
    FROM collection_symbols cs
    JOIN collections c ON cs.collection_id = c.id
    JOIN collection_translations ct ON c.id = ct.collection_id
    WHERE ct.language = 'fr' 
      AND ct.title ILIKE '%' || pattern || '%'
      AND cs.symbol_id NOT IN (
        SELECT symbol_id FROM collection_symbols 
        WHERE collection_id = p_collection_id
      )
    ON CONFLICT (collection_id, symbol_id) DO NOTHING;
    
    GET DIAGNOSTICS symbol_count = ROW_COUNT;
  END LOOP;
  
  RETURN symbol_count;
END;
$$ LANGUAGE plpgsql;

-- Migrate symbols using the safe function
-- Traditions Françaises
SELECT migrate_symbols_to_collection(
  '11111111-1111-1111-1111-111111111111',
  ARRAY['Provence', 'Aquitaine', 'Bretagne', 'Champagne', 'Dauphin', 'Lorraine', 'Normandie', 'Occitanie', 'Poitou', 'Île-de-France', 'Franche-Comté', 'Alsace', 'Traditionnelle']
);

-- Cultures Antiques
SELECT migrate_symbols_to_collection(
  '22222222-2222-2222-2222-222222222222',
  ARRAY['Égypte', 'Antiquité', 'Grecque', 'Romain', 'Minoenne', 'Ottoman']
);

-- Cultures Celtiques
SELECT migrate_symbols_to_collection(
  '33333333-3333-3333-3333-333333333333',
  ARRAY['Celtique']
);

-- Cultures Asiatiques
SELECT migrate_symbols_to_collection(
  '44444444-4444-4444-4444-444444444444',
  ARRAY['Chinoise', 'Japonaise', 'Indienne', 'Bouddhisme', 'Hindouisme', 'Corée']
);

-- Cultures Amérindiennes
SELECT migrate_symbols_to_collection(
  '55555555-5555-5555-5555-555555555555',
  ARRAY['Amérindienne', 'Mésoaméricaine', 'Maya', 'Aztèque', 'Inca', 'Moche', 'Zapotèque']
);

-- Cultures Africaines
SELECT migrate_symbols_to_collection(
  '66666666-6666-6666-6666-666666666666',
  ARRAY['Ashanti', 'Akan', 'Bamana', 'Adinkra']
);

-- Géométrie et Motifs
SELECT migrate_symbols_to_collection(
  '77777777-7777-7777-7777-777777777777',
  ARRAY['Géométrie', 'Motif', 'Pattern']
);

-- Mythologies
SELECT migrate_symbols_to_collection(
  '88888888-8888-8888-8888-888888888888',
  ARRAY['Mythologie', 'Nordique', 'Maorie', 'Aborigène']
);

-- Drop the temporary function
DROP FUNCTION migrate_symbols_to_collection(UUID, TEXT[]);