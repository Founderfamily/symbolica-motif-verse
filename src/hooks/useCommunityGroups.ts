import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

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
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['welcome-group', user?.id],
    queryFn: async () => {
      // Mettre à jour le statut en ligne de l'utilisateur actuel
      if (user?.id) {
        await supabase
          .from('community_group_members')
          .update({ 
            is_online: true,
            last_activity: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('group_id', '00000000-0000-0000-0000-000000000001');
      }
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