
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { useQueryClient } from '@tanstack/react-query';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      }
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      // First try to get from user_profiles_with_roles view
      const { data: profileData, error } = await supabase
        .from('user_profiles_with_roles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (profileData) {
        setProfile({
          id: profileData.id,
          username: profileData.username,
          full_name: profileData.full_name,
          is_admin: profileData.roles?.includes('admin') || false,
          is_banned: profileData.is_banned || false,
          created_at: profileData.created_at,
          updated_at: profileData.updated_at,
          roles: profileData.roles || [],
          highest_role: profileData.highest_role || 'user',
          is_master_explorer: profileData.is_master_explorer || false,
          expertise_areas: profileData.expertise_areas,
          specialization: profileData.specialization,
          credentials: profileData.credentials,
          bio: profileData.bio,
          avatar_url: profileData.avatar_url
        });
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile data
    await fetchProfile(user.id);
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });
    return { data, error };
  };

  const signOut = async () => {
    queryClient.clear();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  // Computed properties for role checking
  const isAdmin = profile?.roles?.includes('admin') || profile?.is_admin || false;
  const isMasterExplorer = profile?.is_master_explorer || profile?.roles?.includes('master_explorer') || false;
  const isBanned = profile?.is_banned || profile?.roles?.includes('banned') || false;

  return {
    user,
    profile,
    isLoading,
    isAdmin,
    isMasterExplorer,
    isBanned,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile: () => user ? fetchProfile(user.id) : null
  };
};
