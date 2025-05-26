
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface User {
  id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  contributions_count: number;
  verified_uploads: number;
  bio?: string;
  location?: string;
  website?: string;
  favorite_cultures?: string[];
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
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
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setUsers(data || []);
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
