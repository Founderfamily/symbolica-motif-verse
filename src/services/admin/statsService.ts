
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
      console.log('Fetching dashboard stats...');
      
      // Récupérer les statistiques des utilisateurs
      console.log('Calling get_user_management_stats...');
      const { data: userStats, error: userError } = await supabase
        .rpc('get_user_management_stats');
      
      if (userError) {
        console.error('Error fetching user stats:', userError);
        throw userError;
      }
      console.log('User stats result:', userStats);

      // Récupérer les statistiques des contributions
      console.log('Calling get_contribution_management_stats...');
      const { data: contributionStats, error: contributionError } = await supabase
        .rpc('get_contribution_management_stats');
      
      if (contributionError) {
        console.error('Error fetching contribution stats:', contributionError);
        throw contributionError;
      }
      console.log('Contribution stats result:', contributionStats);

      // Récupérer les statistiques des symboles
      console.log('Fetching symbols...');
      const { data: symbolsData, error: symbolsError } = await supabase
        .from('symbols')
        .select('id');
      
      if (symbolsError) {
        console.error('Error fetching symbols:', symbolsError);
        throw symbolsError;
      }
      console.log('Symbols count:', symbolsData?.length || 0);

      // Récupérer les statistiques des emplacements de symboles
      console.log('Fetching symbol locations...');
      const { data: symbolLocationsData, error: symbolLocationsError } = await supabase
        .from('symbol_locations')
        .select('id, is_verified');
      
      if (symbolLocationsError) {
        console.error('Error fetching symbol locations:', symbolLocationsError);
        throw symbolLocationsError;
      }
      console.log('Symbol locations count:', symbolLocationsData?.length || 0);

      // Récupérer les top contributeurs
      console.log('Calling get_top_contributors...');
      const { data: topContributorsData, error: topContributorsError } = await supabase
        .rpc('get_top_contributors', { p_limit: 10 });
      
      if (topContributorsError) {
        console.error('Error fetching top contributors:', topContributorsError);
        throw topContributorsError;
      }
      console.log('Top contributors result:', topContributorsData);

      // Récupérer les contributions au fil du temps (30 derniers jours)
      console.log('Fetching contributions over time...');
      const { data: contributionsOverTimeData, error: contributionsOverTimeError } = await supabase
        .from('user_contributions')
        .select('created_at')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: true });
      
      if (contributionsOverTimeError) {
        console.error('Error fetching contributions over time:', contributionsOverTimeError);
        throw contributionsOverTimeError;
      }
      console.log('Contributions over time count:', contributionsOverTimeData?.length || 0);

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

      // Utiliser des valeurs par défaut sûres
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

      const result: AdminStats = {
        totalUsers: Number(userStatsRow.total_users) || 0,
        activeUsersLast30Days: Number(userStatsRow.active_users_30d) || 0,
        bannedUsers: Number(userStatsRow.banned_users) || 0,
        adminUsers: Number(userStatsRow.admin_users) || 0,
        newUsersToday: Number(userStatsRow.new_users_today) || 0,
        newUsersWeek: Number(userStatsRow.new_users_week) || 0,
        totalContributions: Number(contributionStatsRow.total_contributions) || 0,
        pendingContributions: Number(contributionStatsRow.pending_contributions) || 0,
        approvedContributions: Number(contributionStatsRow.approved_contributions) || 0,
        rejectedContributions: Number(contributionStatsRow.rejected_contributions) || 0,
        contributionsToday: Number(contributionStatsRow.contributions_today) || 0,
        contributionsWeek: Number(contributionStatsRow.contributions_week) || 0,
        totalSymbols: symbolsData?.length || 0,
        verifiedSymbols,
        totalSymbolLocations: symbolLocationsData?.length || 0,
        topContributors: (topContributorsData || []).map((contributor: any) => ({
          userId: contributor.user_id,
          username: contributor.username || 'Unknown',
          fullName: contributor.full_name || contributor.username || 'Unknown',
          contributionsCount: Number(contributor.contributions_count) || 0,
          pointsTotal: Number(contributor.total_points) || 0
        })),
        contributionsOverTime
      };

      console.log('Final dashboard stats:', result);
      return result;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Retourner des données par défaut en cas d'erreur
      return {
        totalUsers: 0,
        activeUsersLast30Days: 0,
        bannedUsers: 0,
        adminUsers: 0,
        newUsersToday: 0,
        newUsersWeek: 0,
        totalContributions: 0,
        pendingContributions: 0,
        approvedContributions: 0,
        rejectedContributions: 0,
        contributionsToday: 0,
        contributionsWeek: 0,
        totalSymbols: 0,
        verifiedSymbols: 0,
        totalSymbolLocations: 0,
        topContributors: [],
        contributionsOverTime: []
      };
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
      return {
        total_users: 0,
        active_users_30d: 0,
        banned_users: 0,
        admin_users: 0,
        new_users_today: 0,
        new_users_week: 0
      };
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
      return {
        total_contributions: 0,
        pending_contributions: 0,
        approved_contributions: 0,
        rejected_contributions: 0,
        contributions_today: 0,
        contributions_week: 0
      };
    }
  }
};
