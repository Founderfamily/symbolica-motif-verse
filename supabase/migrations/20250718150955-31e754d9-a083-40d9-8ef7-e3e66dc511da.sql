
-- Phase 1: Associer les symboles existants aux collections appropriées
-- Insertion des relations collection-symboles pour les symboles existants

-- 1. Symboles français vers "Patrimoine Français" 
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.created_at)
FROM collections c, symbols s
WHERE c.slug = 'patrimoine-francais' 
  AND s.culture ILIKE '%français%' OR s.culture ILIKE '%france%'
ON CONFLICT DO NOTHING;

-- 2. Symboles celtiques vers "Monde Celtique"
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.created_at)
FROM collections c, symbols s
WHERE c.slug = 'monde-celtique' 
  AND (s.culture ILIKE '%celtique%' OR s.name ILIKE '%triskèle%' OR s.name ILIKE '%celtique%')
ON CONFLICT DO NOTHING;

-- 3. Symboles africains vers "Afrique Traditionnelle"
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.created_at)
FROM collections c, symbols s
WHERE c.slug = 'afrique-traditionnelle' 
  AND (s.culture ILIKE '%ashanti%' OR s.culture ILIKE '%africain%' OR s.name ILIKE '%adinkra%')
ON CONFLICT DO NOTHING;

-- Phase 2: Créer les symboles manquants pour chaque collection

-- Collection: Égypte Antique
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Ankh', 'Égyptienne', 'Antiquité', 'Croix ansée égyptienne, symbole de la vie éternelle et de renaissance', 
 '{"fr": {"name": "Ankh", "description": "Croix ansée égyptienne, symbole de la vie éternelle et de renaissance"}, "en": {"name": "Ankh", "description": "Egyptian ankh cross, symbol of eternal life and rebirth"}}'),
('Œil d''Horus', 'Égyptienne', 'Antiquité', 'Symbole de protection royale et de bonne santé dans l''Égypte antique',
 '{"fr": {"name": "Œil d''Horus", "description": "Symbole de protection royale et de bonne santé dans l''Égypte antique"}, "en": {"name": "Eye of Horus", "description": "Symbol of royal protection and good health in ancient Egypt"}}'),
('Scarabée sacré', 'Égyptienne', 'Antiquité', 'Symbole de renaissance et de transformation, associé au dieu solaire Râ',
 '{"fr": {"name": "Scarabée sacré", "description": "Symbole de renaissance et de transformation, associé au dieu solaire Râ"}, "en": {"name": "Sacred Scarab", "description": "Symbol of rebirth and transformation, associated with the sun god Ra"}}'),
('Cartouche royal', 'Égyptienne', 'Antiquité', 'Encadrement ovale contenant les hiéroglyphes du nom royal pharaonique',
 '{"fr": {"name": "Cartouche royal", "description": "Encadrement ovale contenant les hiéroglyphes du nom royal pharaonique"}, "en": {"name": "Royal Cartouche", "description": "Oval frame containing hieroglyphs of the pharaonic royal name"}}');

-- Associer les symboles égyptiens à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'egypte-antique' 
  AND s.culture = 'Égyptienne'
ON CONFLICT DO NOTHING;

-- Collection: Grèce Antique
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Caducée d''Hermès', 'Grecque', 'Antiquité', 'Bâton ailé entouré de deux serpents, attribut du messager des dieux',
 '{"fr": {"name": "Caducée d''Hermès", "description": "Bâton ailé entouré de deux serpents, attribut du messager des dieux"}, "en": {"name": "Caduceus of Hermes", "description": "Winged staff entwined with two serpents, attribute of the messenger of gods"}}'),
('Chouette d''Athéna', 'Grecque', 'Antiquité', 'Symbole de sagesse et de connaissance, emblème de la déesse Athéna',
 '{"fr": {"name": "Chouette d''Athéna", "description": "Symbole de sagesse et de connaissance, emblème de la déesse Athéna"}, "en": {"name": "Owl of Athena", "description": "Symbol of wisdom and knowledge, emblem of goddess Athena"}}'),
('Colonne ionique', 'Grecque', 'Antiquité', 'Ordre architectural grec avec chapiteau orné de volutes caractéristiques',
 '{"fr": {"name": "Colonne ionique", "description": "Ordre architectural grec avec chapiteau orné de volutes caractéristiques"}, "en": {"name": "Ionic Column", "description": "Greek architectural order with capital decorated with characteristic volutes"}}'),
('Couronne de laurier', 'Grecque', 'Antiquité', 'Symbole de victoire et d''honneur, décernée aux vainqueurs des jeux',
 '{"fr": {"name": "Couronne de laurier", "description": "Symbole de victoire et d''honneur, décernée aux vainqueurs des jeux"}, "en": {"name": "Laurel Crown", "description": "Symbol of victory and honor, awarded to winners of games"}}');

-- Associer les symboles grecs à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'grece-antique' 
  AND s.culture = 'Grecque'
ON CONFLICT DO NOTHING;

-- Collection: Rome Antique
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Aigle romain', 'Romaine', 'Antiquité', 'Symbole de puissance et de majesté impériale, emblème des légions',
 '{"fr": {"name": "Aigle romain", "description": "Symbole de puissance et de majesté impériale, emblème des légions"}, "en": {"name": "Roman Eagle", "description": "Symbol of imperial power and majesty, emblem of the legions"}}'),
('Fasces', 'Romaine', 'Antiquité', 'Faisceau de verges lié symbolisant l''autorité magistrale et l''unité',
 '{"fr": {"name": "Fasces", "description": "Faisceau de verges lié symbolisant l''autorité magistrale et l''unité"}, "en": {"name": "Fasces", "description": "Bundle of tied rods symbolizing magisterial authority and unity"}}'),
('SPQR', 'Romaine', 'Antiquité', 'Devise latine \"Senatus Populusque Romanus\" représentant la République',
 '{"fr": {"name": "SPQR", "description": "Devise latine \"Senatus Populusque Romanus\" représentant la République"}, "en": {"name": "SPQR", "description": "Latin motto \"Senatus Populusque Romanus\" representing the Republic"}}'),
('Louve capitoline', 'Romaine', 'Antiquité', 'Louve allaitant Romulus et Rémus, mythe fondateur de Rome',
 '{"fr": {"name": "Louve capitoline", "description": "Louve allaitant Romulus et Rémus, mythe fondateur de Rome"}, "en": {"name": "Capitoline Wolf", "description": "She-wolf nursing Romulus and Remus, founding myth of Rome"}}');

-- Associer les symboles romains à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'rome-antique' 
  AND s.culture = 'Romaine'
ON CONFLICT DO NOTHING;

-- Collection: Chine Traditionnelle
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Dragon chinois', 'Chinoise', 'Traditionnelle', 'Créature mythique bienveillante symbolisant la puissance impériale et la chance',
 '{"fr": {"name": "Dragon chinois", "description": "Créature mythique bienveillante symbolisant la puissance impériale et la chance"}, "en": {"name": "Chinese Dragon", "description": "Benevolent mythical creature symbolizing imperial power and luck"}}'),
('Phénix chinois', 'Chinoise', 'Traditionnelle', 'Oiseau légendaire de renaissance et de prospérité, symbole de l''impératrice',
 '{"fr": {"name": "Phénix chinois", "description": "Oiseau légendaire de renaissance et de prospérité, symbole de l''impératrice"}, "en": {"name": "Chinese Phoenix", "description": "Legendary bird of rebirth and prosperity, symbol of the empress"}}'),
('Caractères de bonheur', 'Chinoise', 'Traditionnelle', 'Calligraphie chinoise exprimant joie, bonheur et prospérité',
 '{"fr": {"name": "Caractères de bonheur", "description": "Calligraphie chinoise exprimant joie, bonheur et prospérité"}, "en": {"name": "Happiness Characters", "description": "Chinese calligraphy expressing joy, happiness and prosperity"}}'),
('Nœud chinois', 'Chinoise', 'Traditionnelle', 'Art décoratif traditionnel symbolisant l''unité et la continuité',
 '{"fr": {"name": "Nœud chinois", "description": "Art décoratif traditionnel symbolisant l''unité et la continuité"}, "en": {"name": "Chinese Knot", "description": "Traditional decorative art symbolizing unity and continuity"}}');

-- Associer les symboles chinois à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'chine-traditionnelle' 
  AND s.culture = 'Chinoise'
ON CONFLICT DO NOTHING;

-- Collection: Inde Hindoue
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Lotus sacré', 'Indienne', 'Traditionnelle', 'Fleur sacrée symbolisant la pureté spirituelle et l''éveil',
 '{"fr": {"name": "Lotus sacré", "description": "Fleur sacrée symbolisant la pureté spirituelle et l''éveil"}, "en": {"name": "Sacred Lotus", "description": "Sacred flower symbolizing spiritual purity and enlightenment"}}'),
('Ganesha', 'Indienne', 'Traditionnelle', 'Divinité à tête d''éléphant, remover d''obstacles et patron des arts',
 '{"fr": {"name": "Ganesha", "description": "Divinité à tête d''éléphant, remover d''obstacles et patron des arts"}, "en": {"name": "Ganesha", "description": "Elephant-headed deity, remover of obstacles and patron of arts"}}'),
('Roue du Dharma', 'Indienne', 'Traditionnelle', 'Symbole bouddhiste représentant les enseignements du Bouddha',
 '{"fr": {"name": "Roue du Dharma", "description": "Symbole bouddhiste représentant les enseignements du Bouddha"}, "en": {"name": "Dharma Wheel", "description": "Buddhist symbol representing the teachings of Buddha"}}'),
('Tilaka', 'Indienne', 'Traditionnelle', 'Marques sacrées sur le front indiquant la dévotion religieuse',
 '{"fr": {"name": "Tilaka", "description": "Marques sacrées sur le front indiquant la dévotion religieuse"}, "en": {"name": "Tilaka", "description": "Sacred marks on forehead indicating religious devotion"}}');

-- Associer les symboles indiens à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'inde-hindoue' 
  AND s.culture = 'Indienne'
ON CONFLICT DO NOTHING;

-- Collection: Japon Traditionnel
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Torii', 'Japonaise', 'Traditionnelle', 'Portique shintoïste marquant l''entrée des espaces sacrés',
 '{"fr": {"name": "Torii", "description": "Portique shintoïste marquant l''entrée des espaces sacrés"}, "en": {"name": "Torii", "description": "Shinto gate marking the entrance to sacred spaces"}}'),
('Fleur de cerisier', 'Japonaise', 'Traditionnelle', 'Sakura symbolisant la beauté éphémère et le renouveau printanier',
 '{"fr": {"name": "Fleur de cerisier", "description": "Sakura symbolisant la beauté éphémère et le renouveau printanier"}, "en": {"name": "Cherry Blossom", "description": "Sakura symbolizing ephemeral beauty and spring renewal"}}'),
('Carpe koï', 'Japonaise', 'Traditionnelle', 'Poisson symbole de persévérance, courage et transformation spirituelle',
 '{"fr": {"name": "Carpe koï", "description": "Poisson symbole de persévérance, courage et transformation spirituelle"}, "en": {"name": "Koi Carp", "description": "Fish symbol of perseverance, courage and spiritual transformation"}}'),
('Mon familial', 'Japonaise', 'Traditionnelle', 'Blason familial japonais représentant l''honneur et l''héritage ancestral',
 '{"fr": {"name": "Mon familial", "description": "Blason familial japonais représentant l''honneur et l''héritage ancestral"}, "en": {"name": "Family Mon", "description": "Japanese family crest representing honor and ancestral heritage"}}');

-- Associer les symboles japonais à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'japon-traditionnel' 
  AND s.culture = 'Japonaise'
ON CONFLICT DO NOTHING;

-- Collection: Monde Arabe-Islamique
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Calligraphie arabe', 'Arabe', 'Médiévale', 'Art de l''écriture sacrée transformant les mots en beauté visuelle',
 '{"fr": {"name": "Calligraphie arabe", "description": "Art de l''écriture sacrée transformant les mots en beauté visuelle"}, "en": {"name": "Arabic Calligraphy", "description": "Art of sacred writing transforming words into visual beauty"}}'),
('Motif géométrique', 'Islamique', 'Médiévale', 'Ornements mathématiques complexes reflétant l''ordre divin',
 '{"fr": {"name": "Motif géométrique", "description": "Ornements mathématiques complexes reflétant l''ordre divin"}, "en": {"name": "Geometric Pattern", "description": "Complex mathematical ornaments reflecting divine order"}}'),
('Croissant et étoile', 'Islamique', 'Médiévale', 'Symboles astronomiques devenus emblèmes de l''Islam',
 '{"fr": {"name": "Croissant et étoile", "description": "Symboles astronomiques devenus emblèmes de l''Islam"}, "en": {"name": "Crescent and Star", "description": "Astronomical symbols that became emblems of Islam"}}'),
('Mihrab', 'Islamique', 'Médiévale', 'Niche indiquant la direction de La Mecque dans les mosquées',
 '{"fr": {"name": "Mihrab", "description": "Niche indiquant la direction de La Mecque dans les mosquées"}, "en": {"name": "Mihrab", "description": "Niche indicating the direction of Mecca in mosques"}}');

-- Associer les symboles arabes-islamiques à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'monde-arabe-islamique' 
  AND (s.culture = 'Arabe' OR s.culture = 'Islamique')
ON CONFLICT DO NOTHING;

-- Collection: Nordique-Viking
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Mjöllnir', 'Nordique', 'VIIIe-XI siècles', 'Marteau de Thor, symbole de protection et de force divine',
 '{"fr": {"name": "Mjöllnir", "description": "Marteau de Thor, symbole de protection et de force divine"}, "en": {"name": "Mjöllnir", "description": "Thor''s hammer, symbol of protection and divine strength"}}'),
('Runes vikings', 'Nordique', 'VIIIe-XI siècles', 'Alphabet sacré utilisé pour l''écriture et la divination',
 '{"fr": {"name": "Runes vikings", "description": "Alphabet sacré utilisé pour l''écriture et la divination"}, "en": {"name": "Viking Runes", "description": "Sacred alphabet used for writing and divination"}}'),
('Valknut', 'Nordique', 'VIIIe-XI siècles', 'Triple triangle entrelacé, symbole d''Odin et des guerriers morts',
 '{"fr": {"name": "Valknut", "description": "Triple triangle entrelacé, symbole d''Odin et des guerriers morts"}, "en": {"name": "Valknut", "description": "Triple interlocked triangle, symbol of Odin and fallen warriors"}}'),
('Yggdrasil', 'Nordique', 'VIIIe-XI siècles', 'Arbre cosmique reliant les neuf mondes de la mythologie nordique',
 '{"fr": {"name": "Yggdrasil", "description": "Arbre cosmique reliant les neuf mondes de la mythologie nordique"}, "en": {"name": "Yggdrasil", "description": "Cosmic tree connecting the nine worlds of Norse mythology"}}');

-- Associer les symboles nordiques à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'nordique-viking' 
  AND s.culture = 'Nordique'
ON CONFLICT DO NOTHING;

-- Continuer avec les autres collections importantes...

-- Collection: Méso-Amérique Précolombienne
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Quetzalcoatl', 'Aztèque', 'Précolombienne', 'Serpent à plumes, divinité créatrice de la sagesse et du vent',
 '{"fr": {"name": "Quetzalcoatl", "description": "Serpent à plumes, divinité créatrice de la sagesse et du vent"}, "en": {"name": "Quetzalcoatl", "description": "Feathered serpent, creator deity of wisdom and wind"}}'),
('Calendrier aztèque', 'Aztèque', 'Précolombienne', 'Pierre du soleil représentant les cycles cosmiques et temporels',
 '{"fr": {"name": "Calendrier aztèque", "description": "Pierre du soleil représentant les cycles cosmiques et temporels"}, "en": {"name": "Aztec Calendar", "description": "Sun stone representing cosmic and temporal cycles"}}'),
('Condor andin', 'Inca', 'Précolombienne', 'Oiseau sacré messager entre le monde terrestre et céleste',
 '{"fr": {"name": "Condor andin", "description": "Oiseau sacré messager entre le monde terrestre et céleste"}, "en": {"name": "Andean Condor", "description": "Sacred bird messenger between earthly and celestial worlds"}}'),
('Chakana', 'Inca', 'Précolombienne', 'Croix andine représentant la cosmovision des civilisations pré-incas',
 '{"fr": {"name": "Chakana", "description": "Croix andine représentant la cosmovision des civilisations pré-incas"}, "en": {"name": "Chakana", "description": "Andean cross representing the worldview of pre-Inca civilizations"}}');

-- Associer les symboles méso-américains à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'meso-amerique-precolombienne' 
  AND (s.culture = 'Aztèque' OR s.culture = 'Inca')
ON CONFLICT DO NOTHING;

-- Collection: Amérique du Nord Autochtone  
INSERT INTO symbols (name, culture, period, description, translations)
VALUES 
('Roue de médecine', 'Amérindienne', 'Traditionnelle', 'Cercle sacré représentant l''équilibre et les cycles de vie',
 '{"fr": {"name": "Roue de médecine", "description": "Cercle sacré représentant l''équilibre et les cycles de vie"}, "en": {"name": "Medicine Wheel", "description": "Sacred circle representing balance and life cycles"}}'),
('Plume d''aigle', 'Amérindienne', 'Traditionnelle', 'Symbole de courage, sagesse et connection avec le Grand Esprit',
 '{"fr": {"name": "Plume d''aigle", "description": "Symbole de courage, sagesse et connection avec le Grand Esprit"}, "en": {"name": "Eagle Feather", "description": "Symbol of courage, wisdom and connection with Great Spirit"}}'),
('Kokopelli', 'Amérindienne', 'Traditionnelle', 'Joueur de flûte bossu symbolisant la fertilité et la joie',
 '{"fr": {"name": "Kokopelli", "description": "Joueur de flûte bossu symbolisant la fertilité et la joie"}, "en": {"name": "Kokopelli", "description": "Hunchbacked flute player symbolizing fertility and joy"}}'),
('Turtle Island', 'Amérindienne', 'Traditionnelle', 'Tortue supportant le monde selon les croyances amérindiennes',
 '{"fr": {"name": "Turtle Island", "description": "Tortue supportant le monde selon les croyances amérindiennes"}, "en": {"name": "Turtle Island", "description": "Turtle supporting the world according to Native American beliefs"}}');

-- Associer les symboles amérindiens à la collection
INSERT INTO collection_symbols (collection_id, symbol_id, position)
SELECT c.id, s.id, ROW_NUMBER() OVER (ORDER BY s.name)
FROM collections c, symbols s
WHERE c.slug = 'amerique-nord-autochtone' 
  AND s.culture = 'Amérindienne'
ON CONFLICT DO NOTHING;
