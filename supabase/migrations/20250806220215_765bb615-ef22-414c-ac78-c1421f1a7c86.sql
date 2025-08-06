-- Ajouter les données de progression pour la quête témoin "Les Trésors Cachés de Fontainebleau"

-- Créer des UUIDs valides pour les utilisateurs fictifs
WITH user_uuids AS (
  SELECT 
    '11111111-1111-1111-1111-111111111111'::uuid as marie_id,
    '22222222-2222-2222-2222-222222222222'::uuid as jean_id,
    '33333333-3333-3333-3333-333333333333'::uuid as pierre_id,
    '44444444-4444-4444-4444-444444444444'::uuid as anna_id
)

-- Insérer les entrées de progression pour chaque indice de la quête
INSERT INTO quest_progress (
  id,
  quest_id, 
  user_id,
  clue_index,
  discovered_at,
  discovery_data,
  validated,
  validated_by,
  points_earned
) 
SELECT * FROM (
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, marie_id, 0, '2024-01-15 10:30:00'::timestamp, 
    '{"method": "historical_research", "location": "Archives Nationales", "confidence": 95}'::jsonb, true, jean_id, 150
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, marie_id, 1, '2024-01-18 14:45:00'::timestamp, 
    '{"method": "field_investigation", "location": "Château de Fontainebleau", "confidence": 88}'::jsonb, true, pierre_id, 200
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, marie_id, 2, '2024-01-22 16:20:00'::timestamp, 
    '{"method": "symbolic_analysis", "location": "Forêt de Fontainebleau", "confidence": 92}'::jsonb, true, anna_id, 250
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, jean_id, 0, '2024-01-16 09:15:00'::timestamp, 
    '{"method": "archaeological_survey", "location": "Site historique", "confidence": 90}'::jsonb, true, marie_id, 150
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, jean_id, 1, '2024-01-19 11:30:00'::timestamp, 
    '{"method": "ground_penetrating_radar", "location": "Jardin du château", "confidence": 85}'::jsonb, true, anna_id, 200
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, jean_id, 2, '2024-01-23 13:10:00'::timestamp, 
    '{"method": "collaborative_validation", "location": "Point de convergence", "confidence": 96}'::jsonb, true, pierre_id, 250
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, pierre_id, 0, '2024-01-17 08:45:00'::timestamp, 
    '{"method": "local_knowledge", "location": "Guides locaux", "confidence": 93}'::jsonb, true, anna_id, 150
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, pierre_id, 1, '2024-01-20 15:00:00'::timestamp, 
    '{"method": "topographical_analysis", "location": "Cartographie ancienne", "confidence": 87}'::jsonb, true, marie_id, 200
  FROM user_uuids
  UNION ALL
  SELECT 
    gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820'::uuid, pierre_id, 2, '2024-01-24 17:35:00'::timestamp, 
    '{"method": "synthesis_validation", "location": "Résolution finale", "confidence": 98}'::jsonb, true, jean_id, 250
  FROM user_uuids
) progress_data;