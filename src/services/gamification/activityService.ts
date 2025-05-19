
import { supabase } from '@/integrations/supabase/client';
import { UserActivity } from '@/types/gamification';

/**
 * Service for activity-related gamification operations
 */
export const activityService = {
  /**
   * Get recent activities for a specific user
   */
  getUserActivities: async (userId: string, limit: number = 10): Promise<UserActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return [];
    }
  }
};
