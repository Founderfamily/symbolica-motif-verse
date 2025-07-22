-- Créer la table pour les messages des groupes communautaires
CREATE TABLE public.community_group_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.community_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_message_id UUID REFERENCES public.community_group_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.community_group_messages ENABLE ROW LEVEL SECURITY;

-- Policies pour les messages des groupes
CREATE POLICY "Group members can view messages" 
ON public.community_group_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.community_group_members cgm 
  WHERE cgm.group_id = community_group_messages.group_id 
  AND cgm.user_id = auth.uid()
));

CREATE POLICY "Group members can create messages" 
ON public.community_group_messages 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM public.community_group_members cgm 
    WHERE cgm.group_id = community_group_messages.group_id 
    AND cgm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own messages" 
ON public.community_group_messages 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.community_group_messages 
FOR DELETE 
USING (auth.uid() = user_id);

-- Fonction pour mettre à jour les timestamps automatiquement
CREATE TRIGGER update_community_group_messages_updated_at
  BEFORE UPDATE ON public.community_group_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Activer le realtime pour les messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_group_messages;