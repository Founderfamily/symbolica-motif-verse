
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
      
      // Récupérer les statistiques principales
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
      const { count: activeUsers } = await supabase
        .from('user_contributions')
        .select('user_id', { count: 'exact' })
        .not('user_id', 'is', null);

      console.log('✅ [PlatformStatsService] Stats retrieved:', {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers: activeUsers || 0
      });

      return {
        totalContributions,
        totalSymbols,
        totalCultures,
        activeUsers: activeUsers || 0,
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
      const { data: contributions } = await supabase
        .from('user_contributions')
        .select(`
          id,
          title,
          cultural_context,
          created_at,
          profiles!inner(username, full_name)
        `)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);

      return contributions?.map(contrib => ({
        id: contrib.id,
        type: 'contribution' as const,
        user_name: contrib.profiles?.full_name || contrib.profiles?.username || 'Utilisateur',
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
      const { data: contributors } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          user_contributions!inner(id),
          user_points(total)
        `)
        .limit(5);

      return contributors?.map(contributor => ({
        id: contributor.id,
        name: contributor.full_name || contributor.username || 'Utilisateur',
        contributions_count: contributor.user_contributions?.length || 0,
        points: contributor.user_points?.[0]?.total || 0,
        avatar_initials: this.getInitials(contributor.full_name || contributor.username || 'U')
      })).sort((a, b) => b.contributions_count - a.contributions_count) || [];
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
