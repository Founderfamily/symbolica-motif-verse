
import { supabase } from '@/integrations/supabase/client';
import { UserPoints } from '@/types/gamification';

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
