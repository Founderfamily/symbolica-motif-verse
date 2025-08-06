-- Ajouter les données de progression pour la quête témoin "Les Trésors Cachés de Fontainebleau"

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
) VALUES 
-- Progression pour Marie Dubois
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'marie-dubois-id', 0, '2024-01-15 10:30:00'::timestamp, 
 '{"method": "historical_research", "location": "Archives Nationales", "confidence": 95}'::jsonb, true, 'jean-moreau-id', 150),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'marie-dubois-id', 1, '2024-01-18 14:45:00'::timestamp, 
 '{"method": "field_investigation", "location": "Château de Fontainebleau", "confidence": 88}'::jsonb, true, 'pierre-fontaine-id', 200),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'marie-dubois-id', 2, '2024-01-22 16:20:00'::timestamp, 
 '{"method": "symbolic_analysis", "location": "Forêt de Fontainebleau", "confidence": 92}'::jsonb, true, 'anna-rousseau-id', 250),

-- Progression pour Jean Moreau  
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'jean-moreau-id', 0, '2024-01-16 09:15:00'::timestamp, 
 '{"method": "archaeological_survey", "location": "Site historique", "confidence": 90}'::jsonb, true, 'marie-dubois-id', 150),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'jean-moreau-id', 1, '2024-01-19 11:30:00'::timestamp, 
 '{"method": "ground_penetrating_radar", "location": "Jardin du château", "confidence": 85}'::jsonb, true, 'anna-rousseau-id', 200),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'jean-moreau-id', 2, '2024-01-23 13:10:00'::timestamp, 
 '{"method": "collaborative_validation", "location": "Point de convergence", "confidence": 96}'::jsonb, true, 'pierre-fontaine-id', 250),

-- Progression pour Pierre Fontaine
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'pierre-fontaine-id', 0, '2024-01-17 08:45:00'::timestamp, 
 '{"method": "local_knowledge", "location": "Guides locaux", "confidence": 93}'::jsonb, true, 'anna-rousseau-id', 150),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'pierre-fontaine-id', 1, '2024-01-20 15:00:00'::timestamp, 
 '{"method": "topographical_analysis", "location": "Cartographie ancienne", "confidence": 87}'::jsonb, true, 'marie-dubois-id', 200),
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'pierre-fontaine-id', 2, '2024-01-24 17:35:00'::timestamp, 
 '{"method": "synthesis_validation", "location": "Résolution finale", "confidence": 98}'::jsonb, true, 'jean-moreau-id', 250);

-- Ajouter des preuves de découverte pour enrichir l'expérience
INSERT INTO quest_evidence (
  id,
  quest_id,
  user_id, 
  evidence_type,
  evidence_data,
  verified,
  verified_by,
  created_at
) VALUES
(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'marie-dubois-id', 'document', 
 '{"title": "Manuscrit Royal", "description": "Document historique mentionnant les jardins secrets", "image_url": "/evidence/manuscript-royal.jpg"}'::jsonb, 
 true, 'jean-moreau-id', '2024-01-15 10:30:00'::timestamp),

(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'jean-moreau-id', 'photograph', 
 '{"title": "Vestige Architectural", "description": "Pierre gravée découverte dans les jardins", "image_url": "/evidence/carved-stone.jpg"}'::jsonb, 
 true, 'pierre-fontaine-id', '2024-01-18 14:45:00'::timestamp),

(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'pierre-fontaine-id', 'map', 
 '{"title": "Carte Ancienne Annotée", "description": "Plan du château avec annotations mystérieuses", "image_url": "/evidence/annotated-map.jpg"}'::jsonb, 
 true, 'anna-rousseau-id', '2024-01-22 16:20:00'::timestamp),

(gen_random_uuid(), '0b58fcc0-f40e-4762-a4f7-9bc074824820', 'anna-rousseau-id', 'artifact', 
 '{"title": "Médaillon Royal", "description": "Médaillon aux armes royales trouvé lors des fouilles", "image_url": "/evidence/royal-medallion.jpg"}'::jsonb, 
 true, 'marie-dubois-id', '2024-01-24 17:35:00'::timestamp);