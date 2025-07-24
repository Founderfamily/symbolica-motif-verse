-- Créer les tables manquantes pour le chat et activités de quête
CREATE TABLE IF NOT EXISTS public.quest_chat_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.quest_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  quest_id uuid NOT NULL REFERENCES public.treasure_quests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type text NOT NULL, -- 'message', 'evidence', 'theory', 'join', 'clue_discovery'
  activity_data jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.quest_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_activities ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour quest_chat_messages
CREATE POLICY "Users can view quest chat messages" ON public.quest_chat_messages
FOR SELECT USING (true);

CREATE POLICY "Users can create quest chat messages" ON public.quest_chat_messages
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quest chat messages" ON public.quest_chat_messages
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quest chat messages" ON public.quest_chat_messages
FOR DELETE USING (auth.uid() = user_id);

-- Politiques RLS pour quest_activities
CREATE POLICY "Users can view quest activities" ON public.quest_activities
FOR SELECT USING (true);

CREATE POLICY "Users can create quest activities" ON public.quest_activities
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Activer la réplication en temps réel
ALTER TABLE public.quest_chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.quest_activities REPLICA IDENTITY FULL;

-- Ajouter aux publications realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.quest_activities;