
import { supabase } from '@/integrations/supabase/client';

export interface CommunityStats {
  totalGroups: number;
  totalMembers: number;
  totalDiscoveries: number;
  activeGroupsToday: number;
}

/**
 * Service pour récupérer les vraies statistiques de la communauté
 * Optimisé pour réduire les timeouts au démarrage
 */
export const communityStatsService = {
  /**
   * Récupère les statistiques globales de la communauté
   * Avec timeout optimisé pour éviter les blocages
   */
  getCommunityStats: async (): Promise<CommunityStats> => {
    try {
      console.log('🚀 [CommunityStatsService] Fetching community stats with timeout...');

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Community stats timeout')), 2000)
      );

      const statsPromise = this.fetchStatsFromDatabase();

      const stats = await Promise.race([statsPromise, timeoutPromise]);
      
      console.log('🎉 [CommunityStatsService] Stats fetched successfully:', stats);
      return stats;

    } catch (error) {
      console.error('💥 [CommunityStatsService] Error or timeout:', error);
      // Return default stats on error to avoid blocking UI
      return {
        totalGroups: 0,
        totalMembers: 0,
        totalDiscoveries: 0,
        activeGroupsToday: 0
      };
    }
  },

  /**
   * Internal method to fetch stats from database
   */
  fetchStatsFromDatabase: async (): Promise<CommunityStats> => {
    // Récupérer les groupes avec leurs vrais compteurs
    const { data: groups, error: groupsError } = await supabase
      .from('interest_groups')
      .select('members_count, discoveries_count, created_at')
      .limit(100); // Limit for performance

    if (groupsError) {
      console.error('❌ [CommunityStatsService] Error fetching groups:', groupsError);
      throw groupsError;
    }

    console.log('✅ [CommunityStatsService] Groups data:', groups?.length || 0);

    // Calculer les totaux
    const totalGroups = groups?.length || 0;
    const totalMembers = groups?.reduce((sum, group) => sum + (group.members_count || 0), 0) || 0;
    const totalDiscoveries = groups?.reduce((sum, group) => sum + (group.discoveries_count || 0), 0) || 0;

    // Calculer les groupes actifs aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const activeGroupsToday = groups?.filter(group => 
      group.created_at && group.created_at.startsWith(today)
    ).length || 0;

    return {
      totalGroups,
      totalMembers,
      totalDiscoveries,
      activeGroupsToday
    };
  }
};
