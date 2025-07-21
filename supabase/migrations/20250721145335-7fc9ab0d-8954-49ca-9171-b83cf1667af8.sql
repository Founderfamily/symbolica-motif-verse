-- Supprimer d'abord toutes les données liées aux groupes
DELETE FROM group_members;
DELETE FROM group_posts;
DELETE FROM group_discoveries;
DELETE FROM group_notifications;
DELETE FROM group_join_requests;

-- Maintenant supprimer les anciens groupes d'intérêt obsolètes
DELETE FROM interest_groups;

-- Créer de nouveaux groupes d'intérêt alignés avec les collections principales
INSERT INTO interest_groups (id, name, slug, description, is_public, members_count, discoveries_count) VALUES
('11111111-1111-1111-1111-111111111111', 'Égypte Antique', 'egypte-antique', 'Hiéroglyphes, divinités et symboles funéraires de l''ancienne Égypte', true, 15, 8),
('22222222-2222-2222-2222-222222222222', 'Japon Traditionnel', 'japon-traditionnel', 'Zen, art traditionnel et symboles impériaux du Japon', true, 23, 12),
('33333333-3333-3333-3333-333333333333', 'Monde Celtique', 'monde-celtique', 'Nœuds celtiques, druides et mythologie des peuples celtes', true, 18, 6),
('44444444-4444-4444-4444-444444444444', 'Chine Traditionnelle', 'chine-traditionnelle', 'Taoïsme, Feng Shui et calligraphie de la tradition chinoise', true, 20, 9),
('55555555-5555-5555-5555-555555555555', 'Grèce Antique', 'grece-antique', 'Mythologie, architecture et philosophie de la Grèce classique', true, 14, 7),
('66666666-6666-6666-6666-666666666666', 'Nordique-Viking', 'nordique-viking', 'Runes et mythologie nordique des peuples scandinaves', true, 16, 5),
('77777777-7777-7777-7777-777777777777', 'Monde Arabe-Islamique', 'monde-arabe-islamique', 'Géométrie sacrée et calligraphie du monde arabo-musulman', true, 12, 4),
('88888888-8888-8888-8888-888888888888', 'Amériques Indigènes', 'ameriques-indigenes', 'Totems, roue de médecine et symboles des peuples amérindiens', true, 11, 3),
('99999999-9999-9999-9999-999999999999', 'Afrique Traditionnelle', 'afrique-traditionnelle', 'Adinkra, art tribal et masques des cultures africaines', true, 9, 2),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Monde Slave', 'monde-slave', 'Art orthodoxe et folklore des peuples slaves', true, 8, 1),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Océanie-Pacifique', 'oceanie-pacifique', 'Art maori, polynésien et aborigène du Pacifique', true, 7, 1),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Europe Médiévale', 'europe-medievale', 'Héraldique, alchimie et art gothique du Moyen Âge', true, 13, 4),
('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Perse-Iranienne', 'perse-iranienne', 'Zoroastrisme et art perse de l''Iran antique', true, 6, 1);