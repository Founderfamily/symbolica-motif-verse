import { supabase } from '@/integrations/supabase/client';

export interface AdminStats {
  totalUsers: number;
  activeUsersLast30Days: number;
  totalContributions: number;
  pendingContributions: number;
  totalSymbols: number;
  verifiedSymbols: number;
  totalSymbolLocations: number;
  userRegistrationsOverTime: TimeSeriesPoint[];
  contributionsOverTime: TimeSeriesPoint[];
  topContributors: TopContributor[];
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
}

export interface TopContributor {
  userId: string;
  username: string | null;
  fullName: string | null;
  contributionsCount: number;
  pointsTotal: number;
}

/**
 * Service pour récupérer les statistiques administratives
 */
export const adminStatsService = {
  /**
   * Récupère les statistiques globales pour le tableau de bord
   */
  getDashboardStats: async (): Promise<AdminStats> => {
    try {
      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (usersError) throw usersError;
      
      // Get active users in last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      // Utiliser une approche différente pour récupérer les utilisateurs actifs
      const { data: activeUsersData, error: activeUsersError } = await supabase
        .from('user_activities')
        .select('user_id')
        .gt('created_at', thirtyDaysAgo.toISOString())
        .is('user_id', 'not.null') as any;
      
      if (activeUsersError) throw activeUsersError;
      
      // Compter les utilisateurs uniques actifs
      const activeUserIds = new Set(activeUsersData.map((item: any) => item.user_id));
      const activeUsers = activeUserIds.size;
      
      // Get contributions counts
      const { data: contributionsData, error: contribError } = await supabase
        .from('user_contributions')
        .select('status')
        .in('status', ['pending', 'approved', 'rejected']);
        
      if (contribError) throw contribError;
      
      const totalContributions = contributionsData.length;
      const pendingContributions = contributionsData.filter(c => c.status === 'pending').length;
      
      // Get symbols counts
      const { count: totalSymbols, error: symbolsError } = await supabase
        .from('symbols')
        .select('*', { count: 'exact', head: true });
        
      if (symbolsError) throw symbolsError;
      
      // Get verified symbols count (this is a placeholder, adjust the query based on actual data model)
      const { count: verifiedSymbols, error: verifiedError } = await supabase
        .from('symbol_locations')
        .select('*', { count: 'exact', head: true })
        .eq('is_verified', true);
        
      if (verifiedError) throw verifiedError;
      
      // Get total symbol locations
      const { count: totalLocations, error: locationsError } = await supabase
        .from('symbol_locations')
        .select('*', { count: 'exact', head: true });
        
      if (locationsError) throw locationsError;
      
      // Get time series data for registrations
      const { data: registrationsData, error: regTimeError } = await supabase
        .from('profiles')
        .select('created_at')
        .gt('created_at', new Date(new Date().setDate(new Date().getDate() - 60)).toISOString())
        .order('created_at', { ascending: true });
        
      if (regTimeError) throw regTimeError;
      
      const userRegistrationsOverTime = processTimeSeriesData(registrationsData, 'created_at');
      
      // Get time series data for contributions
      const { data: contribTimeData, error: contribTimeError } = await supabase
        .from('user_contributions')
        .select('created_at')
        .gt('created_at', new Date(new Date().setDate(new Date().getDate() - 60)).toISOString())
        .order('created_at', { ascending: true });
        
      if (contribTimeError) throw contribTimeError;
      
      const contributionsOverTime = processTimeSeriesData(contribTimeData, 'created_at');
      
      // Get top contributors
      // Utiliser une méthode alternative pour récupérer les données des utilisateurs
      const { data: topContribData, error: topContribError } = await supabase
        .from('user_points')
        .select(`
          user_id,
          total,
          contribution_points
        `)
        .order('total', { ascending: false })
        .limit(10) as any;
        
      if (topContribError) throw topContribError;
      
      // Récupérer les informations des profils séparément
      const userIds = topContribData.map((item: any) => item.user_id);
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Créer un dictionnaire pour accéder facilement aux données de profil
      const profilesDict: Record<string, any> = {};
      profilesData.forEach((profile: any) => {
        profilesDict[profile.id] = profile;
      });
      
      // Process contribution counts by user
      const { data: contributionCounts, error: contribCountsError } = await supabase
        .from('user_contributions')
        .select('user_id, id')
        .in('user_id', topContribData.map(c => c.user_id));
        
      if (contribCountsError) throw contribCountsError;
      
      // Process contribution counts by user
      const contributionsByUser: Record<string, number> = {};
      contributionCounts.forEach(item => {
        contributionsByUser[item.user_id] = (contributionsByUser[item.user_id] || 0) + 1;
      });
      
      const topContributors = topContribData.map((contributor: any) => {
        const profile = profilesDict[contributor.user_id] || {};
        return {
          userId: contributor.user_id,
          username: profile.username,
          fullName: profile.full_name,
          contributionsCount: contributionsByUser[contributor.user_id] || 0,
          pointsTotal: contributor.total
        };
      });
      
      return {
        totalUsers: totalUsers || 0,
        activeUsersLast30Days: activeUsers || 0,
        totalContributions,
        pendingContributions,
        totalSymbols: totalSymbols || 0,
        verifiedSymbols: verifiedSymbols || 0,
        totalSymbolLocations: totalLocations || 0,
        userRegistrationsOverTime,
        contributionsOverTime,
        topContributors
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Return default values in case of error
      return {
        totalUsers: 0,
        activeUsersLast30Days: 0,
        totalContributions: 0,
        pendingContributions: 0,
        totalSymbols: 0,
        verifiedSymbols: 0,
        totalSymbolLocations: 0,
        userRegistrationsOverTime: [],
        contributionsOverTime: [],
        topContributors: []
      };
    }
  }
};

/**
 * Helper function to process time series data and group it by day
 */
function processTimeSeriesData(data: any[], dateField: string): TimeSeriesPoint[] {
  const groupedByDay: Record<string, number> = {};
  
  // Group entries by day
  data.forEach(item => {
    const date = new Date(item[dateField]);
    const dayStr = date.toISOString().split('T')[0];
    groupedByDay[dayStr] = (groupedByDay[dayStr] || 0) + 1;
  });
  
  // Fill in missing days in the last 60 days
  const result: TimeSeriesPoint[] = [];
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - 60);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split('T')[0];
    result.push({
      date: dayStr,
      count: groupedByDay[dayStr] || 0
    });
  }
  
  return result;
}
