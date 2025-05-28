
import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  activeUsersLast30Days: number;
  bannedUsers: number;
  adminUsers: number;
  newUsersToday: number;
  newUsersWeek: number;
  totalContributions: number;
  pendingContributions: number;
  approvedContributions: number;
  rejectedContributions: number;
  contributionsToday: number;
  contributionsWeek: number;
  totalSymbols: number;
  verifiedSymbols: number;
  totalSymbolLocations: number;
  topContributors: Array<{
    userId: string;
    username: string;
    fullName: string;
    contributionsCount: number;
    pointsTotal: number;
  }>;
  contributionsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

export interface UserManagementStats {
  total_users: number;
  active_users_30d: number;
  banned_users: number;
  admin_users: number;
  new_users_today: number;
  new_users_week: number;
}

export interface ContributionManagementStats {
  total_contributions: number;
  pending_contributions: number;
  approved_contributions: number;
  rejected_contributions: number;
  contributions_today: number;
  contributions_week: number;
}

/**
 * Service pour gérer les statistiques d'administration
 */
export const adminStatsService = {
  /**
   * Récupère toutes les statistiques du tableau de bord admin
   */
  getDashboardStats: async (): Promise<AdminStats> => {
    try {
      // Récupérer les statistiques des utilisateurs
      const { data: userStats, error: userError } = await supabase
        .rpc('get_user_management_stats');
      
      if (userError) throw userError;

      // Récupérer les statistiques des contributions
      const { data: contributionStats, error: contributionError } = await supabase
        .rpc('get_contribution_management_stats');
      
      if (contributionError) throw contributionError;

      // Récupérer les statistiques des symboles
      const { data: symbolsData, error: symbolsError } = await supabase
        .from('symbols')
        .select('id');
      
      if (symbolsError) throw symbolsError;

      // Récupérer les statistiques des emplacements de symboles
      const { data: symbolLocationsData, error: symbolLocationsError } = await supabase
        .from('symbol_locations')
        .select('id, is_verified');
      
      if (symbolLocationsError) throw symbolLocationsError;

      // Récupérer les top contributeurs
      const { data: topContributorsData, error: topContributorsError } = await supabase
        .rpc('get_top_contributors', { p_limit: 10 });
      
      if (topContributorsError) throw topContributorsError;

      // Récupérer les contributions au fil du temps (30 derniers jours)
      const { data: contributionsOverTimeData, error: contributionsOverTimeError } = await supabase
        .from('user_contributions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });
      
      if (contributionsOverTimeError) throw contributionsOverTimeError;

      // Traiter les données des contributions au fil du temps
      const contributionsOverTime = contributionsOverTimeData?.reduce((acc: any[], contribution) => {
        const date = new Date(contribution.created_at).toISOString().split('T')[0];
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ date, count: 1 });
        }
        return acc;
      }, []) || [];

      const userStatsRow = userStats?.[0] as UserManagementStats || {
        total_users: 0,
        active_users_30d: 0,
        banned_users: 0,
        admin_users: 0,
        new_users_today: 0,
        new_users_week: 0
      };

      const contributionStatsRow = contributionStats?.[0] as ContributionManagementStats || {
        total_contributions: 0,
        pending_contributions: 0,
        approved_contributions: 0,
        rejected_contributions: 0,
        contributions_today: 0,
        contributions_week: 0
      };

      const verifiedSymbols = symbolLocationsData?.filter(location => location.is_verified).length || 0;

      return {
        totalUsers: Number(userStatsRow.total_users),
        activeUsersLast30Days: Number(userStatsRow.active_users_30d),
        bannedUsers: Number(userStatsRow.banned_users),
        adminUsers: Number(userStatsRow.admin_users),
        newUsersToday: Number(userStatsRow.new_users_today),
        newUsersWeek: Number(userStatsRow.new_users_week),
        totalContributions: Number(contributionStatsRow.total_contributions),
        pendingContributions: Number(contributionStatsRow.pending_contributions),
        approvedContributions: Number(contributionStatsRow.approved_contributions),
        rejectedContributions: Number(contributionStatsRow.rejected_contributions),
        contributionsToday: Number(contributionStatsRow.contributions_today),
        contributionsWeek: Number(contributionStatsRow.contributions_week),
        totalSymbols: symbolsData?.length || 0,
        verifiedSymbols,
        totalSymbolLocations: symbolLocationsData?.length || 0,
        topContributors: (topContributorsData || []).map((contributor: any) => ({
          userId: contributor.user_id,
          username: contributor.username || 'Unknown',
          fullName: contributor.full_name || contributor.username || 'Unknown',
          contributionsCount: Number(contributor.contributions_count),
          pointsTotal: Number(contributor.total_points)
        })),
        contributionsOverTime
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques spécifiques aux utilisateurs
   */
  getUserStats: async (): Promise<UserManagementStats> => {
    try {
      const { data, error } = await supabase.rpc('get_user_management_stats');
      if (error) throw error;
      return data?.[0] || {
        total_users: 0,
        active_users_30d: 0,
        banned_users: 0,
        admin_users: 0,
        new_users_today: 0,
        new_users_week: 0
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques spécifiques aux contributions
   */
  getContributionStats: async (): Promise<ContributionManagementStats> => {
    try {
      const { data, error } = await supabase.rpc('get_contribution_management_stats');
      if (error) throw error;
      return data?.[0] || {
        total_contributions: 0,
        pending_contributions: 0,
        approved_contributions: 0,
        rejected_contributions: 0,
        contributions_today: 0,
        contributions_week: 0
      };
    } catch (error) {
      console.error('Error fetching contribution stats:', error);
      throw error;
    }
  }
};
