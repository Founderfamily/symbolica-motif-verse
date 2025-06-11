
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
      console.log('📊 [PlatformStatsService] Fetching platform stats...');
      
      // Récupérer les statistiques principales avec des requêtes plus simples
      const [contributionsResult, symbolsResult, activitiesResult, contributorsResult] = await Promise.all([
        supabase.from('user_contributions').select('id', { count: 'exact' }),
        supabase.from('symbols').select('id, culture', { count: 'exact' }),
        this.getRecentActivities(),
        this.getTopContributors()
      ]);

      const totalContributions = contributionsResult.count || 0;
      const totalSymbols = symbolsResult.count || 0;
      
      // Compter les cultures uniques
      const cultures = new Set(symbolsResult.data?.map(s => s.culture).filter(Boolean) || []);
      const totalCultures = cultures.size;

      // Calculer les utilisateurs actifs (qui ont des contributions)
      const { data: uniqueUsers } = await supabase
        .from('user_contributions')
        .select('user_id')
        .not('user_id', 'is', null);
      
      const activeUsers = new Set(uniqueUsers?.map(u => u.user_id) || []).size;

      console.log('✅ [PlatformStatsService] Stats retrieved:', {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers
      });

      return {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers,
        recentActivities: activitiesResult,
        topContributors: contributorsResult
      };
    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching stats:', error);
      
      // Fallback avec des données par défaut
      return {
        totalContributions: 0,
        totalSymbols: 0,
        totalCultures: 0,
        activeUsers: 0,
        recentActivities: [],
        topContributors: []
      };
    }
  }

  private async getRecentActivities(): Promise<ActivityItem[]> {
    try {
      // Récupérer les contributions récentes sans joindre les profils pour éviter les erreurs de relation
      const { data: contributions } = await supabase
        .from('user_contributions')
        .select('id, title, cultural_context, created_at, user_id')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      return contributions?.map(contrib => ({
        id: contrib.id,
        type: 'contribution' as const,
        user_name: 'Contributeur', // Nom générique pour éviter les erreurs de relation
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
        .slice(0, 5)
        .map(([userId, count], index) => ({
          id: userId,
          name: `Contributeur ${index + 1}`, // Nom générique
          contributions_count: count,
          points: count * 25, // 25 points par contribution
          avatar_initials: `C${index + 1}`
        }));

      return topContributors;
    } catch (error) {
      console.error('❌ [PlatformStatsService] Error fetching top contributors:', error);
      return [];
    }
  }

  private getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}

export const platformStatsService = new PlatformStatsService();
