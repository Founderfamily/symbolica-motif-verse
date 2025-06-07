import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export interface UserFilters {
  search?: string;
  roleFilter?: 'all' | 'admin' | 'banned' | 'user';
  limit?: number;
  offset?: number;
}

export interface CreateUserData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
  is_admin?: boolean;
}

export interface UpdateUserData {
  username?: string;
  full_name?: string;
  is_admin?: boolean;
}

export interface UserDetails extends UserProfile {
  last_activity?: string;
  followers_count: number;
  following_count: number;
  achievements_count: number;
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
   * Récupère les détails complets d'un utilisateur
   */
  getUserDetails: async (userId: string): Promise<UserDetails | null> => {
    try {
      const { data, error } = await supabase.rpc('get_user_details_for_admin', {
        p_user_id: userId
      });

      if (error) throw error;
      
      if (!data || data.length === 0) return null;
      
      const user = data[0];
      return {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        is_admin: user.is_admin || false,
        is_banned: user.is_banned || false,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_activity: user.last_activity,
        contributions_count: Number(user.contributions_count),
        total_points: Number(user.total_points),
        followers_count: Number(user.followers_count),
        following_count: Number(user.following_count),
        achievements_count: Number(user.achievements_count)
      };
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  },

  /**
   * Crée un nouvel utilisateur via Edge Function
   */
  createUser: async (userData: CreateUserData): Promise<void> => {
    try {
      console.log('Creating user via Edge Function:', userData);

      const { data, error } = await supabase.functions.invoke('create-user-admin', {
        body: userData
      });

      if (error) {
        console.error('Edge Function error:', error);
        throw new Error(error.message || 'Failed to create user');
      }

      if (!data?.success) {
        console.error('Edge Function returned error:', data);
        throw new Error(data?.error || 'Failed to create user');
      }

      console.log('User created successfully:', data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  /**
   * Met à jour un utilisateur
   */
  updateUser: async (userId: string, userData: UpdateUserData): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('update_user_as_admin', {
        p_admin_id: user.id,
        p_user_id: userId,
        p_username: userData.username,
        p_full_name: userData.full_name,
        p_is_admin: userData.is_admin
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  /**
   * Supprime un utilisateur
   */
  deleteUser: async (userId: string): Promise<void> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.rpc('delete_user_as_admin', {
        p_admin_id: user.id,
        p_user_id: userId
      });

      if (error) throw error;

      // Supprimer aussi de Auth (si nécessaire)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      if (authError) {
        console.warn('Warning: Could not delete from auth:', authError);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
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
