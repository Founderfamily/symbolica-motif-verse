

import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export interface UserFilters {
  search?: string;
  roleFilter?: 'all' | 'admin' | 'banned' | 'user';
  limit?: number;
  offset?: number;
}

/**
 * Service pour la gestion des utilisateurs par les admins
 */
export const userManagementService = {
  /**
   * Récupère la liste des utilisateurs avec filtres et pagination
   */
  getUsers: async (filters: UserFilters = {}): Promise<UserProfile[]> => {
    try {
      const { 
        search = null, 
        roleFilter = null, 
        limit = 50, 
        offset = 0 
      } = filters;

      const { data, error } = await supabase.rpc('get_users_for_admin', {
        p_search: search,
        p_role_filter: roleFilter === 'all' ? null : roleFilter,
        p_limit: limit,
        p_offset: offset
      });

      if (error) throw error;
      
      return (data || []).map((user: any) => ({
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        is_admin: user.is_admin || false,
        is_banned: user.is_banned || false,
        created_at: user.created_at,
        last_activity: user.last_activity,
        contributions_count: Number(user.contributions_count),
        total_points: Number(user.total_points)
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  /**
   * Bannit ou débannit un utilisateur
   */
  toggleUserBan: async (userId: string, banned: boolean): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('toggle_user_ban', {
        p_user_id: userId,
        p_admin_id: user.id,
        p_banned: banned
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling user ban:', error);
      throw error;
    }
  },

  /**
   * Modifie le statut admin d'un utilisateur
   */
  toggleUserAdmin: async (userId: string, isAdmin: boolean): Promise<void> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId);

      if (error) throw error;

      // Logger l'action
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.rpc('insert_admin_log', {
          p_admin_id: user.id,
          p_action: isAdmin ? 'promote_to_admin' : 'demote_from_admin',
          p_entity_type: 'user',
          p_entity_id: userId,
          p_details: { is_admin: isAdmin }
        });
      }
    } catch (error) {
      console.error('Error toggling user admin status:', error);
      throw error;
    }
  }
};

