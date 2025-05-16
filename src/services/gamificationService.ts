
import { supabase } from '@/integrations/supabase/client';
import { 
  Achievement, 
  UserAchievement, 
  UserPoints, 
  UserActivity,
  UserBadge,
  UserLevel,
  AchievementType
} from '@/types/gamification';
import { toast } from '@/components/ui/use-toast';

export const gamificationService = {
  /**
   * Get all achievements
   */
  getAchievements: async (): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: false });
        
      if (error) throw error;
      return data as Achievement[];
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }
  },
  
  /**
   * Get achievements by type
   */
  getAchievementsByType: async (type: AchievementType): Promise<Achievement[]> => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('type', type)
        .order('points', { ascending: false });
        
      if (error) throw error;
      return data as Achievement[];
    } catch (error) {
      console.error(`Error fetching ${type} achievements:`, error);
      return [];
    }
  },
  
  /**
   * Get user achievements
   */
  getUserAchievements: async (userId: string): Promise<UserAchievement[]> => {
    try {
      console.log("Fetching achievements for user:", userId);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievement_id(*)
        `)
        .eq('user_id', userId);
        
      if (error) throw error;
      return data as unknown as UserAchievement[];
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      return [];
    }
  },
  
  /**
   * Get user points
   */
  getUserPoints: async (userId: string): Promise<UserPoints | null> => {
    try {
      console.log("Fetching points for user:", userId);
      const { data, error } = await supabase
        .from('user_points')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned" 
        // We only want to throw on other errors
        throw error;
      }
      
      return data as UserPoints || null;
    } catch (error) {
      console.error("Error fetching user points:", error);
      return null;
    }
  },
  
  /**
   * Get user level
   */
  getUserLevel: async (userId: string): Promise<UserLevel | null> => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data as UserLevel || null;
    } catch (error) {
      console.error("Error fetching user level:", error);
      return null;
    }
  },
  
  /**
   * Get user activities (recent activity feed)
   */
  getUserActivities: async (userId: string, limit = 10): Promise<UserActivity[]> => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data as UserActivity[];
    } catch (error) {
      console.error("Error fetching user activities:", error);
      return [];
    }
  },
  
  /**
   * Get user badges
   */
  getUserBadges: async (userId: string): Promise<UserBadge[]> => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });
        
      if (error) throw error;
      return data as UserBadge[];
    } catch (error) {
      console.error("Error fetching user badges:", error);
      return [];
    }
  },
  
  /**
   * Get top users by points (leaderboard)
   */
  getLeaderboard: async (limit = 10): Promise<{
    id: string;
    username: string;
    avatar?: string;
    points: number;
    rank: number;
  }[]> => {
    try {
      const { data, error } = await supabase
        .from('user_points')
        .select(`
          id, 
          user_id,
          total,
          profiles:user_id(username)
        `)
        .order('total', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      // Transform the data to match the expected format
      return data.map((item: any, index: number) => ({
        id: item.user_id,
        username: item.profiles?.username || `User ${item.user_id.substring(0, 5)}`,
        points: item.total,
        rank: index + 1
      }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return [];
    }
  },
  
  /**
   * Award points to a user (manual method for cases not handled by triggers)
   */
  awardPoints: async (userId: string, type: AchievementType, amount: number, entityId?: string, details?: any): Promise<boolean> => {
    try {
      console.log(`Awarding ${amount} ${type} points to user ${userId}`);
      
      // Start a transaction
      const { error: activityError } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: type,
          entity_id: entityId,
          points_earned: amount,
          details
        });
        
      if (activityError) throw activityError;
      
      // Update points - use upsert in case the user doesn't have a record yet
      const pointsField = `${type}_points`;
      const { error: pointsError } = await supabase
        .from('user_points')
        .upsert({
          user_id: userId,
          total: amount,
          [pointsField]: amount
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });
        
      if (pointsError) throw pointsError;
      
      // Update user level/xp - use upsert in case the user doesn't have a record yet
      const { error: levelError } = await supabase
        .from('user_levels')
        .upsert({
          user_id: userId,
          xp: amount
        }, {
          onConflict: 'user_id', 
          ignoreDuplicates: false
        });
        
      if (levelError) throw levelError;
      
      toast({
        title: "Points awarded!",
        description: `You earned ${amount} points for ${type}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error awarding points:", error);
      return false;
    }
  },
  
  /**
   * Update achievement progress
   */
  updateAchievementProgress: async (userId: string, achievementId: string, progress: number): Promise<boolean> => {
    try {
      const { data: achievement, error: achievementError } = await supabase
        .from('achievements')
        .select('*')
        .eq('id', achievementId)
        .single();
        
      if (achievementError) throw achievementError;
      
      const completed = progress >= achievement.requirement;
      
      // Use upsert to handle cases where the user achievement record doesn't exist yet
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: userId,
          achievement_id: achievementId,
          progress,
          completed,
          earned_at: completed ? new Date().toISOString() : null
        }, {
          onConflict: 'user_id,achievement_id',
          ignoreDuplicates: false
        });
        
      if (error) throw error;
      
      // If this completed the achievement, award the points
      if (completed) {
        await gamificationService.awardPoints(
          userId, 
          achievement.type as AchievementType, 
          achievement.points, 
          achievement.id, 
          { achievement: achievement.name }
        );
        
        // Show a toast notification
        toast({
          title: "Achievement unlocked!",
          description: achievement.name,
          variant: "default",
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating achievement progress:", error);
      return false;
    }
  }
};
