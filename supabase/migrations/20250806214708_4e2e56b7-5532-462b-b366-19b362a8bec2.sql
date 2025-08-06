-- Créer des participants réalistes pour la quête Les Trésors Cachés de Fontainebleau
-- D'abord, récupérer l'ID de la quête Fontainebleau
DO $$
DECLARE
    fontainebleau_quest_id UUID;
    participant_1_id UUID := gen_random_uuid();
    participant_2_id UUID := gen_random_uuid();
    participant_3_id UUID := gen_random_uuid();
    participant_4_id UUID := gen_random_uuid();
    activity_id UUID;
BEGIN
    -- Récupérer l'ID de la quête Fontainebleau
    SELECT id INTO fontainebleau_quest_id 
    FROM public.treasure_quests 
    WHERE title ILIKE '%Fontainebleau%' 
    LIMIT 1;
    
    IF fontainebleau_quest_id IS NOT NULL THEN
        -- Créer des profils d'experts fictifs
        INSERT INTO public.profiles (id, username, full_name, is_admin) VALUES
        (participant_1_id, 'marie_historienne', 'Marie Dubois', false),
        (participant_2_id, 'jean_archeologue', 'Jean Moreau', false),
        (participant_3_id, 'pierre_guide', 'Pierre Fontaine', false),
        (participant_4_id, 'anna_experte', 'Anna Rousseau', false)
        ON CONFLICT (id) DO UPDATE SET
            username = EXCLUDED.username,
            full_name = EXCLUDED.full_name;
        
        -- Ajouter des participants à la quête
        INSERT INTO public.quest_participants (id, quest_id, user_id, role, joined_at, status) VALUES
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'leader', NOW() - INTERVAL '3 weeks', 'completed'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_2_id, 'member', NOW() - INTERVAL '3 weeks', 'completed'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 'member', NOW() - INTERVAL '2 weeks', 'completed'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_4_id, 'member', NOW() - INTERVAL '2 weeks', 'completed')
        ON CONFLICT DO NOTHING;
        
        -- Créer la progression des indices (tous découverts)
        INSERT INTO public.quest_progress (id, quest_id, user_id, clue_index, discovered_at, discovery_data, validated, points_earned) VALUES
        -- Indice 1: Découvert par Marie
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 0, NOW() - INTERVAL '3 weeks', 
         '{"method": "historical_research", "location": "Bibliothèque du château", "notes": "Trouvé dans les archives royales"}', 
         true, 150),
        -- Indice 2: Découvert par Jean
        (gen_random_uuid(), fontainebleau_quest_id, participant_2_id, 1, NOW() - INTERVAL '2 weeks', 
         '{"method": "archaeological_analysis", "location": "Galerie François Ier", "notes": "Symbole gravé dans la pierre"}', 
         true, 200),
        -- Indice 3: Découvert par Pierre
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 2, NOW() - INTERVAL '1 week', 
         '{"method": "local_knowledge", "location": "Jardin de Diane", "notes": "Connaissance locale transmise"}', 
         true, 250)
        ON CONFLICT DO NOTHING;
        
        -- Ajouter des activités de quête détaillées
        INSERT INTO public.quest_activities (id, quest_id, user_id, activity_type, activity_data, created_at) VALUES
        -- Début de la quête
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'quest_started', 
         '{"message": "Équipe formée pour explorer les mystères de Fontainebleau"}', 
         NOW() - INTERVAL '3 weeks'),
        
        -- Découverte indice 1
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'clue_discovered', 
         '{"clue_index": 0, "title": "Les archives secrètes de François Ier", "method": "Recherche historique approfondie"}', 
         NOW() - INTERVAL '3 weeks'),
        
        -- Collaboration indice 2
        (gen_random_uuid(), fontainebleau_quest_id, participant_2_id, 'clue_discovered', 
         '{"clue_index": 1, "title": "La salamandre royale", "method": "Analyse archéologique des symboles"}', 
         NOW() - INTERVAL '2 weeks'),
        
        -- Aide IA
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 'ai_assistance', 
         '{"type": "historical_context", "suggestion": "Analyser les jardins Renaissance pour comprendre la symbolique"}', 
         NOW() - INTERVAL '10 days'),
        
        -- Découverte finale
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 'clue_discovered', 
         '{"clue_index": 2, "title": "Le jardin secret de Diane", "method": "Connaissance locale et intuition"}', 
         NOW() - INTERVAL '1 week'),
        
        -- Finalisation
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'quest_completed', 
         '{"completion_time": "3 semaines", "team_effort": true, "total_points": 600}', 
         NOW() - INTERVAL '5 days')
        ON CONFLICT DO NOTHING;
        
        -- Ajouter des figures historiques liées à la quête
        INSERT INTO public.historical_figures_metadata (id, quest_id, figure_name, figure_role, figure_period, wikipedia_url, description, status, suggested_by, verified_by, verified_at) VALUES
        (gen_random_uuid(), fontainebleau_quest_id, 'François Ier', 'Roi de France', '1515-1547', 
         'https://fr.wikipedia.org/wiki/François_Ier_(roi_de_France)', 
         'Roi bâtisseur de Fontainebleau, passionné d''art et de culture Renaissance', 
         'verified', participant_1_id, participant_1_id, NOW() - INTERVAL '2 weeks'),
        
        (gen_random_uuid(), fontainebleau_quest_id, 'Diane de Poitiers', 'Favorite royale', '1499-1566', 
         'https://fr.wikipedia.org/wiki/Diane_de_Poitiers', 
         'Maîtresse d''Henri II, figure influente de la cour de Fontainebleau', 
         'verified', participant_2_id, participant_1_id, NOW() - INTERVAL '10 days'),
        
        (gen_random_uuid(), fontainebleau_quest_id, 'Napoléon Bonaparte', 'Empereur', '1804-1814', 
         'https://fr.wikipedia.org/wiki/Napoléon_Ier', 
         'Rénovateur de Fontainebleau, y vécut ses derniers moments de pouvoir', 
         'verified', participant_3_id, participant_1_id, NOW() - INTERVAL '1 week')
        ON CONFLICT DO NOTHING;
        
        -- Ajouter des documents de quête
        INSERT INTO public.quest_documents (id, quest_id, title, description, document_type, document_url, source, author, credibility_score, uploaded_by) VALUES
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Inventaire des objets personnels de François Ier', 
         'Document historique détaillant les possessions royales cachées dans le château', 
         'manuscript', 
         '/documents/inventaire-francois-1er.pdf', 
         'Archives Nationales', 
         'Secrétaire royal anonyme', 
         9.2, participant_1_id),
        
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Plans architecturaux secrets de la Renaissance', 
         'Dessins techniques révélant des passages cachés dans le château', 
         'architectural_plan', 
         '/documents/plans-secrets-fontainebleau.pdf', 
         'Bibliothèque Mazarine', 
         'Architecte de la cour', 
         8.8, participant_2_id),
        
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Témoignages des jardiniers impériaux', 
         'Récits oraux transmis sur les cachettes dans les jardins de Diane', 
         'oral_history', 
         '/documents/temoignages-jardiniers.pdf', 
         'Tradition locale', 
         'Familles de jardiniers', 
         7.5, participant_3_id)
        ON CONFLICT DO NOTHING;
        
        -- Ajouter des locations détaillées
        INSERT INTO public.quest_locations (id, quest_id, name, description, latitude, longitude, location_type, historical_significance, current_status, images, sources, added_by, verified, verified_by) VALUES
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Galerie François Ier', 
         'Galerie ornée de fresques Renaissance où se cache le premier indice royal', 
         48.4022, 2.7017, 'indoor_chamber', 
         'Lieu de réception officielle du roi, décoré par les maîtres italiens', 
         'accessible_public', 
         '["galerie-francois-1er-1.jpg", "galerie-francois-1er-2.jpg"]', 
         '[{"type": "historique", "reference": "Archives du château"}]', 
         participant_1_id, true, participant_1_id),
        
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Jardin de Diane', 
         'Jardin Renaissance aux allées secrètes menant au trésor final', 
         48.4025, 2.7015, 'garden', 
         'Jardin privé de Diane de Poitiers, aménagé selon les canons Renaissance', 
         'partially_restricted', 
         '["jardin-diane-1.jpg", "jardin-diane-2.jpg", "jardin-diane-3.jpg"]', 
         '[{"type": "architectural", "reference": "Plans d\'époque"}]', 
         participant_3_id, true, participant_1_id),
        
        (gen_random_uuid(), fontainebleau_quest_id, 
         'Appartements de Napoléon', 
         'Salons impériaux contenant des indices sur la cachette napoléonienne', 
         48.4020, 2.7019, 'indoor_chamber', 
         'Résidence de l\'Empereur, témoin de l\'histoire impériale française', 
         'accessible_guided', 
         '["appartements-napoleon-1.jpg", "appartements-napoleon-2.jpg"]', 
         '[{"type": "imperial", "reference": "Mémoires de Constant"}]', 
         participant_4_id, true, participant_1_id)
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Données de la quête témoin Fontainebleau créées avec succès pour quest_id: %', fontainebleau_quest_id;
    ELSE
        RAISE NOTICE 'Quête Fontainebleau non trouvée dans la base de données';
    END IF;
END $$;