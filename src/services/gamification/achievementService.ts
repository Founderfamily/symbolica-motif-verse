
import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement, AchievementType, AchievementLevel } from '@/types/gamification';

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
      
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        icon: item.icon,
        points: item.points,
        type: item.type as AchievementType,
        level: item.level as AchievementLevel,
        requirement: item.requirement,
        created_at: item.created_at,
        updated_at: item.updated_at,
        translations: item.translations
      }));
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
          achievements (*)
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        achievement_id: item.achievement_id,
        progress: item.progress,
        completed: item.completed,
        earned_at: item.earned_at,
        created_at: item.created_at,
        updated_at: item.updated_at,
        achievement: item.achievements ? {
          id: item.achievements.id,
          name: item.achievements.name,
          description: item.achievements.description,
          icon: item.achievements.icon,
          points: item.achievements.points,
          type: item.achievements.type as AchievementType,
          level: item.achievements.level as AchievementLevel,
          requirement: item.achievements.requirement,
          created_at: item.achievements.created_at,
          updated_at: item.achievements.updated_at,
          translations: item.achievements.translations
        } : undefined
      }));
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
      // Use RPC function for complex achievement checking
      const { data, error } = await supabase
        .rpc('check_user_achievements', { p_user_id: userId });
        
      if (error) throw error;
      
      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        icon: item.icon,
        points: item.points,
        type: item.type as AchievementType,
        level: item.level as AchievementLevel,
        requirement: item.requirement,
        created_at: item.created_at,
        updated_at: item.updated_at,
        translations: item.translations
      }));
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
      // Use RPC function for awarding achievement points
      const { error } = await supabase
        .rpc('award_achievement_points', {
          p_user_id: userId,
          p_achievement_id: achievement.id,
          p_points: achievement.points
        });
        
      if (error) throw error;
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
