
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';
import { SecurityUtils } from '@/utils/securityUtils';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider - State:', { user: !!user, profile: !!profile, isLoading });

  useEffect(() => {
    console.log('AuthProvider - Initializing auth...');
    
    // Get initial session with timeout
    const initializeAuth = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 3000)
        );
        
        const sessionPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        console.log('AuthProvider - Initial session:', { session: !!session, error });
        
        if (error) {
          console.error('Auth initialization error:', error);
          setIsLoading(false);
          return;
        }

        setUser(session?.user ?? null);
        if (session?.user) {
          // Fetch profile in background, don't block UI
          fetchProfile(session.user.id).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization timeout or failed:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthProvider - Auth state changed:', { event, session: !!session });
      
      setUser(session?.user ?? null);
      if (session?.user) {
        // Don't block on profile fetch
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider - Cleaning up subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('AuthProvider - Fetching profile for user:', userId);
    
    try {
      // Use maybeSingle to avoid errors when no profile exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        // Create a minimal profile if none exists
        const defaultProfile: UserProfile = {
          id: userId,
          username: null,
          full_name: null,
          is_admin: false,
          is_banned: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          contributions_count: 0,
          total_points: 0
        };
        setProfile(defaultProfile);
      } else {
        console.log('AuthProvider - Profile fetched:', { data });
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('User not authenticated');

    // Validate input data
    const sanitizedData: Partial<UserProfile> = {};
    
    if (profileData.username) {
      sanitizedData.username = SecurityUtils.validateInput(profileData.username, 50);
    }
    if (profileData.full_name) {
      sanitizedData.full_name = SecurityUtils.validateInput(profileData.full_name, 100);
    }
    if (profileData.bio) {
      sanitizedData.bio = SecurityUtils.validateInput(profileData.bio, 500);
    }

    const { error } = await supabase
      .from('profiles')
      .update(sanitizedData)
      .eq('id', user.id);

    if (error) throw error;

    // Refresh profile data
    await fetchProfile(user.id);
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    // Validate email and password
    const sanitizedEmail = SecurityUtils.validateInput(email, 255);
    
    // Check password strength
    const passwordValidation = SecurityUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return { 
        error: { 
          message: `Password is too weak: ${passwordValidation.feedback.join(', ')}` 
        } 
      };
    }

    // Generate CSRF token for signup
    const csrfToken = SecurityUtils.generateCSRFToken();
    SecurityUtils.setSecureSessionData('signup_csrf', csrfToken, 15);

    // Set up email redirect URL - CRITICAL SECURITY FIX
    const redirectUrl = `${window.location.origin}/`;

    const { data, error } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: redirectUrl, // This was missing - critical fix
        data: {
          ...userData,
          csrf_token: csrfToken
        }
      }
    });

    if (error) {
      console.error('Signup error:', error);
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(`login_${email}`, 5, 300000)) { // 5 attempts per 5 minutes
      return { 
        error: { 
          message: 'Too many login attempts. Please try again later.' 
        } 
      };
    }

    // Validate input
    const sanitizedEmail = SecurityUtils.validateInput(email, 255);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password
    });

    if (error) {
      console.error('Login error:', error);
    }

    return { data, error };
  };

  const signOut = async () => {
    // Clear any stored session data
    SecurityUtils.setSecureSessionData('signup_csrf', null, 0);
    
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const isAdmin = profile?.is_admin || false;

  console.log('AuthProvider - Final state:', { user: !!user, profile: !!profile, isAdmin, isLoading });

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isAdmin,
      signUp,
      signIn,
      signOut,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
