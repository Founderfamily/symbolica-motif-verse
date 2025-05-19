
import { supabase } from '@/integrations/supabase/client';
import { UserLevel } from '@/types/gamification';

/**
 * Service for level-related gamification operations
 */
export const levelService = {
  /**
   * Get level information for a specific user
   */
  getUserLevel: async (userId: string): Promise<UserLevel | null> => {
    try {
      const { data, error } = await supabase
        .from('user_levels')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error("Error fetching user level:", error);
      return null;
    }
  }
};
