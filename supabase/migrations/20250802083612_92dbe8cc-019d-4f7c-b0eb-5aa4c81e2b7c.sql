-- Create system AI user profile for theories
INSERT INTO public.profiles (id, username, full_name, is_admin, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'AI Assistant',
  'Assistant IA Symbolica',
  false,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  updated_at = now();

-- Add some test evidence for the quest
INSERT INTO public.quest_evidence (
  quest_id, 
  submitted_by, 
  evidence_type, 
  title, 
  description, 
  validation_status,
  validation_score,
  validation_count,
  metadata
) VALUES 
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  '00000000-0000-0000-0000-000000000001',
  'photo',
  'Salamandre de François Ier - Galerie Renaissance',
  'Photographie détaillée du symbole de la salamandre gravé dans la galerie François Ier, avec éclairage révélant des détails cachés.',
  'validated',
  0.8,
  5,
  '{"camera_settings": {"ISO": 800, "f_stop": "f/2.8"}, "location_verified": true}'
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  '00000000-0000-0000-0000-000000000001',
  'document',
  'Plan architectural du bureau de Napoléon',
  'Plans originaux du XIXe siècle montrant les modifications apportées au bureau de Napoléon, avec annotation de passages secrets.',
  'pending',
  0.6,
  3,
  '{"source": "Archives Nationales", "document_date": "1814", "authenticated": true}'
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  '00000000-0000-0000-0000-000000000001',
  'location',
  'Escalier dérobé - Coordonnées GPS',
  'Localisation précise de l\'entrée de l\'escalier secret identifié dans les plans historiques, avec mesures géophysiques.',
  'disputed',
  0.4,
  4,
  '{"gps_accuracy": "±2m", "ground_penetrating_radar": true, "anomaly_detected": true}'
),
(
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  '00000000-0000-0000-0000-000000000001',
  'artifact',
  'Fragment de clé royale',
  'Morceau de clé en bronze doré trouvé près du bureau de Napoléon, gravure compatible avec serrures du XVIe siècle.',
  'validated',
  0.9,
  7,
  '{"material": "bronze_doré", "period": "XVIe_siècle", "expert_validation": "Musée_Fontainebleau"}'
);

-- Create a sample theory to show the feature works
INSERT INTO public.quest_theories (
  quest_id,
  author_id,
  title,
  description,
  theory_type,
  supporting_evidence,
  confidence_level,
  community_score,
  votes_count,
  status
) VALUES (
  '0b58fcc0-f40e-4762-a4f7-9bc074824820',
  '00000000-0000-0000-0000-000000000001',
  'Théorie du Trésor de la Guerre de Cent Ans',
  '## Hypothèse principale

Basée sur l''analyse des symboles et documents historiques, cette théorie suggère que les trésors cachés de Fontainebleau remontent à la période de Charles VII et constituent une réserve stratégique constituée pendant la Guerre de Cent Ans.

## Arguments supportant cette théorie

1. **Contexte historique** : La période correspond aux besoins de financement des campagnes militaires
2. **Symboles identifiés** : La salamandre de François Ier servait à marquer les caches royales  
3. **Architecture cohérente** : Les passages secrets suivent les plans de fortification du XVe siècle
4. **Sources documentaires** : Les chroniques de l''époque mentionnent des "trésors de guerre"

## Preuves à rechercher

- Archives de la Chambre des Comptes pour la période 1420-1450
- Expertise métallurgique des fragments de clés
- Analyse stratigraphique des murs du château
- Consultation des registres de l''Ordre de Saint-Michel

## Étapes de vérification recommandées

1. Datation précise des modifications architecturales
2. Analyse comparative avec d''autres châteaux royaux
3. Recherche dans les inventaires post-mortem royaux
4. Collaboration avec le Centre d''études supérieures de la Renaissance',
  'historical_analysis',
  ARRAY['Salamandre de François Ier - Galerie Renaissance', 'Plan architectural du bureau de Napoléon', 'Fragment de clé royale'],
  85,
  23,
  8,
  'active'
);