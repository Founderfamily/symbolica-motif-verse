
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type AppRole = 'user' | 'admin' | 'master_explorer' | 'banned';

export interface UserRole {
  role: AppRole;
  assigned_at: string;
}

export interface UserWithRoles {
  id: string;
  username?: string;
  full_name?: string;
  roles: AppRole[];
  highest_role: AppRole;
  is_master_explorer: boolean;
  expertise_areas?: string[];
  specialization?: string;
  credentials?: string;
  bio?: string;
  created_at?: string;
}

export const useUserRoles = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roles', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .rpc('get_user_roles', { _user_id: userId });
      
      if (error) throw error;
      return data as UserRole[];
    },
    enabled: !!userId
  });
};

export const useUsersWithRoles = () => {
  return useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles_with_roles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserWithRoles[];
    }
  });
};

export const useAssignMasterExplorerRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      targetUserId, 
      questIds = null 
    }: { 
      targetUserId: string; 
      questIds?: string[] | null;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');
      
      const { error } = await supabase.rpc('assign_master_explorer_role', {
        _target_user_id: targetUserId,
        _admin_user_id: user.user.id,
        _quest_ids: questIds
      });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      queryClient.invalidateQueries({ queryKey: ['user-roles'] });
      toast.success('Rôle de Maître Explorateur assigné avec succès');
    },
    onError: (error) => {
      console.error('Error assigning master explorer role:', error);
      toast.error('Erreur lors de l\'assignation du rôle');
    }
  });
};

export const useCheckUserRole = (role: AppRole) => {
  return useQuery({
    queryKey: ['check-user-role', role],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: user.user.id,
        _role: role
      });
      
      if (error) throw error;
      return data as boolean;
    }
  });
};
