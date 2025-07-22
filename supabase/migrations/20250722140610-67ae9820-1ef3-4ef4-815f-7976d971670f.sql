-- Add current user to welcome group and fix the trigger
-- First, ensure all existing users are in the welcome group
INSERT INTO public.community_group_members (group_id, user_id)
SELECT '00000000-0000-0000-0000-000000000001', id
FROM public.profiles
WHERE id NOT IN (
  SELECT user_id FROM public.community_group_members 
  WHERE group_id = '00000000-0000-0000-0000-000000000001'
)
ON CONFLICT (group_id, user_id) DO NOTHING;

-- Update the trigger to use the correct table name
-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS trigger_add_user_to_welcome_group ON auth.users;

-- Create the new trigger that adds users to the welcome group
CREATE OR REPLACE FUNCTION public.add_user_to_welcome_group()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Add the user to the welcome group
  INSERT INTO public.community_group_members (group_id, user_id)
  VALUES ('00000000-0000-0000-0000-000000000001', NEW.id)
  ON CONFLICT (group_id, user_id) DO NOTHING;
  
  RETURN NEW;
END;
$function$;

-- Create trigger that runs when a profile is created (not when auth.user is created)
DROP TRIGGER IF EXISTS trigger_add_user_to_welcome_group_on_profile ON public.profiles;
CREATE TRIGGER trigger_add_user_to_welcome_group_on_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.add_user_to_welcome_group();