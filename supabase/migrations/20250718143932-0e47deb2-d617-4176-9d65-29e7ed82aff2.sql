
-- Migration corrective pour créer les 20 collections des grandes civilisations mondiales
-- avec redistribution intelligente des symboles

-- 1. Créer les nouvelles collections des grandes civilisations
DO $$
DECLARE
    egypte_id uuid := gen_random_uuid();
    grece_id uuid := gen_random_uuid();
    rome_id uuid := gen_random_uuid();
    chine_id uuid := gen_random_uuid();
    inde_id uuid := gen_random_uuid();
    arabe_id uuid := gen_random_uuid();
    japon_id uuid := gen_random_uuid();
    celtique_id uuid := gen_random_uuid();
    nordique_id uuid := gen_random_uuid();
    afrique_id uuid := gen_random_uuid();
    amerindien_id uuid := gen_random_uuid();
    maya_id uuid := gen_random_uuid();
    perse_id uuid := gen_random_uuid();
    juive_id uuid := gen_random_uuid();
    slave_id uuid := gen_random_uuid();
    oceanie_id uuid := gen_random_uuid();
    medievale_id uuid := gen_random_uuid();
    universels_id uuid := gen_random_uuid();
    geometrie_id uuid := gen_random_uuid();
    francais_id uuid := gen_random_uuid();
BEGIN
    -- Créer les 20 nouvelles collections
    INSERT INTO public.collections (id, slug, is_featured, created_at, updated_at) VALUES
    (egypte_id, 'egypte-antique', true, now(), now()),
    (grece_id, 'grece-antique', true, now(), now()),
    (rome_id, 'rome-antique', true, now(), now()),
    (chine_id, 'chine-traditionnelle', true, now(), now()),
    (inde_id, 'inde-hindoue', true, now(), now()),
    (arabe_id, 'monde-arabe-islamique', true, now(), now()),
    (japon_id, 'japon-traditionnel', true, now(), now()),
    (celtique_id, 'monde-celtique', true, now(), now()),
    (nordique_id, 'nordique-viking', true, now(), now()),
    (afrique_id, 'afrique-traditionnelle', true, now(), now()),
    (amerindien_id, 'ameriques-indigenes', true, now(), now()),
    (maya_id, 'maya-azteque', true, now(), now()),
    (perse_id, 'perse-iranienne', true, now(), now()),
    (juive_id, 'tradition-juive', true, now(), now()),
    (slave_id, 'monde-slave', true, now(), now()),
    (oceanie_id, 'oceanie-pacifique', true, now(), now()),
    (medievale_id, 'europe-medievale', true, now(), now()),
    (universels_id, 'symboles-universels', true, now(), now()),
    (geometrie_id, 'geometrie-sacree-mondiale', true, now(), now()),
    (francais_id, 'patrimoine-francais', false, now(), now());

    -- Créer les traductions pour toutes les nouvelles collections
    INSERT INTO public.collection_translations (collection_id, language, title, description) VALUES
    -- Égypte Antique
    (egypte_id, 'fr', 'Égypte Antique', 'Hiéroglyphes, divinités et symboles funéraires de l''ancienne Égypte'),
    (egypte_id, 'en', 'Ancient Egypt', 'Hieroglyphs, deities and funerary symbols from ancient Egypt'),

    -- Grèce Antique
    (grece_id, 'fr', 'Grèce Antique', 'Mythologie, architecture et philosophie de la Grèce classique'),
    (grece_id, 'en', 'Ancient Greece', 'Mythology, architecture and philosophy of classical Greece'),

    -- Rome Antique
    (rome_id, 'fr', 'Rome Antique', 'Empire, légions et art décoratif de la Rome antique'),
    (rome_id, 'en', 'Ancient Rome', 'Empire, legions and decorative art of ancient Rome'),

    -- Chine Traditionnelle
    (chine_id, 'fr', 'Chine Traditionnelle', 'Taoïsme, Feng Shui et calligraphie de la tradition chinoise'),
    (chine_id, 'en', 'Traditional China', 'Taoism, Feng Shui and calligraphy from Chinese tradition'),

    -- Inde Hindoue
    (inde_id, 'fr', 'Inde Hindoue', 'Chakras, divinités et mandalas de la tradition hindoue'),
    (inde_id, 'en', 'Hindu India', 'Chakras, deities and mandalas from Hindu tradition'),

    -- Monde Arabe-Islamique
    (arabe_id, 'fr', 'Monde Arabe-Islamique', 'Géométrie sacrée et calligraphie du monde arabo-musulman'),
    (arabe_id, 'en', 'Arab-Islamic World', 'Sacred geometry and calligraphy from the Arab-Muslim world'),

    -- Japon Traditionnel
    (japon_id, 'fr', 'Japon Traditionnel', 'Zen, art traditionnel et symboles impériaux du Japon'),
    (japon_id, 'en', 'Traditional Japan', 'Zen, traditional art and imperial symbols of Japan'),

    -- Monde Celtique
    (celtique_id, 'fr', 'Monde Celtique', 'Nœuds celtiques, druides et mythologie des peuples celtes'),
    (celtique_id, 'en', 'Celtic World', 'Celtic knots, druids and mythology of Celtic peoples'),

    -- Nordique-Viking
    (nordique_id, 'fr', 'Nordique-Viking', 'Runes et mythologie nordique des peuples scandinaves'),
    (nordique_id, 'en', 'Nordic-Viking', 'Runes and Nordic mythology of Scandinavian peoples'),

    -- Afrique Traditionnelle
    (afrique_id, 'fr', 'Afrique Traditionnelle', 'Adinkra, art tribal et masques des cultures africaines'),
    (afrique_id, 'en', 'Traditional Africa', 'Adinkra, tribal art and masks from African cultures'),

    -- Amériques Indigènes
    (amerindien_id, 'fr', 'Amériques Indigènes', 'Totems, roue de médecine et symboles des peuples amérindiens'),
    (amerindien_id, 'en', 'Indigenous Americas', 'Totems, medicine wheel and symbols of Native American peoples'),

    -- Maya-Aztèque
    (maya_id, 'fr', 'Maya-Aztèque', 'Calendriers, glyphes et divinités mésoaméricaines'),
    (maya_id, 'en', 'Maya-Aztec', 'Calendars, glyphs and Mesoamerican deities'),

    -- Perse-Iranienne
    (perse_id, 'fr', 'Perse-Iranienne', 'Zoroastrisme et art perse de l''Iran antique'),
    (perse_id, 'en', 'Persian-Iranian', 'Zoroastrianism and Persian art from ancient Iran'),

    -- Tradition Juive
    (juive_id, 'fr', 'Tradition Juive', 'Kabbale et symboles religieux de la tradition hébraïque'),
    (juive_id, 'en', 'Jewish Tradition', 'Kabbalah and religious symbols from Hebrew tradition'),

    -- Monde Slave
    (slave_id, 'fr', 'Monde Slave', 'Art orthodoxe et folklore des peuples slaves'),
    (slave_id, 'en', 'Slavic World', 'Orthodox art and folklore of Slavic peoples'),

    -- Océanie-Pacifique
    (oceanie_id, 'fr', 'Océanie-Pacifique', 'Art maori, polynésien et aborigène du Pacifique'),
    (oceanie_id, 'en', 'Pacific Oceania', 'Maori, Polynesian and Aboriginal art from the Pacific'),

    -- Europe Médiévale
    (medievale_id, 'fr', 'Europe Médiévale', 'Héraldique, alchimie et art gothique du Moyen Âge'),
    (medievale_id, 'en', 'Medieval Europe', 'Heraldry, alchemy and Gothic art from the Middle Ages'),

    -- Symboles Universels
    (universels_id, 'fr', 'Symboles Universels', 'Symboles contemporains et logos universels modernes'),
    (universels_id, 'en', 'Universal Symbols', 'Contemporary symbols and modern universal logos'),

    -- Géométrie Sacrée Mondiale
    (geometrie_id, 'fr', 'Géométrie Sacrée Mondiale', 'Mandalas, fractales et proportions divines universelles'),
    (geometrie_id, 'en', 'World Sacred Geometry', 'Mandalas, fractals and universal divine proportions'),

    -- Patrimoine Français
    (francais_id, 'fr', 'Patrimoine Français', 'Traditions, régions et art symbolique de France'),
    (francais_id, 'en', 'French Heritage', 'Traditions, regions and symbolic art from France');

    -- Redistribuer les symboles selon leurs codes taxonomiques UNESCO
    -- Créer les nouvelles relations collection_symbols

    -- Symboles égyptiens
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT egypte_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'AFR-EGY';

    -- Symboles grecs
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT grece_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'EUR-GRE';

    -- Symboles romains
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT rome_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'EUR-ROM';

    -- Symboles chinois
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT chine_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'ASI-CHN';

    -- Symboles indiens
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT inde_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'ASI-IND';

    -- Symboles arabes/turcs/persans vers monde arabo-islamique
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT arabe_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code IN ('ASI-TUR', 'ASI-PER', 'AFR-ARA');

    -- Symboles japonais
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT japon_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'ASI-JAP';

    -- Symboles celtiques
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT celtique_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code IN ('EUR-CEL', 'EUR-IRL');

    -- Symboles nordiques
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT nordique_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'EUR-NOR';

    -- Symboles africains (hors Égypte)
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT afrique_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code LIKE 'AFR-%' AND cultural_taxonomy_code != 'AFR-EGY';

    -- Symboles amérindiens d'Amérique du Nord
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT amerindien_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code IN ('AME-NOR', 'AME-SUD');

    -- Symboles mayas/mésoaméricains
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT maya_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'AME-CEN';

    -- Symboles persans
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT perse_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'ASI-PER';

    -- Symboles océaniens
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT oceanie_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code LIKE 'OCE-%';

    -- Symboles européens médiévaux
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT medievale_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code LIKE 'EUR-%' 
    AND cultural_taxonomy_code NOT IN ('EUR-FRA', 'EUR-GRE', 'EUR-ROM', 'EUR-CEL', 'EUR-IRL', 'EUR-NOR');

    -- Redistribuer la géométrie sacrée (depuis l'ancienne collection "Géométrie et Motifs")
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT geometrie_id, cs.symbol_id, ROW_NUMBER() OVER (ORDER BY s.created_at)
    FROM collection_symbols cs
    JOIN symbols s ON cs.symbol_id = s.id
    JOIN collections c ON cs.collection_id = c.id
    WHERE c.slug = 'geometrie-sacree'
    ON CONFLICT (collection_id, symbol_id) DO NOTHING;

    -- Symboles français dans la nouvelle collection patrimoine français
    INSERT INTO collection_symbols (collection_id, symbol_id, position)
    SELECT francais_id, id, ROW_NUMBER() OVER (ORDER BY created_at)
    FROM symbols WHERE cultural_taxonomy_code = 'EUR-FRA';

    -- Supprimer les anciennes relations des collections qui vont être supprimées
    DELETE FROM collection_symbols WHERE collection_id IN (
        SELECT id FROM collections WHERE slug IN (
            'cultures-antiques', 'cultures-celtiques', 'cultures-asiatiques',
            'cultures-amerindiennes', 'cultures-africaines', 'geometrie-et-motifs',
            'mythologies-et-legendes'
        )
    );

    -- Supprimer les traductions des anciennes collections
    DELETE FROM collection_translations WHERE collection_id IN (
        SELECT id FROM collections WHERE slug IN (
            'cultures-antiques', 'cultures-celtiques', 'cultures-asiatiques',
            'cultures-amerindiennes', 'cultures-africaines', 'geometrie-et-motifs',
            'mythologies-et-legendes'
        )
    );

    -- Supprimer les anciennes collections
    DELETE FROM collections WHERE slug IN (
        'cultures-antiques', 'cultures-celtiques', 'cultures-asiatiques',
        'cultures-amerindiennes', 'cultures-africaines', 'geometrie-et-motifs',
        'mythologies-et-legendes'
    );

    -- Mettre à jour le slug de "traditions-francaises" vers "patrimoine-francais" si elle existe
    UPDATE collections SET slug = 'patrimoine-francais', is_featured = false 
    WHERE slug = 'traditions-francaises';

    -- Mettre à jour les traductions pour le patrimoine français si elles existent
    UPDATE collection_translations 
    SET title = CASE 
        WHEN language = 'fr' THEN 'Patrimoine Français'
        WHEN language = 'en' THEN 'French Heritage'
    END,
    description = CASE 
        WHEN language = 'fr' THEN 'Traditions, régions et art symbolique de France'
        WHEN language = 'en' THEN 'Traditions, regions and symbolic art from France'
    END
    WHERE collection_id = (SELECT id FROM collections WHERE slug = 'patrimoine-francais');

END $$;
