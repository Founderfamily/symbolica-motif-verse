
import { supabase } from '@/integrations/supabase/client';
import { Achievement, UserAchievement, AchievementType, AchievementLevel } from '@/types/gamification';
import { Database } from '@/integrations/supabase/types';

type Json = Database['public']['Tables']['achievements']['Row']['translations'];

/**
 * Service for achievement-related gamification operations
 */
export const achievementService = {
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
      
      // Cast the database string values to our enum types and properly type the translations
      return (data || []).map(achievement => ({
        ...achievement,
        type: achievement.type as AchievementType,
        level: achievement.level as AchievementLevel,
        translations: (achievement.translations as any || {}) as { [language: string]: { name: string; description: string } }
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
      
      // Transform the data to match our types, casting string values to enums and properly casting translations
      return (data || []).map(ua => ({
        ...ua,
        achievement: ua.achievement ? {
          ...ua.achievement,
          type: ua.achievement.type as AchievementType,
          level: ua.achievement.level as AchievementLevel,
          translations: (ua.achievement.translations as any || {}) as { [language: string]: { name: string; description: string } }
        } : undefined
      }));
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }
  }
};
