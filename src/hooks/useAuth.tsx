
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Compute isAdmin based on user data
  const isAdmin = user?.is_admin || false;

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid supabase auth deadlock
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setUser(data as UserProfile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur Symbolica!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      });
      console.error('Error signing in:', error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<UserProfile>) => {
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
            username: userData.username,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Compte créé avec succès",
        description: "Vous pouvez maintenant vous connecter",
      });
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: error.message,
      });
      console.error('Error signing up:', error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt!",
      });
      
      navigate('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error.message,
      });
      console.error('Error signing out:', error.message);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user || !user.id) return;
    
    try {
      // Update user metadata first if relevant fields are provided
      if (data.username || data.full_name) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            username: data.username || user.username,
            full_name: data.full_name || user.full_name
          }
        });
        
        if (metadataError) throw metadataError;
      }
      
      // Then update the profiles table
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      // Update local user state with new data
      setUser({ ...user, ...data });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error.message,
      });
      console.error('Error updating profile:', error.message);
      throw error;
    }
  };
  
  const updateEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) throw error;
      
      toast({
        title: "Email mis à jour",
        description: "Veuillez vérifier votre nouvelle adresse email",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error.message,
      });
      console.error('Error updating email:', error.message);
      throw error;
    }
  };
  
  const sendPasswordResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth/reset-password-confirmation',
      });
      
      if (error) throw error;
      
      toast({
        title: "Email envoyé",
        description: "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur d'envoi",
        description: error.message,
      });
      console.error('Error sending password reset email:', error.message);
      throw error;
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de mise à jour",
        description: error.message,
      });
      console.error('Error updating password:', error.message);
      throw error;
    }
  };
  
  const verifyEmail = async (token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: 'email',
      });
      
      if (error) throw error;
      
      toast({
        title: "Email vérifié",
        description: "Votre adresse email a été vérifiée avec succès",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de vérification",
        description: error.message,
      });
      console.error('Error verifying email:', error.message);
      throw error;
    }
  };

  const value = {
    user,
    session,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    updateEmail,
    sendPasswordResetEmail,
    updatePassword,
    verifyEmail
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
