
import { supabase } from '@/integrations/supabase/client';
import { UserLevel } from '@/types/gamification';

/**
 * Service for level-related gamification operations
 */
export const levelService = {
  /**
   * Get the level information for a user
   */
  getUserLevel: async (userId: string): Promise<UserLevel | null> => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      // Initialize user level if not exists
      if (!data) {
        const newLevel = await levelService.initializeUserLevel(userId);
        return newLevel;
      }
      
      return data;
    } catch (error) {
      console.error("Error fetching user level:", error);
      return null;
    }
  },
  
  /**
   * Initialize a new user level record
   */
  initializeUserLevel: async (userId: string): Promise<UserLevel | null> => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .insert({
          user_id: userId,
          level: 1,
          xp: 0,
          next_level_xp: 100
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error initializing user level:", error);
      return null;
    }
  },
  
  /**
   * Update a user's level based on earned XP
   */
  updateUserLevel: async (userId: string, earnedXp: number): Promise<UserLevel | null> => {
    try {
      // Get current level data
      const { data: userData, error: userError } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (userError && userError.code !== 'PGRST116') throw userError;
      
      // Initialize level if not exists
      if (!userData) {
        const initialLevel = await levelService.initializeUserLevel(userId);
        if (!initialLevel) return null;
        
        // Apply XP to new level
        return await levelService.applyXpToLevel(initialLevel, earnedXp);
      }
      
      // Apply XP to existing level
      return await levelService.applyXpToLevel(userData, earnedXp);
    } catch (error) {
      console.error("Error updating user level:", error);
      return null;
    }
  },
  
  /**
   * Apply earned XP to a level and handle level ups
   */
  applyXpToLevel: async (levelData: UserLevel, earnedXp: number): Promise<UserLevel | null> => {
    try {
      let currentLevel = levelData.level;
      let currentXp = levelData.xp + earnedXp;
      let currentNextLevelXp = levelData.next_level_xp;
      let leveledUp = false;
      
      // Check for level ups
      while (currentXp >= currentNextLevelXp) {
        // Level up!
        currentLevel += 1;
        currentXp -= currentNextLevelXp;
        // Calculate next level XP requirement
        currentNextLevelXp = levelService.calculateNextLevelXp(currentLevel);
        leveledUp = true;
      }
      
      // Update level data
      const { data, error } = await supabase
        .from('user_levels')
        .update({
          level: currentLevel,
          xp: currentXp,
          next_level_xp: currentNextLevelXp,
          updated_at: new Date().toISOString()
        })
        .eq('id', levelData.id)
        .select()
        .single();
        
      if (error) throw error;
      
      // If user leveled up, create an activity entry
      if (leveledUp) {
        await supabase
          .from('user_activities')
          .insert({
            user_id: levelData.user_id,
            activity_type: 'level_up',
            points_earned: 0,
            details: {
              new_level: currentLevel,
              previous_level: levelData.level
            }
          });
          
        // Award a badge for reaching certain level milestones
        await levelService.checkLevelBadges(levelData.user_id, currentLevel);
      }
      
      return data;
    } catch (error) {
      console.error("Error applying XP to level:", error);
      return null;
    }
  },
  
  /**
   * Calculate XP required for the next level
   */
  calculateNextLevelXp: (level: number): number => {
    // Exponential leveling formula: each level requires 20% more XP than the previous level
    const baseXp = 100;
    return Math.round(baseXp * Math.pow(1.2, level - 1));
  },
  
  /**
   * Check and award level-based badges
   */
  checkLevelBadges: async (userId: string, level: number): Promise<void> => {
    try {
      // Badge thresholds at specific levels
      const badgeThresholds = [
        { level: 5, name: "Novice Explorer", type: "level_milestone" },
        { level: 10, name: "Apprentice Scholar", type: "level_milestone" },
        { level: 25, name: "Journey Master", type: "level_milestone" },
        { level: 50, name: "Symbol Sage", type: "level_milestone" },
        { level: 100, name: "Cultural Guardian", type: "level_milestone" }
      ];
      
      // Find eligible badge(s)
      const eligibleBadges = badgeThresholds.filter(badge => badge.level === level);
      
      for (const badge of eligibleBadges) {
        // Check if user already has this badge
        const { data, error } = await supabase
          .from('user_badges')
          .select('*')
          .eq('user_id', userId)
          .eq('badge_name', badge.name)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error checking for existing badge:", error);
          continue;
        }
        
        // Award the badge if not already awarded
        if (!data) {
          await supabase
            .from('user_badges')
            .insert({
              user_id: userId,
              badge_type: badge.type,
              badge_name: badge.name
            });
        }
      }
    } catch (error) {
      console.error("Error checking level badges:", error);
    }
  }
};
