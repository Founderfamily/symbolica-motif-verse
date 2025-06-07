

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { UserProfile } from '@/types/auth';

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAdmin } = useAuth();

  const fetchUsers = async () => {
    if (!isAdmin) {
      setError('Accès non autorisé');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          is_admin,
          created_at,
          is_banned
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // Assurer que tous les champs requis sont présents avec des valeurs par défaut
      const usersWithDefaults = (data || []).map(user => ({
        ...user,
        contributions_count: 0, // Valeur par défaut
        verified_uploads: 0, // Valeur par défaut
        bio: undefined,
        location: undefined,
        website: undefined,
        favorite_cultures: undefined,
        total_points: 0,
        followers_count: 0,
        following_count: 0
      }));

      setUsers(usersWithDefaults);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const updateUserAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, is_admin: isAdmin }
          : user
      ));

      return true;
    } catch (err) {
      console.error('Error updating user admin status:', err);
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
    updateUserAdmin
  };
};

