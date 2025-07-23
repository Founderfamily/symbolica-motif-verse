
-- Mettre à jour les types de quêtes existants vers les nouveaux types
UPDATE public.treasure_quests 
SET quest_type = CASE 
  WHEN quest_type = 'templar' THEN 'myth'
  WHEN quest_type = 'lost_civilization' THEN 'myth'
  WHEN quest_type = 'grail' THEN 'myth'
  WHEN quest_type = 'graal' THEN 'myth'
  WHEN quest_type = 'custom' THEN 'found_treasure'
  ELSE 'unfound_treasure'
END;

-- Supprimer les colonnes liées aux points et participants (obsolètes pour le nouveau système)
ALTER TABLE public.treasure_quests 
DROP COLUMN IF EXISTS reward_points,
DROP COLUMN IF EXISTS max_participants,
DROP COLUMN IF EXISTS min_participants;

-- Ajouter les nouvelles colonnes pour la collaboration IA et les indices
ALTER TABLE public.treasure_quests 
ADD COLUMN IF NOT EXISTS ai_research_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS collaboration_type text DEFAULT 'open',
ADD COLUMN IF NOT EXISTS clue_submission_enabled boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS ai_clue_suggestions jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS research_status text DEFAULT 'active';

-- Mettre à jour les contraintes pour les nouveaux types de quêtes
ALTER TABLE public.treasure_quests 
DROP CONSTRAINT IF EXISTS treasure_quests_quest_type_check;

ALTER TABLE public.treasure_quests 
ADD CONSTRAINT treasure_quests_quest_type_check 
CHECK (quest_type IN ('myth', 'found_treasure', 'unfound_treasure'));

-- Mettre à jour les contraintes pour les statuts de recherche
ALTER TABLE public.treasure_quests 
ADD CONSTRAINT treasure_quests_research_status_check 
CHECK (research_status IN ('active', 'solved', 'paused', 'archived'));

-- Mettre à jour les contraintes pour les types de collaboration
ALTER TABLE public.treasure_quests 
ADD CONSTRAINT treasure_quests_collaboration_type_check 
CHECK (collaboration_type IN ('open', 'restricted', 'expert_only'));
