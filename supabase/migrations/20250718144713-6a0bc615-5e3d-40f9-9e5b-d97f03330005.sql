-- Nettoyage complet et recréation des collections

-- Supprimer TOUTES les traductions existantes pour éviter les conflits
DELETE FROM collection_translations WHERE collection_id IN (
    SELECT id FROM collections 
);

-- Supprimer TOUS les liens collection-symboles existants
DELETE FROM collection_symbols WHERE collection_id IN (
    SELECT id FROM collections
);

-- Supprimer TOUTES les collections existantes
DELETE FROM collections;

-- Recréer les 20 collections des grandes civilisations avec de nouveaux IDs
INSERT INTO public.collections (id, slug, is_featured, created_at, updated_at) VALUES
(gen_random_uuid(), 'egypte-antique', true, now(), now()),
(gen_random_uuid(), 'grece-antique', true, now(), now()),
(gen_random_uuid(), 'rome-antique', true, now(), now()),
(gen_random_uuid(), 'chine-traditionnelle', true, now(), now()),
(gen_random_uuid(), 'inde-hindoue', true, now(), now()),
(gen_random_uuid(), 'monde-arabe-islamique', true, now(), now()),
(gen_random_uuid(), 'japon-traditionnel', true, now(), now()),
(gen_random_uuid(), 'monde-celtique', true, now(), now()),
(gen_random_uuid(), 'nordique-viking', true, now(), now()),
(gen_random_uuid(), 'afrique-traditionnelle', true, now(), now()),
(gen_random_uuid(), 'ameriques-indigenes', true, now(), now()),
(gen_random_uuid(), 'maya-azteque', true, now(), now()),
(gen_random_uuid(), 'perse-iranienne', true, now(), now()),
(gen_random_uuid(), 'tradition-juive', true, now(), now()),
(gen_random_uuid(), 'monde-slave', true, now(), now()),
(gen_random_uuid(), 'oceanie-pacifique', true, now(), now()),
(gen_random_uuid(), 'europe-medievale', true, now(), now()),
(gen_random_uuid(), 'symboles-universels', true, now(), now()),
(gen_random_uuid(), 'geometrie-sacree-mondiale', true, now(), now()),
(gen_random_uuid(), 'patrimoine-francais', false, now(), now());

-- Créer les traductions pour toutes les nouvelles collections
INSERT INTO public.collection_translations (collection_id, language, title, description) 
SELECT 
    c.id,
    t.language,
    t.title,
    t.description
FROM collections c
CROSS JOIN (
    VALUES 
    ('egypte-antique', 'fr', 'Égypte Antique', 'Hiéroglyphes, divinités et symboles funéraires de l''ancienne Égypte'),
    ('egypte-antique', 'en', 'Ancient Egypt', 'Hieroglyphs, deities and funerary symbols from ancient Egypt'),
    ('grece-antique', 'fr', 'Grèce Antique', 'Mythologie, architecture et philosophie de la Grèce classique'),
    ('grece-antique', 'en', 'Ancient Greece', 'Mythology, architecture and philosophy of classical Greece'),
    ('rome-antique', 'fr', 'Rome Antique', 'Empire, légions et art décoratif de la Rome antique'),
    ('rome-antique', 'en', 'Ancient Rome', 'Empire, legions and decorative art of ancient Rome'),
    ('chine-traditionnelle', 'fr', 'Chine Traditionnelle', 'Taoïsme, Feng Shui et calligraphie de la tradition chinoise'),
    ('chine-traditionnelle', 'en', 'Traditional China', 'Taoism, Feng Shui and calligraphy from Chinese tradition'),
    ('inde-hindoue', 'fr', 'Inde Hindoue', 'Chakras, divinités et mandalas de la tradition hindoue'),
    ('inde-hindoue', 'en', 'Hindu India', 'Chakras, deities and mandalas from Hindu tradition'),
    ('monde-arabe-islamique', 'fr', 'Monde Arabe-Islamique', 'Géométrie sacrée et calligraphie du monde arabo-musulman'),
    ('monde-arabe-islamique', 'en', 'Arab-Islamic World', 'Sacred geometry and calligraphy from the Arab-Muslim world'),
    ('japon-traditionnel', 'fr', 'Japon Traditionnel', 'Zen, art traditionnel et symboles impériaux du Japon'),
    ('japon-traditionnel', 'en', 'Traditional Japan', 'Zen, traditional art and imperial symbols of Japan'),
    ('monde-celtique', 'fr', 'Monde Celtique', 'Nœuds celtiques, druides et mythologie des peuples celtes'),
    ('monde-celtique', 'en', 'Celtic World', 'Celtic knots, druids and mythology of Celtic peoples'),
    ('nordique-viking', 'fr', 'Nordique-Viking', 'Runes et mythologie nordique des peuples scandinaves'),
    ('nordique-viking', 'en', 'Nordic-Viking', 'Runes and Nordic mythology of Scandinavian peoples'),
    ('afrique-traditionnelle', 'fr', 'Afrique Traditionnelle', 'Adinkra, art tribal et masques des cultures africaines'),
    ('afrique-traditionnelle', 'en', 'Traditional Africa', 'Adinkra, tribal art and masks from African cultures'),
    ('ameriques-indigenes', 'fr', 'Amériques Indigènes', 'Totems, roue de médecine et symboles des peuples amérindiens'),
    ('ameriques-indigenes', 'en', 'Indigenous Americas', 'Totems, medicine wheel and symbols of Native American peoples'),
    ('maya-azteque', 'fr', 'Maya-Aztèque', 'Calendriers, glyphes et divinités mésoaméricaines'),
    ('maya-azteque', 'en', 'Maya-Aztec', 'Calendars, glyphs and Mesoamerican deities'),
    ('perse-iranienne', 'fr', 'Perse-Iranienne', 'Zoroastrisme et art perse de l''Iran antique'),
    ('perse-iranienne', 'en', 'Persian-Iranian', 'Zoroastrianism and Persian art from ancient Iran'),
    ('tradition-juive', 'fr', 'Tradition Juive', 'Kabbale et symboles religieux de la tradition hébraïque'),
    ('tradition-juive', 'en', 'Jewish Tradition', 'Kabbalah and religious symbols from Hebrew tradition'),
    ('monde-slave', 'fr', 'Monde Slave', 'Art orthodoxe et folklore des peuples slaves'),
    ('monde-slave', 'en', 'Slavic World', 'Orthodox art and folklore of Slavic peoples'),
    ('oceanie-pacifique', 'fr', 'Océanie-Pacifique', 'Art maori, polynésien et aborigène du Pacifique'),
    ('oceanie-pacifique', 'en', 'Pacific Oceania', 'Maori, Polynesian and Aboriginal art from the Pacific'),
    ('europe-medievale', 'fr', 'Europe Médiévale', 'Héraldique, alchimie et art gothique du Moyen Âge'),
    ('europe-medievale', 'en', 'Medieval Europe', 'Heraldry, alchemy and Gothic art from the Middle Ages'),
    ('symboles-universels', 'fr', 'Symboles Universels', 'Symboles contemporains et logos universels modernes'),
    ('symboles-universels', 'en', 'Universal Symbols', 'Contemporary symbols and modern universal logos'),
    ('geometrie-sacree-mondiale', 'fr', 'Géométrie Sacrée Mondiale', 'Mandalas, fractales et proportions divines universelles'),
    ('geometrie-sacree-mondiale', 'en', 'World Sacred Geometry', 'Mandalas, fractals and universal divine proportions'),
    ('patrimoine-francais', 'fr', 'Patrimoine Français', 'Traditions, régions et art symbolique de France'),
    ('patrimoine-francais', 'en', 'French Heritage', 'Traditions, regions and symbolic art from France')
) AS t(slug, language, title, description)
WHERE c.slug = t.slug;