-- Créer des participants réalistes pour la quête Les Trésors Cachés de Fontainebleau
DO $$
DECLARE
    fontainebleau_quest_id UUID;
    participant_1_id UUID := gen_random_uuid();
    participant_2_id UUID := gen_random_uuid();
    participant_3_id UUID := gen_random_uuid();
    participant_4_id UUID := gen_random_uuid();
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
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 0, NOW() - INTERVAL '3 weeks', 
         '{"method": "historical_research", "location": "Bibliotheque du chateau", "notes": "Trouve dans les archives royales"}', 
         true, 150),
        (gen_random_uuid(), fontainebleau_quest_id, participant_2_id, 1, NOW() - INTERVAL '2 weeks', 
         '{"method": "archaeological_analysis", "location": "Galerie Francois Ier", "notes": "Symbole grave dans la pierre"}', 
         true, 200),
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 2, NOW() - INTERVAL '1 week', 
         '{"method": "local_knowledge", "location": "Jardin de Diane", "notes": "Connaissance locale transmise"}', 
         true, 250)
        ON CONFLICT DO NOTHING;
        
        -- Ajouter des activités de quête détaillées
        INSERT INTO public.quest_activities (id, quest_id, user_id, activity_type, activity_data, created_at) VALUES
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'quest_started', 
         '{"message": "Equipe formee pour explorer les mysteres de Fontainebleau"}', 
         NOW() - INTERVAL '3 weeks'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'clue_discovered', 
         '{"clue_index": 0, "title": "Les archives secretes de Francois Ier", "method": "Recherche historique approfondie"}', 
         NOW() - INTERVAL '3 weeks'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_2_id, 'clue_discovered', 
         '{"clue_index": 1, "title": "La salamandre royale", "method": "Analyse archeologique des symboles"}', 
         NOW() - INTERVAL '2 weeks'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 'ai_assistance', 
         '{"type": "historical_context", "suggestion": "Analyser les jardins Renaissance pour comprendre la symbolique"}', 
         NOW() - INTERVAL '10 days'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_3_id, 'clue_discovered', 
         '{"clue_index": 2, "title": "Le jardin secret de Diane", "method": "Connaissance locale et intuition"}', 
         NOW() - INTERVAL '1 week'),
        (gen_random_uuid(), fontainebleau_quest_id, participant_1_id, 'quest_completed', 
         '{"completion_time": "3 semaines", "team_effort": true, "total_points": 600}', 
         NOW() - INTERVAL '5 days')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'Données de la quête témoin Fontainebleau créées avec succès';
    ELSE
        RAISE NOTICE 'Quête Fontainebleau non trouvée dans la base de données';
    END IF;
END $$;