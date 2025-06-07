
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { UserProfile } from '@/types/auth';
import { SecurityUtils } from '@/utils/securityUtils';
import { toast } from 'sonner';

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchUsers = async (search?: string, roleFilter?: string) => {
    if (!isAdmin) {
      setError('Access denied - Admin privileges required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Rate limiting check
      if (!SecurityUtils.checkRateLimit('fetch_users', 20, 60000)) {
        throw new Error('Rate limit exceeded. Please wait before trying again.');
      }

      // Validate and sanitize search input
      let sanitizedSearch = null;
      if (search && search.trim()) {
        sanitizedSearch = SecurityUtils.validateInput(search.trim(), 100);
      }

      // Validate role filter
      const allowedRoles = ['admin', 'user', 'banned'];
      const sanitizedRoleFilter = roleFilter && allowedRoles.includes(roleFilter) ? roleFilter : null;

      const { data, error: fetchError } = await supabase
        .rpc('get_users_for_admin', {
          p_limit: 100,
          p_offset: 0,
          p_search: sanitizedSearch,
          p_role_filter: sanitizedRoleFilter
        });

      if (fetchError) {
        throw fetchError;
      }

      // Map the data to ensure all required fields are present
      const usersWithDefaults = (data || []).map(user => ({
        ...user,
        contributions_count: user.contributions_count || 0,
        verified_uploads: 0,
        bio: undefined,
        location: undefined,
        website: undefined,
        favorite_cultures: undefined,
        total_points: user.total_points || 0,
        followers_count: 0,
        following_count: 0
      }));

      setUsers(usersWithDefaults);
    } catch (err) {
      console.error('Error fetching users:', err);
      const safeError = SecurityUtils.createSafeErrorResponse(err);
      setError(safeError);
      toast.error(safeError);
    } finally {
      setLoading(false);
    }
  };

  const updateUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      // Validate inputs
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      if (typeof isAdmin !== 'boolean') {
        throw new Error('Invalid admin status');
      }

      // Rate limiting check
      if (!SecurityUtils.checkRateLimit(`update_user_${userId}`, 5, 60000)) {
        throw new Error('Rate limit exceeded for user updates');
      }

      const { error } = await supabase
        .rpc('update_user_as_admin', {
          p_admin_id: (await supabase.auth.getUser()).data.user?.id,
          p_user_id: userId,
          p_is_admin: isAdmin
        });

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_admin: isAdmin }
          : user
      ));

      toast.success(`User ${isAdmin ? 'promoted to' : 'removed from'} admin successfully`);
      return true;
    } catch (err) {
      console.error('Error updating user admin status:', err);
      const safeError = SecurityUtils.createSafeErrorResponse(err);
      toast.error(safeError);
      throw err;
    }
  };

  const banUser = async (userId: string, banned: boolean) => {
    try {
      // Validate inputs
      if (!userId || typeof userId !== 'string') {
        throw new Error('Invalid user ID');
      }

      if (typeof banned !== 'boolean') {
        throw new Error('Invalid ban status');
      }

      // Rate limiting check
      if (!SecurityUtils.checkRateLimit(`ban_user_${userId}`, 3, 60000)) {
        throw new Error('Rate limit exceeded for ban operations');
      }

      const { error } = await supabase
        .rpc('toggle_user_ban', {
          p_user_id: userId,
          p_admin_id: (await supabase.auth.getUser()).data.user?.id,
          p_banned: banned
        });

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_banned: banned }
          : user
      ));

      toast.success(`User ${banned ? 'banned' : 'unbanned'} successfully`);
      return true;
    } catch (err) {
      console.error('Error updating user ban status:', err);
      const safeError = SecurityUtils.createSafeErrorResponse(err);
      toast.error(safeError);
      throw err;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUserAdmin,
    banUser
  };
};
