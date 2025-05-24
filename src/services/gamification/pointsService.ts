
import { supabase } from '@/integrations/supabase/client';
import { UserPoints } from '@/types/gamification';
import { achievementService } from './achievementService';
import { levelService } from './levelService';

/**
 * Service for points-related gamification operations
 */
export const pointsService = {
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
      // Use RPC function for awarding points
      const { error } = await supabase
        .rpc('award_user_points', {
          p_user_id: userId,
          p_activity_type: activityType,
          p_points: points,
          p_entity_id: entityId || null,
          p_details: details || {}
        });

      if (error) throw error;

      // Update user level based on new points
      await levelService.updateUserLevel(userId, points);
      
      // Check if user has earned any new achievements
      const newAchievements = await achievementService.checkAchievements(userId);
      
      // If achievements were earned, notify (implementation depends on your app's notification system)
      if (newAchievements.length > 0) {
        console.log(`User ${userId} earned ${newAchievements.length} new achievements`);
        // Could implement notifications here
      }

      return true;
    } catch (error) {
      console.error("Error awarding points:", error);
      return false;
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
   * Get leaderboard with top users by total points
   */
  getLeaderboard: async (limit: number = 10): Promise<any[]> => {
    try {
      // Use RPC function for leaderboard
      const { data, error } = await supabase
        .rpc('get_leaderboard', { p_limit: limit });
        
      if (error) throw error;
      
      // Format data for easier consumption
      return (data || []).map((item: any) => ({
        userId: item.user_id,
        username: item.username,
        fullName: item.full_name,
        avatarUrl: item.avatar_url,
        level: item.level || 1,
        totalPoints: item.total_points,
        contributionPoints: item.contribution_points,
        explorationPoints: item.exploration_points,
        validationPoints: item.validation_points,
        communityPoints: item.community_points,
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  }
};
