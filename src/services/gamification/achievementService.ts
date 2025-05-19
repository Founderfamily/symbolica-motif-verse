
import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement } from '@/types/gamification';

/**
 * Service pour gérer les réalisations (achievements)
 */
export const achievementService = {
  /**
   * Récupère toutes les réalisations disponibles
   */
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('level', { ascending: true })
        .order('requirement', { ascending: true });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  },
  
  /**
   * Récupère les réalisations d'un utilisateur
   */
  getUserAchievements: async (userId: string): Promise<UserAchievement[]> => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievement_id (*)
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }
  },
  
  /**
   * Vérifie si l'utilisateur a accompli de nouvelles réalisations
   */
  checkAchievements: async (userId: string): Promise<Achievement[]> => {
    try {
      // Fetch user's points and activities
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (pointsError && pointsError.code !== 'PGRST116') throw pointsError;
      
      // If user has no points record, they can't have achievements
      if (!pointsData) return [];
      
      // Fetch user's achievements and all available achievements
      const [userAchievements, allAchievements] = await Promise.all([
        achievementService.getUserAchievements(userId),
        achievementService.getAchievements()
      ]);
      
      // Map of existing user achievements by achievement ID
      const existingAchievements = new Map(
        userAchievements.map(ua => [ua.achievement_id, ua])
      );
      
      // Get counts for different activities
      const [contributionCount, explorationCount] = await Promise.all([
        achievementService.getActivityCount(userId, 'contribution'),
        achievementService.getActivityCount(userId, 'exploration')
      ]);
      
      // List to track newly earned achievements
      const newlyEarned: Achievement[] = [];
      
      // Check each achievement to see if it's been earned
      for (const achievement of allAchievements) {
        // Skip if already completed
        if (existingAchievements.has(achievement.id) && 
            existingAchievements.get(achievement.id)!.completed) {
          continue;
        }
        
        let progress = 0;
        let completed = false;
        
        // Calculate progress based on achievement type
        switch (achievement.type) {
          case 'contribution':
            progress = contributionCount;
            completed = progress >= achievement.requirement;
            break;
          case 'exploration':
            progress = explorationCount;
            completed = progress >= achievement.requirement;
            break;
          case 'validation':
            // Calculate validation progress (to be implemented)
            break;
          case 'community':
            // Calculate community progress (to be implemented)
            break;
        }
        
        // Update or create achievement progress
        if (existingAchievements.has(achievement.id)) {
          // Update existing achievement
          const userAchievement = existingAchievements.get(achievement.id)!;
          
          if (progress > userAchievement.progress || completed) {
            const { error } = await supabase
              .from('user_achievements')
              .update({
                progress,
                completed,
                earned_at: completed ? new Date().toISOString() : null,
                updated_at: new Date().toISOString()
              })
              .eq('id', userAchievement.id);
              
            if (error) throw error;
            
            // If newly completed, add to the earned list
            if (completed && !userAchievement.completed) {
              newlyEarned.push(achievement);
              
              // Award achievement points
              await achievementService.awardAchievementPoints(userId, achievement);
            }
          }
        } else {
          // Create new achievement progress entry
          const { error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: achievement.id,
              progress,
              completed,
              earned_at: completed ? new Date().toISOString() : null
            });
            
          if (error) throw error;
          
          // If completed on first check, add to earned list
          if (completed) {
            newlyEarned.push(achievement);
            
            // Award achievement points
            await achievementService.awardAchievementPoints(userId, achievement);
          }
        }
      }
      
      return newlyEarned;
    } catch (error) {
      console.error("Error checking achievements:", error);
      return [];
    }
  },
  
  /**
   * Awards points for earning an achievement
   */
  awardAchievementPoints: async (userId: string, achievement: Achievement): Promise<void> => {
    try {
      // Create activity record
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: 'achievement',
          points_earned: achievement.points,
          details: {
            achievement_name: achievement.name,
            achievement_type: achievement.type,
            achievement_level: achievement.level
          }
        });
        
      if (activityError) throw activityError;
      
      // Update user points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (pointsError && pointsError.code !== 'PGRST116') throw pointsError;
      
      if (pointsData) {
        // Update existing points
        const { error: updateError } = await supabase
          .from('user_points')
          .update({
            total: pointsData.total + achievement.points,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
          
        if (updateError) throw updateError;
      } else {
        // Create new points record
        const { error: insertError } = await supabase
          .from('user_points')
          .insert({
            user_id: userId,
            total: achievement.points
          });
          
        if (insertError) throw insertError;
      }
      
      // Create badge for the achievement
      await achievementService.createAchievementBadge(userId, achievement);
      
    } catch (error) {
      console.error("Error awarding achievement points:", error);
    }
  },
  
  /**
   * Creates a badge for an earned achievement
   */
  createAchievementBadge: async (userId: string, achievement: Achievement): Promise<void> => {
    try {
      const badgeType = `achievement_${achievement.type}`;
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          badge_name: achievement.name
        });
        
      if (error) throw error;
    } catch (error) {
      console.error("Error creating achievement badge:", error);
    }
  },
  
  /**
   * Gets count of activities by type for a user
   */
  getActivityCount: async (userId: string, activityType: string): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('activity_type', activityType);
        
      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error(`Error counting ${activityType} activities:`, error);
      return 0;
    }
  }
};
