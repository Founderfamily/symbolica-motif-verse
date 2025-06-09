
-- Créer la table des quêtes de trésors
CREATE TABLE public.treasure_quests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  story_background TEXT,
  quest_type TEXT NOT NULL DEFAULT 'templar', -- 'templar', 'lost_civilization', 'grail', 'custom'
  difficulty_level TEXT NOT NULL DEFAULT 'beginner', -- 'beginner', 'intermediate', 'expert', 'master'
  max_participants INTEGER DEFAULT 10,
  min_participants INTEGER DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'active', 'completed', 'cancelled'
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  reward_points INTEGER DEFAULT 0,
  special_rewards JSONB DEFAULT '[]'::jsonb,
  clues JSONB DEFAULT '[]'::jsonb,
  target_symbols TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  translations JSONB DEFAULT '{"en": {}, "fr": {}}'::jsonb
);

-- Créer la table des participants aux quêtes
CREATE TABLE public.quest_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_name TEXT,
  role TEXT DEFAULT 'member', -- 'leader', 'member', 'observer'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active', -- 'active', 'left', 'completed'
  UNIQUE(quest_id, user_id)
);

-- Créer la table de progression des quêtes
CREATE TABLE public.quest_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clue_index INTEGER NOT NULL,
  discovered_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  discovery_data JSONB DEFAULT '{}'::jsonb,
  validated BOOLEAN DEFAULT false,
  validated_by UUID REFERENCES auth.users(id),
  points_earned INTEGER DEFAULT 0
);

-- Créer la table des récompenses de quêtes
CREATE TABLE public.quest_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL, -- 'points', 'badge', 'title', 'item'
  reward_data JSONB NOT NULL,
  awarded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  claimed BOOLEAN DEFAULT false
);

-- Créer la table des équipes de quêtes
CREATE TABLE public.quest_teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id UUID NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  leader_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  team_color TEXT DEFAULT '#3B82F6',
  team_motto TEXT,
  UNIQUE(quest_id, team_name)
);

-- Créer la table des messages d'équipe
CREATE TABLE public.quest_team_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.quest_teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'text', -- 'text', 'clue', 'discovery', 'system'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ajouter les politiques RLS
ALTER TABLE public.treasure_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_team_messages ENABLE ROW LEVEL SECURITY;

-- Politiques pour treasure_quests (visible à tous, modifiable par admins et créateurs)
CREATE POLICY "Quest visibility" ON public.treasure_quests FOR SELECT USING (true);
CREATE POLICY "Quest creation" ON public.treasure_quests FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Quest management" ON public.treasure_quests FOR UPDATE USING (
  auth.uid() = created_by OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques pour quest_participants
CREATE POLICY "Participant access" ON public.quest_participants FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques pour quest_progress
CREATE POLICY "Progress access" ON public.quest_progress FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.quest_participants WHERE quest_id = quest_progress.quest_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques pour quest_rewards
CREATE POLICY "Reward access" ON public.quest_rewards FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques pour quest_teams
CREATE POLICY "Team access" ON public.quest_teams FOR ALL USING (
  auth.uid() = leader_id OR 
  EXISTS (SELECT 1 FROM public.quest_participants WHERE quest_id = quest_teams.quest_id AND user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Politiques pour quest_team_messages
CREATE POLICY "Team message access" ON public.quest_team_messages FOR ALL USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.quest_participants qp 
    JOIN public.quest_teams qt ON qt.quest_id = qp.quest_id 
    WHERE qt.id = quest_team_messages.team_id AND qp.user_id = auth.uid()
  ) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Créer des triggers pour la mise à jour automatique
CREATE OR REPLACE FUNCTION update_quest_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER treasure_quests_updated_at
  BEFORE UPDATE ON public.treasure_quests
  FOR EACH ROW EXECUTE FUNCTION update_quest_updated_at();

-- Fonction pour calculer la progression d'une quête
CREATE OR REPLACE FUNCTION calculate_quest_completion(p_quest_id UUID, p_user_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  total_clues INTEGER;
  completed_clues INTEGER;
BEGIN
  -- Récupérer le nombre total d'indices
  SELECT jsonb_array_length(clues) INTO total_clues
  FROM public.treasure_quests 
  WHERE id = p_quest_id;
  
  -- Récupérer le nombre d'indices découverts par l'utilisateur
  SELECT COUNT(*) INTO completed_clues
  FROM public.quest_progress 
  WHERE quest_id = p_quest_id AND user_id = p_user_id AND validated = true;
  
  -- Calculer le pourcentage
  IF total_clues = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN ROUND((completed_clues::NUMERIC / total_clues::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour attribuer des récompenses automatiquement
CREATE OR REPLACE FUNCTION award_quest_completion_rewards()
RETURNS TRIGGER AS $$
DECLARE
  quest_record RECORD;
  completion_percentage NUMERIC;
BEGIN
  -- Récupérer les informations de la quête
  SELECT * INTO quest_record FROM public.treasure_quests WHERE id = NEW.quest_id;
  
  -- Calculer la progression
  completion_percentage := calculate_quest_completion(NEW.quest_id, NEW.user_id);
  
  -- Attribuer des récompenses selon la progression
  IF completion_percentage = 100 THEN
    -- Quête complétée - récompense complète
    INSERT INTO public.quest_rewards (quest_id, user_id, reward_type, reward_data)
    VALUES (
      NEW.quest_id, 
      NEW.user_id, 
      'points', 
      jsonb_build_object('amount', quest_record.reward_points, 'reason', 'Quest completion')
    );
    
    -- Attribuer badge de completion
    INSERT INTO public.quest_rewards (quest_id, user_id, reward_type, reward_data)
    VALUES (
      NEW.quest_id, 
      NEW.user_id, 
      'badge', 
      jsonb_build_object('name', quest_record.title || ' Master', 'icon', 'trophy')
    );
  ELSIF completion_percentage >= 50 THEN
    -- Progression significative - récompense partielle
    INSERT INTO public.quest_rewards (quest_id, user_id, reward_type, reward_data)
    VALUES (
      NEW.quest_id, 
      NEW.user_id, 
      'points', 
      jsonb_build_object('amount', quest_record.reward_points / 2, 'reason', 'Halfway milestone')
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER quest_progress_rewards
  AFTER INSERT OR UPDATE ON public.quest_progress
  FOR EACH ROW 
  WHEN (NEW.validated = true)
  EXECUTE FUNCTION award_quest_completion_rewards();
