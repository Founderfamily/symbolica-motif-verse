
-- Migration pour restructurer les collections selon les 20 grandes traditions mondiales

-- 1. Créer les 20 collections des grandes civilisations mondiales
INSERT INTO public.collections (id, slug, is_featured, created_at, updated_at) VALUES
-- Collections principales des grandes civilisations
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'egypte-antique', true, now(), now()),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'grece-antique', true, now(), now()),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'rome-antique', true, now(), now()),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'chine-traditionnelle', true, now(), now()),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'inde-hindoue', true, now(), now()),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'monde-arabe-islamique', true, now(), now()),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'japon-traditionnel', true, now(), now()),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'monde-celtique', true, now(), now()),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'nordique-viking', true, now(), now()),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'afrique-traditionnelle', true, now(), now()),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'ameriques-indigenes', true, now(), now()),
('llllllll-llll-llll-llll-llllllllllll', 'maya-azteque', true, now(), now()),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'perse-iranienne', true, now(), now()),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'tradition-juive', true, now(), now()),
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'monde-slave', true, now(), now()),
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'oceanie-pacifique', true, now(), now()),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'europe-medievale', true, now(), now()),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'symboles-universels', true, now(), now()),
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'geometrie-sacree-mondiale', true, now(), now()),
-- Collection française maintenue mais repositionnée
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'patrimoine-francais', false, now(), now());

-- 2. Créer les traductions pour toutes les nouvelles collections
INSERT INTO public.collection_translations (collection_id, language, title, description) VALUES
-- Égypte Antique
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'fr', 'Égypte Antique', 'Hiéroglyphes, divinités et symboles funéraires de l''ancienne Égypte'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'en', 'Ancient Egypt', 'Hieroglyphs, deities and funerary symbols from ancient Egypt'),

-- Grèce Antique
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'fr', 'Grèce Antique', 'Mythologie, architecture et philosophie de la Grèce classique'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'en', 'Ancient Greece', 'Mythology, architecture and philosophy of classical Greece'),

-- Rome Antique
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'fr', 'Rome Antique', 'Empire, légions et art décoratif de la Rome antique'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'en', 'Ancient Rome', 'Empire, legions and decorative art of ancient Rome'),

-- Chine Traditionnelle
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'fr', 'Chine Traditionnelle', 'Taoïsme, Feng Shui et calligraphie de la tradition chinoise'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'en', 'Traditional China', 'Taoism, Feng Shui and calligraphy from Chinese tradition'),

-- Inde Hindoue
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'fr', 'Inde Hindoue', 'Chakras, divinités et mandalas de la tradition hindoue'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'en', 'Hindu India', 'Chakras, deities and mandalas from Hindu tradition'),

-- Monde Arabe-Islamique
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'fr', 'Monde Arabe-Islamique', 'Géométrie sacrée et calligraphie du monde arabo-musulman'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', 'en', 'Arab-Islamic World', 'Sacred geometry and calligraphy from the Arab-Muslim world'),

-- Japon Traditionnel
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'fr', 'Japon Traditionnel', 'Zen, art traditionnel et symboles impériaux du Japon'),
('gggggggg-gggg-gggg-gggg-gggggggggggg', 'en', 'Traditional Japan', 'Zen, traditional art and imperial symbols of Japan'),

-- Monde Celtique
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'fr', 'Monde Celtique', 'Nœuds celtiques, druides et mythologie des peuples celtes'),
('hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh', 'en', 'Celtic World', 'Celtic knots, druids and mythology of Celtic peoples'),

-- Nordique-Viking
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'fr', 'Nordique-Viking', 'Runes et mythologie nordique des peuples scandinaves'),
('iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'en', 'Nordic-Viking', 'Runes and Nordic mythology of Scandinavian peoples'),

-- Afrique Traditionnelle
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'fr', 'Afrique Traditionnelle', 'Adinkra, art tribal et masques des cultures africaines'),
('jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj', 'en', 'Traditional Africa', 'Adinkra, tribal art and masks from African cultures'),

-- Amériques Indigènes
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'fr', 'Amériques Indigènes', 'Totems, roue de médecine et symboles des peuples amérindiens'),
('kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'en', 'Indigenous Americas', 'Totems, medicine wheel and symbols of Native American peoples'),

-- Maya-Aztèque
('llllllll-llll-llll-llll-llllllllllll', 'fr', 'Maya-Aztèque', 'Calendriers, glyphes et divinités mésoaméricaines'),
('llllllll-llll-llll-llll-llllllllllll', 'en', 'Maya-Aztec', 'Calendars, glyphs and Mesoamerican deities'),

-- Perse-Iranienne
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'fr', 'Perse-Iranienne', 'Zoroastrisme et art perse de l''Iran antique'),
('mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'en', 'Persian-Iranian', 'Zoroastrianism and Persian art from ancient Iran'),

-- Tradition Juive
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'fr', 'Tradition Juive', 'Kabbale et symboles religieux de la tradition hébraïque'),
('nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn', 'en', 'Jewish Tradition', 'Kabbalah and religious symbols from Hebrew tradition'),

-- Monde Slave
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'fr', 'Monde Slave', 'Art orthodoxe et folklore des peuples slaves'),
('oooooooo-oooo-oooo-oooo-oooooooooooo', 'en', 'Slavic World', 'Orthodox art and folklore of Slavic peoples'),

-- Océanie-Pacifique
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'fr', 'Océanie-Pacifique', 'Art maori, polynésien et aborigène du Pacifique'),
('pppppppp-pppp-pppp-pppp-pppppppppppp', 'en', 'Pacific Oceania', 'Maori, Polynesian and Aboriginal art from the Pacific'),

-- Europe Médiévale
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'fr', 'Europe Médiévale', 'Héraldique, alchimie et art gothique du Moyen Âge'),
('qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'en', 'Medieval Europe', 'Heraldry, alchemy and Gothic art from the Middle Ages'),

-- Symboles Universels
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'fr', 'Symboles Universels', 'Symboles contemporains et logos universels modernes'),
('rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr', 'en', 'Universal Symbols', 'Contemporary symbols and modern universal logos'),

-- Géométrie Sacrée Mondiale
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'fr', 'Géométrie Sacrée Mondiale', 'Mandalas, fractales et proportions divines universelles'),
('ssssssss-ssss-ssss-ssss-ssssssssssss', 'en', 'World Sacred Geometry', 'Mandalas, fractals and universal divine proportions'),

-- Patrimoine Français
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'fr', 'Patrimoine Français', 'Traditions, régions et art symbolique de France'),
('tttttttt-tttt-tttt-tttt-tttttttttttt', 'en', 'French Heritage', 'Traditions, regions and symbolic art from France');

-- 3. Redistribuer les symboles existants selon leurs codes taxonomiques UNESCO
-- Symboles égyptiens
UPDATE collection_symbols SET collection_id = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'AFR-EGY'
);

-- Symboles grecs
UPDATE collection_symbols SET collection_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'EUR-GRE'
);

-- Symboles romains
UPDATE collection_symbols SET collection_id = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'EUR-ROM'
);

-- Symboles chinois
UPDATE collection_symbols SET collection_id = 'dddddddd-dddd-dddd-dddd-dddddddddddd'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'ASI-CHN'
);

-- Symboles indiens
UPDATE collection_symbols SET collection_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'ASI-IND'
);

-- Symboles arabes/turcs/persans vers monde arabo-islamique
UPDATE collection_symbols SET collection_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code IN ('ASI-TUR', 'ASI-PER', 'AFR-ARA')
);

-- Symboles japonais
UPDATE collection_symbols SET collection_id = 'gggggggg-gggg-gggg-gggg-gggggggggggg'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'ASI-JAP'
);

-- Symboles celtiques
UPDATE collection_symbols SET collection_id = 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code IN ('EUR-CEL', 'EUR-IRL')
);

-- Symboles nordiques
UPDATE collection_symbols SET collection_id = 'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'EUR-NOR'
);

-- Symboles africains
UPDATE collection_symbols SET collection_id = 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code LIKE 'AFR-%' AND cultural_taxonomy_code != 'AFR-EGY'
);

-- Symboles amérindiens
UPDATE collection_symbols SET collection_id = 'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code IN ('AME-NOR', 'AME-SUD')
);

-- Symboles mayas/mésoaméricains
UPDATE collection_symbols SET collection_id = 'llllllll-llll-llll-llll-llllllllllll'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'AME-CEN'
);

-- Symboles persans
UPDATE collection_symbols SET collection_id = 'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'ASI-PER'
);

-- Symboles océaniens
UPDATE collection_symbols SET collection_id = 'pppppppp-pppp-pppp-pppp-pppppppppppp'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code LIKE 'OCE-%'
);

-- Symboles européens médiévaux (héraldique, etc.)
UPDATE collection_symbols SET collection_id = 'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code LIKE 'EUR-%' 
  AND cultural_taxonomy_code NOT IN ('EUR-FRA', 'EUR-GRE', 'EUR-ROM', 'EUR-CEL', 'EUR-IRL', 'EUR-NOR')
);

-- Redistribuer la géométrie sacrée
UPDATE collection_symbols SET collection_id = 'ssssssss-ssss-ssss-ssss-ssssssssssss'
WHERE collection_id = '77777777-7777-7777-7777-777777777777' -- Ancienne "Géométrie et Motifs"
AND symbol_id IN (
  SELECT id FROM symbols WHERE 'GEO' = ANY(thematic_taxonomy_codes) OR 'SAC' = ANY(thematic_taxonomy_codes)
);

-- Conserver les symboles français dans la nouvelle collection patrimoine français
UPDATE collection_symbols SET collection_id = 'tttttttt-tttt-tttt-tttt-tttttttttttt'
WHERE symbol_id IN (
  SELECT id FROM symbols WHERE cultural_taxonomy_code = 'EUR-FRA'
);

-- 4. Supprimer les anciennes collections qui ne sont plus pertinentes
DELETE FROM collection_symbols WHERE collection_id IN (
  '22222222-2222-2222-2222-222222222222', -- Cultures Antiques
  '33333333-3333-3333-3333-333333333333', -- Cultures Celtiques  
  '44444444-4444-4444-4444-444444444444', -- Cultures Asiatiques
  '55555555-5555-5555-5555-555555555555', -- Cultures Amérindiennes
  '66666666-6666-6666-6666-666666666666', -- Cultures Africaines
  '77777777-7777-7777-7777-777777777777', -- Géométrie et Motifs
  '88888888-8888-8888-8888-888888888888'  -- Mythologies et Légendes
);

DELETE FROM collection_translations WHERE collection_id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

DELETE FROM collections WHERE id IN (
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444444',
  '55555555-5555-5555-5555-555555555555',
  '66666666-6666-6666-6666-666666666666',
  '77777777-7777-7777-7777-777777777777',
  '88888888-8888-8888-8888-888888888888'
);

-- 5. Réorganiser les positions dans toutes les nouvelles collections
UPDATE collection_symbols 
SET position = row_number() OVER (PARTITION BY collection_id ORDER BY symbol_id)
WHERE collection_id IN (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff',
  'gggggggg-gggg-gggg-gggg-gggggggggggg', 'hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh',
  'iiiiiiii-iiii-iiii-iiii-iiiiiiiiiiii', 'jjjjjjjj-jjjj-jjjj-jjjj-jjjjjjjjjjjj',
  'kkkkkkkk-kkkk-kkkk-kkkk-kkkkkkkkkkkk', 'llllllll-llll-llll-llll-llllllllllll',
  'mmmmmmmm-mmmm-mmmm-mmmm-mmmmmmmmmmmm', 'nnnnnnnn-nnnn-nnnn-nnnn-nnnnnnnnnnnn',
  'oooooooo-oooo-oooo-oooo-oooooooooooo', 'pppppppp-pppp-pppp-pppp-pppppppppppp',
  'qqqqqqqq-qqqq-qqqq-qqqq-qqqqqqqqqqqq', 'rrrrrrrr-rrrr-rrrr-rrrr-rrrrrrrrrrrr',
  'ssssssss-ssss-ssss-ssss-ssssssssssss', 'tttttttt-tttt-tttt-tttt-tttttttttttt'
);
