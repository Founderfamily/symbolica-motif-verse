
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
}

export type AuthContextType = {
  user: User | null;
  profileData: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const loadUserSession = async () => {
      try {
        setIsLoading(true);
        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          return;
        }
        
        if (session?.user) {
          setUser(session.user);
          
          // Get profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Profile error:', profileError);
          }
          
          if (profileData) {
            setProfileData(profileData);
          }
          
          // Check if user is admin (you can implement your own admin check logic here)
          setIsAdmin(session.user.email === 'admin@example.com' || session.user.email?.includes('admin'));
        }
      } catch (error) {
        console.error('Auth loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        
        // Get profile data
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          setProfileData(profileData);
        }
        
        // Check if user is admin
        setIsAdmin(session.user.email === 'admin@example.com' || session.user.email?.includes('admin'));
      } else {
        setUser(null);
        setProfileData(null);
        setIsAdmin(false);
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  
  const value = {
    user,
    profileData,
    isLoading,
    isAdmin,
    signOut
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
