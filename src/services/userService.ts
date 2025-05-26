
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  username: string | null;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
  bio?: string;
  location?: string;
  website?: string;
  contributions_count: number;
  verified_uploads: number;
  favorite_cultures?: string[];
}

export const userService = {
  // Récupérer tous les utilisateurs (admin seulement)
  async getAllUsers(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        is_admin,
        created_at,
        bio,
        location,
        website,
        contributions_count,
        verified_uploads,
        favorite_cultures
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Assurer que tous les champs requis sont présents
    return (data || []).map(user => ({
      ...user,
      contributions_count: user.contributions_count || 0,
      verified_uploads: user.verified_uploads || 0
    }));
  },

  // Récupérer un utilisateur par ID
  async getUserById(id: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        is_admin,
        created_at,
        bio,
        location,
        website,
        contributions_count,
        verified_uploads,
        favorite_cultures
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw error;
    }
    
    // Assurer que tous les champs requis sont présents
    return {
      ...data,
      contributions_count: data.contributions_count || 0,
      verified_uploads: data.verified_uploads || 0
    };
  },

  // Mettre à jour le statut admin d'un utilisateur
  async updateAdminStatus(userId: string, isAdmin: boolean): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: isAdmin })
      .eq('id', userId);

    if (error) throw error;
  },

  // Mettre à jour le profil d'un utilisateur
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) throw error;
  },

  // Rechercher des utilisateurs par nom/username
  async searchUsers(query: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        username,
        full_name,
        is_admin,
        created_at,
        bio,
        location,
        website,
        contributions_count,
        verified_uploads,
        favorite_cultures
      `)
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return (data || []).map(user => ({
      ...user,
      contributions_count: user.contributions_count || 0,
      verified_uploads: user.verified_uploads || 0
    }));
  },

  // Obtenir les statistiques des utilisateurs
  async getUserStats() {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin, created_at');

    if (error) throw error;

    const total = data?.length || 0;
    const admins = data?.filter(u => u.is_admin).length || 0;
    const regular = total - admins;

    return {
      total,
      admins,
      regular,
      data
    };
  }
};
