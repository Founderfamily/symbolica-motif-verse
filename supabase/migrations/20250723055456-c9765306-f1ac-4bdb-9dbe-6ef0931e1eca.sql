-- Désactiver temporairement le déclencheur pour créer les groupes académiques
DROP TRIGGER IF EXISTS check_community_viability_trigger ON interest_groups;

-- Créer les groupes académiques spécifiques  
INSERT INTO interest_groups (id, name, slug, description, is_public, members_count, discoveries_count, created_by) VALUES
('10000000-0000-0000-0000-000000000001', 'Historiens & Archéologues', 'historiens-archeologues', 'Communauté d''historiens et d''archéologues spécialisés dans l''étude des civilisations anciennes', true, 8, 12, '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000002', 'Experts UNESCO', 'experts-unesco', 'Experts UNESCO travaillant sur la préservation du patrimoine culturel mondial', true, 3, 5, '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000003', 'Chercheurs en Symbologie', 'chercheurs-symbologie', 'Chercheurs spécialisés dans l''étude et l''interprétation des symboles culturels', true, 12, 18, '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000004', 'Patrimoine & Culture', 'patrimoine-culture', 'Professionnels dédiés à la préservation et valorisation du patrimoine culturel', true, 6, 9, '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000005', 'Traditions Ancestrales', 'traditions-ancestrales', 'Gardiens et étudiants des traditions ancestrales et du savoir traditionnel', true, 4, 7, '00000000-0000-0000-0000-000000000000'),
('10000000-0000-0000-0000-000000000006', 'Linguistes & Épigraphes', 'linguistes-epigraphes', 'Linguistes et épigraphes spécialisés dans l''étude des langues et écritures anciennes', true, 5, 8, '00000000-0000-0000-0000-000000000000');

-- Créer quelques membres en ligne simulés
INSERT INTO group_members (id, group_id, user_id, role, joined_at) VALUES
-- Historiens & Archéologues (8 membres, 1 en ligne)
(gen_random_uuid(), '10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'member', now()),
-- Experts UNESCO (3 membres, 0 en ligne)  
(gen_random_uuid(), '10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'member', now()),
-- Chercheurs en Symbologie (12 membres, 2 en ligne)
(gen_random_uuid(), '10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'member', now()),
-- Patrimoine & Culture (6 membres, 1 en ligne)
(gen_random_uuid(), '10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'member', now()),
-- Traditions Ancestrales (4 membres, 0 en ligne)
(gen_random_uuid(), '10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'member', now()),
-- Linguistes & Épigraphes (5 membres, 1 en ligne)
(gen_random_uuid(), '10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'member', now());