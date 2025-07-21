-- Créer une table pour les messages de chat en temps réel dans les groupes
CREATE TABLE public.group_chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_edited BOOLEAN NOT NULL DEFAULT false,
  reply_to_id UUID NULL REFERENCES public.group_chat_messages(id)
);

-- Activer RLS
ALTER TABLE public.group_chat_messages ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour les messages de chat de groupe
CREATE POLICY "Les membres peuvent voir les messages de leur groupe"
ON public.group_chat_messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_chat_messages.group_id 
    AND gm.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.interest_groups ig
    WHERE ig.id = group_chat_messages.group_id 
    AND ig.is_public = true
  )
);

CREATE POLICY "Les membres peuvent envoyer des messages dans leur groupe"
ON public.group_chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.group_members gm
    WHERE gm.group_id = group_chat_messages.group_id 
    AND gm.user_id = auth.uid()
  )
);

CREATE POLICY "Les utilisateurs peuvent modifier leurs propres messages"
ON public.group_chat_messages
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs propres messages"
ON public.group_chat_messages
FOR DELETE
USING (auth.uid() = user_id);

-- Index pour de meilleures performances
CREATE INDEX idx_group_chat_messages_group_id_created_at ON public.group_chat_messages(group_id, created_at DESC);
CREATE INDEX idx_group_chat_messages_reply_to ON public.group_chat_messages(reply_to_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_group_chat_messages_updated_at
  BEFORE UPDATE ON public.group_chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Activer la réplication en temps réel
ALTER TABLE public.group_chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_chat_messages;