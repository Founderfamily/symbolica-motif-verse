
import { supabase } from '@/integrations/supabase/client';

export interface PlatformStats {
  totalContributions: number;
  totalSymbols: number;
  totalCultures: number;
  activeUsers: number;
  recentActivities: ActivityItem[];
  topContributors: ContributorStats[];
}

export interface ActivityItem {
  id: string;
  type: 'contribution' | 'symbol_added' | 'collection_created';
  user_name: string;
  title: string;
  created_at: string;
  culture?: string;
}

export interface ContributorStats {
  id: string;
  name: string;
  contributions_count: number;
  points: number;
  avatar_initials: string;
}

class PlatformStatsService {
  async getPlatformStats(): Promise<PlatformStats> {
    try {
      console.log('📊 [PlatformStatsService] Fetching real platform stats using RPC...');
      
      // Utiliser la fonction RPC pour obtenir les vraies statistiques
      const { data: statsData, error: statsError } = await supabase.rpc('get_community_stats');
      
      if (statsError) {
        console.error('❌ [PlatformStatsService] RPC Error:', statsError);
        throw statsError;
      }

      const stats = statsData?.[0];
      if (!stats) {
        throw new Error('No stats data returned from RPC');
      }

      // Récupérer les activités récentes et contributeurs en parallèle
      const [activitiesResult, contributorsResult] = await Promise.all([
        this.getRecentActivities(),
        this.getTopContributors()
      ]);

      // Calculer les cultures uniques si on a des symboles
      let totalCultures = 0;
      if (Number(stats.total_symbols) > 0) {
        const { data: symbolsData } = await supabase
          .from('symbols')
          .select('culture')
          .not('culture', 'is', null);
        
        const cultures = new Set(symbolsData?.map(s => s.culture).filter(Boolean) || []);
        totalCultures = cultures.size;
      }

      const result = {
        totalContributions: Number(stats.total_contributions) || 0,
        totalSymbols: Number(stats.total_symbols) || 0,
        totalCultures,
        activeUsers: Number(stats.total_users) || 0,
        recentActivities: activitiesResult,
        topContributors: contributorsResult
      };

      console.log('✅ [PlatformStatsService] Real stats retrieved:', result);
      return result;

    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching stats:', error);
      
      // Fallback avec des données par défaut très modestes mais cohérentes
      return {
        totalContributions: 0,
        totalSymbols: 0,
        totalCultures: 0,
        activeUsers: 1, // Au moins l'utilisateur actuel
        recentActivities: [],
        topContributors: []
      };
    }
  }

  private async getRecentActivities(): Promise<ActivityItem[]> {
    try {
      // Récupérer les contributions récentes
      const { data: contributions } = await supabase
        .from('user_contributions')
        .select('id, title, cultural_context, created_at, user_id')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

      return contributions?.map(contrib => ({
        id: contrib.id,
        type: 'contribution' as const,
        user_name: 'Explorer', // Nom générique pour la confidentialité
        title: contrib.title,
        created_at: contrib.created_at,
        culture: contrib.cultural_context
      })) || [];
    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching recent activities:', error);
      return [];
    }
  }

  private async getTopContributors(): Promise<ContributorStats[]> {
    try {
      // Récupérer les contributeurs avec le nombre de contributions
      const { data: contributorCounts } = await supabase
        .from('user_contributions')
        .select('user_id')
        .eq('status', 'approved');

      if (!contributorCounts) return [];

      // Compter les contributions par utilisateur
      const userContributions = contributorCounts.reduce((acc, contrib) => {
        acc[contrib.user_id] = (acc[contrib.user_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Créer les statistiques des contributeurs
      const topContributors = Object.entries(userContributions)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3) // Seulement top 3 pour une petite communauté
        .map(([userId, count], index) => ({
          id: userId,
          name: `Explorer ${index + 1}`, // Nom générique
          contributions_count: count,
          points: count * 25, // 25 points par contribution
          avatar_initials: `E${index + 1}`
        }));

      return topContributors;
    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching top contributors:', error);
      return [];
    }
  }
}

export const platformStatsService = new PlatformStatsService();
