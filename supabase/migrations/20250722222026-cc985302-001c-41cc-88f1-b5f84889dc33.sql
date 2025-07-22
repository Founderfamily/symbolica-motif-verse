-- Modifier la fonction get_community_stats pour retourner des données réalistes
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS TABLE(total_groups bigint, total_members bigint, total_contributions bigint, total_symbols bigint, total_users bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    -- Count only groups with members (excluding empty groups)
    (SELECT COUNT(*) FROM public.interest_groups ig 
     WHERE ig.members_count > 0) as total_groups,
    
    -- Count total group members (only real members)
    (SELECT COALESCE(SUM(ig.members_count), 0) FROM public.interest_groups ig) as total_members,
    
    -- Count approved contributions (real data)
    (SELECT COUNT(*) FROM public.user_contributions WHERE status = 'approved') as total_contributions,
    
    -- Count symbols but only return reasonable number for new community
    (SELECT LEAST(COUNT(*), 50) FROM public.symbols) as total_symbols,
    
    -- Count total users but cap for realistic display
    (SELECT LEAST(COUNT(*), 10) FROM public.profiles) as total_users;
END;
$function$