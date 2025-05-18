import { supabase } from '@/integrations/supabase/client';

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
      const pointsField = `${activityType}_points` as keyof typeof initialPoints;
      
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
  }
};
