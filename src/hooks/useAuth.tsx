
import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { Profile } from '@/types/supabase';
import { logger } from '@/services/logService';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
  }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    logger.info('Initializing auth state');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        logger.info('Auth state changed', { event });
        
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Récupérer le profil utilisateur s'il est connecté
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      logger.info('Checking existing session', { 
        hasSession: !!existingSession 
      });
      
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      if (existingSession?.user) {
        fetchUserProfile(existingSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      logger.info('Cleaning up auth subscription');
      subscription.unsubscribe();
    }
  }, []);

  const fetchUserProfile = async (userId: string) => {
    logger.info('Fetching user profile', { userId });
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        logger.info('User profile fetched', { 
          userId, 
          isAdmin: data.is_admin 
        });
        
        setProfile(data);
        setIsAdmin(data.is_admin);
      } else {
        logger.warning('No profile found for user', { userId });
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (error) {
      logger.error('Error fetching profile', { 
        userId, 
        error: (error as Error).message
      });
      
      setProfile(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    logger.info('Sign in attempt', { email });
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logger.error('Sign in error', { 
          email, 
          error: error.message 
        });
        throw error;
      }
      
      logger.info('Sign in successful', { email });
      return { error: null };
    } catch (error) {
      logger.error('Sign in exception', { 
        email, 
        error: (error as Error).message 
      });
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string) => {
    logger.info('Sign up attempt', { email });
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        logger.error('Sign up error', { 
          email, 
          error: error.message 
        });
        throw error;
      }
      
      logger.info('Sign up successful', { email });
      return { error: null };
    } catch (error) {
      logger.error('Sign up exception', { 
        email, 
        error: (error as Error).message 
      });
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    logger.info('Sign out attempt');
    
    try {
      await supabase.auth.signOut();
      logger.info('Sign out successful');
    } catch (error) {
      logger.error('Sign out error', { 
        error: (error as Error).message 
      });
      throw error;
    }
  };
  
  const refreshProfile = async () => {
    if (!user) {
      logger.warning('Cannot refresh profile: No user logged in');
      return;
    }
    
    logger.info('Manually refreshing user profile', { 
      userId: user.id 
    });
    
    await fetchUserProfile(user.id);
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    refreshProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
