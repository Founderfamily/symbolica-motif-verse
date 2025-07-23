
-- Table pour les messages de chat des quêtes
CREATE TABLE public.quest_chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour les activités en temps réel des quêtes
CREATE TABLE public.quest_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL,
  user_id uuid NOT NULL,
  activity_type text NOT NULL, -- 'message', 'evidence', 'theory', 'clue_discovery', 'like', 'comment'
  activity_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Table pour les participants aux quêtes
CREATE TABLE public.quest_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL,
  user_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'active', -- 'active', 'away', 'offline'
  last_seen timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(quest_id, user_id)
);

-- RLS pour quest_chat_messages
ALTER TABLE public.quest_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quest chat messages" ON public.quest_chat_messages
FOR SELECT USING (true);

CREATE POLICY "Users can create quest chat messages" ON public.quest_chat_messages
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest chat messages" ON public.quest_chat_messages
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quest chat messages" ON public.quest_chat_messages
FOR DELETE USING (auth.uid() = user_id);

-- RLS pour quest_activities
ALTER TABLE public.quest_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quest activities" ON public.quest_activities
FOR SELECT USING (true);

CREATE POLICY "Users can create quest activities" ON public.quest_activities
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS pour quest_participants
ALTER TABLE public.quest_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quest participants" ON public.quest_participants
FOR SELECT USING (true);

CREATE POLICY "Users can manage their own quest participation" ON public.quest_participants
FOR ALL USING (auth.uid() = user_id);

-- Activer la réplication en temps réel
ALTER TABLE public.quest_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.quest_activities REPLICA IDENTITY FULL;
ALTER TABLE public.quest_participants REPLICA IDENTITY FULL;

-- Ajouter aux publications realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_participants;

-- Fonction pour créer une activité automatiquement
CREATE OR REPLACE FUNCTION public.create_quest_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Créer une activité pour les nouveaux messages
  IF TG_TABLE_NAME = 'quest_chat_messages' THEN
    INSERT INTO public.quest_activities (quest_id, user_id, activity_type, activity_data)
    VALUES (NEW.quest_id, NEW.user_id, 'message', jsonb_build_object('content', NEW.content, 'message_id', NEW.id));
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger pour créer automatiquement les activités
CREATE TRIGGER quest_chat_activity_trigger
  AFTER INSERT ON public.quest_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.create_quest_activity();

-- Fonction pour mettre à jour last_seen des participants
CREATE OR REPLACE FUNCTION public.update_participant_last_seen()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mettre à jour ou insérer le participant
  INSERT INTO public.quest_participants (quest_id, user_id, status, last_seen)
  VALUES (NEW.quest_id, NEW.user_id, 'active', now())
  ON CONFLICT (quest_id, user_id) 
  DO UPDATE SET last_seen = now(), status = 'active';
  
  RETURN NEW;
END;
$$;

-- Trigger pour mettre à jour automatiquement les participants
CREATE TRIGGER quest_participant_update_trigger
  AFTER INSERT ON public.quest_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_participant_last_seen();

CREATE TRIGGER quest_activity_participant_trigger
  AFTER INSERT ON public.quest_activities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_participant_last_seen();
