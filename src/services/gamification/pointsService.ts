
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
      // Create activity record with more detailed tracking
      const { error: activityError, data: activityData } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activityType,
          points_earned: points,
          entity_id: entityId || null,
          details: details || {}
        })
        .select()
        .single();

      if (activityError) throw activityError;
      
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
      
      let updatedPoints: UserPoints;
      
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
        
        const { data: insertData, error: insertError } = await supabase
          .from('user_points')
          .insert(initialPoints)
          .select()
          .single();
          
        if (insertError) throw insertError;
        updatedPoints = insertData;
      } else {
        // Update existing points record
        const updateData = {
          total: currentPoints.total + points,
          [pointsField]: currentPoints[pointsField] + points,
          updated_at: new Date().toISOString()
        };
        
        const { data: updatedData, error: updateError } = await supabase
          .from('user_points')
          .update(updateData)
          .eq('id', currentPoints.id)
          .select()
          .single();
          
        if (updateError) throw updateError;
        updatedPoints = updatedData;
      }

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
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          user_levels:user_id (
            level
          )
        `)
        .order('total', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      // Format data for easier consumption
      return (data || []).map(item => ({
        userId: item.user_id,
        username: item.profiles?.username,
        fullName: item.profiles?.full_name,
        avatarUrl: item.profiles?.avatar_url,
        level: item.user_levels?.level || 1,
        totalPoints: item.total,
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

// Template for initial points when creating a new user_points record
const initialPointsTemplate = {
  total: 0,
  contribution_points: 0,
  exploration_points: 0,
  validation_points: 0,
  community_points: 0,
};
