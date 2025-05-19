
import { supabase } from '@/integrations/supabase/client';
import { UserAchievement, Achievement, UserPoints, UserActivity, UserLevel, AchievementType, AchievementLevel } from '@/types/gamification';

/**
 * Service for gamification-related operations, such as awarding points
 */
export const gamificationService = {
  /**
   * Award points to a user for a specific activity
   */
  awardPoints: async (
    userId: string,
    activityType: string,
    points: number,
    entityId?: string,
    details?: Record<string, any>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          points_earned: points,
          entity_id: entityId || null,
          details: details || {}
        });

      if (error) throw error;
      
      // Update user points
      const pointsField = `${activityType}_points` as keyof typeof initialPointsTemplate;
      
      // Get current points
      const { data: currentPoints, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (pointsError && pointsError.code !== 'PGRST116') {
        throw pointsError;
      }
      
      if (!currentPoints) {
        // Create new points record with initial values
        const initialPoints = {
          user_id: userId,
          total: points,
          contribution_points: 0,
          exploration_points: 0,
          validation_points: 0,
          community_points: 0,
        };
        
        initialPoints[pointsField] = points;
        
        const { error: insertError } = await supabase
          .from('user_points')
          .insert(initialPoints);
          
        if (insertError) throw insertError;
      } else {
        // Update existing points record
        const updateData = {
          total: currentPoints.total + points,
          [pointsField]: currentPoints[pointsField] + points,
          updated_at: new Date().toISOString()
        };
        
        const { error: updateError } = await supabase
          .from('user_points')
          .update(updateData)
          .eq('id', currentPoints.id);
          
        if (updateError) throw updateError;
      }

      return true;
    } catch (error) {
      console.error("Error awarding points:", error);
      return false;
    }
  },
  
  /**
   * Get all available achievements
   */
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement', { ascending: true });
        
      if (error) throw error;
      
      // Cast the database string values to our enum types
      return (data || []).map(achievement => ({
        ...achievement,
        type: achievement.type as AchievementType,
        level: achievement.level as AchievementLevel
      }));
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  },
  
  /**
   * Get achievements for a specific user
   */
  getUserAchievements: async (userId: string): Promise<UserAchievement[]> => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*, achievement:achievement_id(*)')
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Transform the data to match our types, casting string values to enums
      return (data || []).map(ua => ({
        ...ua,
        achievement: ua.achievement ? {
          ...ua.achievement,
          type: ua.achievement.type as AchievementType,
          level: ua.achievement.level as AchievementLevel
        } : undefined
      }));
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }
  },
  
  /**
   * Get points for a specific user
   */
  getUserPoints: async (userId: string): Promise<UserPoints | null> => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user points:", error);
      return null;
    }
  },
  
  /**
   * Get level information for a specific user
   */
  getUserLevel: async (userId: string): Promise<UserLevel | null> => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user level:", error);
      return null;
    }
  },
  
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
  },
  
  /**
   * Get leaderboard with top users by total points
   */
  getLeaderboard: async (limit: number = 10): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select('*, profiles:user_id(*)')
        .order('total', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  }
};

// Template for initial points when creating a new user_points record
const initialPointsTemplate = {
  total: 0,
  contribution_points: 0,
  exploration_points: 0,
  validation_points: 0,
  community_points: 0,
};
