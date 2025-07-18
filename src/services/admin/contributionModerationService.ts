import { supabase } from '@/integrations/supabase/client';

export interface ContributionForModeration {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string;
  created_at: string;
  updated_at: string;
  reviewed_by: string | null;
  reviewed_at: string | null;
  cultural_context: string | null;
  period: string | null;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  user_profile: {
    username: string | null;
    full_name: string | null;
  } | null;
}

/**
 * Service pour la modération des contributions
 */
export const contributionModerationService = {
  /**
   * Récupère les contributions en attente de modération
   */
  getPendingContributions: async (): Promise<ContributionForModeration[]> => {
    try {
      const { data, error } = await supabase
        .from('user_contributions')
        .select(`
          *,
          user_profile:profiles!inner(username, full_name)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected',
        user_profile: Array.isArray(item.user_profile) ? item.user_profile[0] : item.user_profile
      }));
    } catch (error) {
      console.error('Error fetching pending contributions:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les contributions avec filtres
   */
  getAllContributions: async (status?: string): Promise<ContributionForModeration[]> => {
    try {
      let query = supabase
        .from('user_contributions')
        .select(`
          *,
          user_profile:profiles!inner(username, full_name)
        `)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected',
        user_profile: Array.isArray(item.user_profile) ? item.user_profile[0] : item.user_profile
      }));
    } catch (error) {
      console.error('Error fetching contributions:', error);
      throw error;
    }
  },

  /**
   * Modère une contribution (approve, reject, ou remet en pending)
   */
  moderateContribution: async (
    contributionId: string, 
    status: 'approved' | 'rejected' | 'pending', 
    reason?: string
  ): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('moderate_contribution', {
        p_contribution_id: contributionId,
        p_admin_id: user.id,
        p_status: status,
        p_reason: reason || null
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error moderating contribution:', error);
      throw error;
    }
  },

  /**
   * Supprime une contribution
   */
  deleteContribution: async (contributionId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Logger l'action avant la suppression
      await supabase.rpc('insert_admin_log', {
        p_admin_id: user.id,
        p_action: 'delete_contribution',
        p_entity_type: 'contribution',
        p_entity_id: contributionId,
        p_details: { reason: 'Deleted by admin' }
      });

      const { error } = await supabase
        .from('user_contributions')
        .delete()
        .eq('id', contributionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting contribution:', error);
      throw error;
    }
  }
};
