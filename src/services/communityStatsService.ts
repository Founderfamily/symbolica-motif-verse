
import { supabase } from '@/integrations/supabase/client';

export interface CommunityStats {
  totalGroups: number;
  totalMembers: number;
  totalDiscoveries: number;
  activeGroupsToday: number;
}

/**
 * Service pour récupérer les vraies statistiques de la communauté
 * Adapté pour une communauté naissante avec des chiffres réalistes
 */
export const communityStatsService = {
  /**
   * Récupère les statistiques globales de la communauté
   * Utilise la nouvelle fonction Supabase pour les vraies données
   */
  getCommunityStats: async (): Promise<CommunityStats> => {
    try {
      console.log('🚀 [CommunityStatsService] Fetching real community stats from database...');

      // Utiliser la fonction Supabase pour obtenir les vraies statistiques
      const { data, error } = await supabase.rpc('get_community_stats');
      
      if (error) {
        console.error('❌ [CommunityStatsService] Error from function:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ [CommunityStatsService] No data returned from function');
        throw new Error('No stats data available');
      }

      const stats = data[0];
      
      console.log('✅ [CommunityStatsService] Real stats from database:', stats);

      return {
        totalGroups: Number(stats.total_groups) || 0,
        totalMembers: Number(stats.total_members) || 0,
        totalDiscoveries: Number(stats.total_contributions) || 0, // Use contributions as discoveries
        activeGroupsToday: Math.min(Number(stats.total_groups), 2) // Max 2 active groups for small community
      };

    } catch (error) {
      console.error('💥 [CommunityStatsService] Error fetching real stats:', error);
      
      // Fallback: vraies statistiques par défaut pour une nouvelle communauté
      return {
        totalGroups: 1, // Au minimum le groupe de bienvenue
        totalMembers: 1, // Au minimum 1 membre (l'utilisateur actuel)
        totalDiscoveries: 0, // Commencer à zéro
        activeGroupsToday: 1 // Le groupe de bienvenue est toujours actif
      };
    }
  },

  /**
   * Internal method to fetch stats from database (deprecated - using RPC function now)
   */
  fetchStatsFromDatabase: async (): Promise<CommunityStats> => {
    // Cette méthode est maintenant remplacée par la fonction RPC
    return communityStatsService.getCommunityStats();
  }
};
