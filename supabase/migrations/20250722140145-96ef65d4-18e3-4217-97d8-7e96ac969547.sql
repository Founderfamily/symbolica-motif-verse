-- Create function to get real community statistics
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS TABLE(
  total_groups bigint,
  total_members bigint,
  total_contributions bigint,
  total_symbols bigint,
  total_users bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    -- Count total groups
    (SELECT COUNT(*) FROM public.interest_groups) as total_groups,
    
    -- Count total group members (including welcome group)
    (SELECT COUNT(*) FROM public.community_group_members) as total_members,
    
    -- Count approved contributions
    (SELECT COUNT(*) FROM public.user_contributions WHERE status = 'approved') as total_contributions,
    
    -- Count total symbols
    (SELECT COUNT(*) FROM public.symbols) as total_symbols,
    
    -- Count total users (profiles)
    (SELECT COUNT(*) FROM public.profiles) as total_users;
END;
$function$;