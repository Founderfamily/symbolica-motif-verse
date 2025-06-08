
import { supabase } from '@/integrations/supabase/client';

export interface CommunityStats {
  totalGroups: number;
  totalMembers: number;
  totalDiscoveries: number;
  activeGroupsToday: number;
}

/**
 * Service pour récupérer les vraies statistiques de la communauté
 */
export const communityStatsService = {
  /**
   * Récupère les statistiques globales de la communauté
   */
  getCommunityStats: async (): Promise<CommunityStats> => {
    try {
      console.log('🚀 [CommunityStatsService] Fetching real community stats...');

      // Récupérer les groupes avec leurs vrais compteurs (maintenant synchronisés)
      const { data: groups, error: groupsError } = await supabase
        .from('interest_groups')
        .select('members_count, discoveries_count, created_at');

      if (groupsError) {
        console.error('❌ [CommunityStatsService] Error fetching groups:', groupsError);
        throw groupsError;
      }

      console.log('✅ [CommunityStatsService] Groups data:', groups?.length || 0);

      // Calculer les totaux
      const totalGroups = groups?.length || 0;
      const totalMembers = groups?.reduce((sum, group) => sum + (group.members_count || 0), 0) || 0;
      const totalDiscoveries = groups?.reduce((sum, group) => sum + (group.discoveries_count || 0), 0) || 0;

      // Calculer les groupes actifs aujourd'hui (créés ou avec activité)
      const today = new Date().toISOString().split('T')[0];
      const activeGroupsToday = groups?.filter(group => 
        group.created_at && group.created_at.startsWith(today)
      ).length || 0;

      const stats: CommunityStats = {
        totalGroups,
        totalMembers,
        totalDiscoveries,
        activeGroupsToday
      };

      console.log('🎉 [CommunityStatsService] Real stats calculated:', stats);
      return stats;

    } catch (error) {
      console.error('💥 [CommunityStatsService] Error calculating stats:', error);
      // Retourner des statistiques par défaut en cas d'erreur
      return {
        totalGroups: 0,
        totalMembers: 0,
        totalDiscoveries: 0,
        activeGroupsToday: 0
      };
    }
  }
};
