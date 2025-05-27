
import { supabase } from '@/integrations/supabase/client';
import { UserBadge } from '@/types/gamification';

/**
 * Service for badge-related operations
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
  ): Promise<UserBadge | null> => {
    try {
      // Check if user already has this badge
      const { data: existingBadge } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('badge_type', badgeType)
        .eq('badge_name', badgeName)
        .single();
        
      if (existingBadge) {
        return existingBadge;
      }
      
      const { data, error } = await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
          badge_name: badgeName
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error awarding badge:", error);
      return null;
    }
  },
  
  /**
   * Get all available badge types
   */
  getBadgeTypes: () => {
    return [
      {
        type: 'achievement_contribution',
        name: 'Contributor',
        description: 'For making valuable contributions',
        color: 'green'
      },
      {
        type: 'achievement_exploration',
        name: 'Explorer',
        description: 'For discovering and exploring symbols',
        color: 'blue'
      },
      {
        type: 'achievement_validation',
        name: 'Validator',
        description: 'For helping validate contributions',
        color: 'purple'
      },
      {
        type: 'achievement_community',
        name: 'Community Builder',
        description: 'For active community participation',
        color: 'pink'
      },
      {
        type: 'level_milestone',
        name: 'Level Master',
        description: 'For reaching level milestones',
        color: 'amber'
      }
    ];
  }
};
