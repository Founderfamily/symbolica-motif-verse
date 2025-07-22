import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCommunityGroups = () => {
  return useQuery({
    queryKey: ['community-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_groups')
        .select(`
          *,
          community_group_members (
            id,
            user_id,
            is_online,
            last_activity
          )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};

export const useWelcomeGroup = () => {
  return useQuery({
    queryKey: ['welcome-group'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_groups')
        .select(`
          *,
          community_group_members (
            id,
            user_id,
            is_online,
            last_activity
          )
        `)
        .eq('is_welcome_group', true)
        .single();

      if (error) throw error;

      // Calculer les statistiques
      const totalMembers = data.community_group_members?.length || 0;
      const onlineMembers = data.community_group_members?.filter(
        member => member.is_online
      ).length || 0;

      return {
        ...data,
        totalMembers,
        onlineMembers
      };
    },
  });
};