
import { supabase } from '@/integrations/supabase/client';
import { UserBadge } from '@/types/gamification';

/**
 * Service for badge-related gamification operations
 */
export const badgeService = {
  /**
   * Get badges for a specific user
   */
  getUserBadges: async (userId: string): Promise<UserBadge[]> => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('awarded_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching user badges:", error);
      return [];
    }
  },
  
  /**
   * Award a badge to a user
   */
  awardBadge: async (
    userId: string,
    badgeType: string,
    badgeName: string
  ): Promise<boolean> => {
    try {
      // Check if user already has this badge
      const { data: existingBadge, error: checkError } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_name', badgeName)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      
      // Don't award duplicate badges
      if (existingBadge) {
        console.log(`User ${userId} already has badge: ${badgeName}`);
        return false;
      }
      
      // Award the badge
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          badge_name: badgeName
        });
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error awarding badge:", error);
      return false;
    }
  },
  
  /**
   * Get available badge types
   */
  getBadgeTypes: async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('badge_type')
        .distinct();
        
      if (error) throw error;
      
      return (data || []).map(item => item.badge_type).filter(Boolean);
    } catch (error) {
      console.error("Error fetching badge types:", error);
      return [];
    }
  }
};
