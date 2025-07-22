-- Ajouter une politique pour permettre aux membres des community_groups d'utiliser group_chat_messages
CREATE POLICY "Community group members can view messages"
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
    SELECT 1 FROM public.community_group_members cgm
    WHERE cgm.group_id = group_chat_messages.group_id 
    AND cgm.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.interest_groups ig
    WHERE ig.id = group_chat_messages.group_id 
    AND ig.is_public = true
  )
);

CREATE POLICY "Community group members can send messages"
ON public.group_chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_chat_messages.group_id 
      AND gm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM public.community_group_members cgm
      WHERE cgm.group_id = group_chat_messages.group_id 
      AND cgm.user_id = auth.uid()
    )
  )
);