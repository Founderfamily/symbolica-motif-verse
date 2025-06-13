
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
      console.log('📊 [PlatformStatsService] Fetching real platform stats...');
      
      // Récupérer les vraies statistiques
      const [contributionsResult, symbolsResult, usersResult, activitiesResult, contributorsResult] = await Promise.all([
        supabase.from('user_contributions').select('id', { count: 'exact' }),
        supabase.from('symbols').select('id, culture', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }),
        this.getRecentActivities(),
        this.getTopContributors()
      ]);

      const totalContributions = contributionsResult.count || 0;
      const totalSymbols = symbolsResult.count || 0;
      const totalUsers = usersResult.count || 0;
      
      // Compter les cultures uniques
      const cultures = new Set(symbolsResult.data?.map(s => s.culture).filter(Boolean) || []);
      const totalCultures = cultures.size;

      // Pour une communauté naissante, on considère que tous les utilisateurs sont actifs
      const activeUsers = Math.min(totalUsers, Math.max(1, Math.floor(totalUsers * 0.8)));

      console.log('✅ [PlatformStatsService] Real stats retrieved:', {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers: totalUsers
      });

      return {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers: totalUsers, // Tous les utilisateurs sont considérés comme actifs dans une petite communauté
        recentActivities: activitiesResult,
        topContributors: contributorsResult
      };
    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching stats:', error);
      
      // Fallback avec des données par défaut très modestes
      return {
        totalContributions: 1,
        totalSymbols: 20,
        totalCultures: 6,
        activeUsers: 6,
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
