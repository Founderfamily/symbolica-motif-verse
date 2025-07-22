-- Fix RLS policies for community_group_messages to allow group members to send messages

-- First, let's check if the user is a member of the welcome group
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view messages in groups they belong to" ON public.community_group_messages;
DROP POLICY IF EXISTS "Users can create messages in groups they belong to" ON public.community_group_messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON public.community_group_messages;
DROP POLICY IF EXISTS "Users can delete their own messages" ON public.community_group_messages;

-- Create new policies that properly check group membership
CREATE POLICY "Users can view messages in groups they belong to" 
ON public.community_group_messages 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.community_group_members cgm 
    WHERE cgm.group_id = community_group_messages.group_id 
    AND cgm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create messages in groups they belong to" 
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

-- Ensure all authenticated users are automatically added to the welcome group
-- if they're not already members
INSERT INTO public.community_group_members (group_id, user_id)
SELECT '00000000-0000-0000-0000-000000000001', auth.uid()
WHERE auth.uid() IS NOT NULL
AND NOT EXISTS (
  SELECT 1 FROM public.community_group_members 
  WHERE group_id = '00000000-0000-0000-0000-000000000001' 
  AND user_id = auth.uid()
)
ON CONFLICT (group_id, user_id) DO NOTHING;