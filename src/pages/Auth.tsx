
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { logger } from '@/services/logService';
import { ErrorHandler } from '@/utils/errorHandler';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminCreation, setIsAdminCreation] = useState(false);
  const { signIn, signUp, session, isAdmin } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Log page view
  useEffect(() => {
    logger.info('Auth page viewed', { isLogin });
  }, [isLogin]);

  // Rediriger vers la page appropriée si déjà connecté
  useEffect(() => {
    if (session) {
      logger.info('User already authenticated, redirecting', { 
        userId: session.user.id, 
        isAdmin 
      });
      
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [session, isAdmin, navigate]);

  const validateForm = (): boolean => {
    if (!email || !email.includes('@')) {
      toast({
        title: 'Validation',
        description: 'Veuillez saisir une adresse email valide',
        variant: 'destructive',
      });
      return false;
    }
    
    if (!password || password.length < 6) {
      toast({
        title: 'Validation',
        description: 'Le mot de passe doit contenir au moins 6 caractères',
        variant: 'destructive',
      });
      return false;
    }
    
    return true;
  };

  const createAdminAccount = async () => {
    if (email === 'abdou' && password === 'Symbolica2025') {
      setLoading(true);
      
      try {
        logger.info('Creating admin account', { email: 'abdou@admin.com' });
        
        // 1. Créer un compte avec une adresse email réelle
        const { error: signUpError, data } = await supabase.auth.signUp({
          email: 'abdou@admin.com',
          password: 'Symbolica2025',
        });
        
        if (signUpError) throw signUpError;
        
        // 2. Attribuer le rôle d'administrateur
        if (data?.user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true, full_name: 'Abdou', username: 'abdou' })
            .eq('id', data.user.id);
            
          if (updateError) throw updateError;
          
          toast({
            title: 'Compte administrateur créé',
            description: 'Le compte administrateur Abdou a été créé avec succès. Vous pouvez maintenant vous connecter.',
          });
          
          // Réinitialiser les champs
          setEmail('');
          setPassword('');
          setIsAdminCreation(false);
          setIsLogin(true);
        }
      } catch (error: any) {
        logger.error('Error creating admin account', { error: error.message });
        toast({
          title: 'Erreur',
          description: 'Impossible de créer le compte administrateur: ' + error.message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    } else {
      toast({
        title: 'Identifiants incorrects',
        description: 'Les identifiants spéciaux ne sont pas corrects',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAdminCreation) {
      await createAdminAccount();
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      logger.info(`Attempting ${isLogin ? 'login' : 'signup'}`, { email });
      
      if (isLogin) {
        // Connexion
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        logger.info('Login successful', { email });
        
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté',
        });
        
        // La redirection sera gérée par le useEffect
      } else {
        // Inscription
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        logger.info('Signup successful', { email });
        
        toast({
          title: 'Inscription réussie',
          description: 'Vérifiez votre email pour confirmer votre compte',
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      logger.error(`Authentication error: ${error.message}`, { error });
      
      ErrorHandler.handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  // Activer le mode création admin spécial
  const activateAdminCreation = () => {
    const clicks = parseInt(localStorage.getItem('adminClicks') || '0') + 1;
    localStorage.setItem('adminClicks', clicks.toString());
    
    if (clicks >= 5) {
      setIsAdminCreation(true);
      localStorage.setItem('adminClicks', '0');
      toast({
        title: 'Mode admin activé',
        description: 'Vous pouvez maintenant créer un compte administrateur spécial',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 
          className="mt-6 text-center text-3xl font-serif font-bold text-slate-900"
          onClick={activateAdminCreation}
        >
          {isAdminCreation 
            ? 'Création compte administrateur' 
            : isLogin 
              ? 'Connexion' 
              : 'Créer un compte'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isAdminCreation 
            ? 'Créez un compte administrateur spécial' 
            : isLogin 
              ? "Accédez à votre compte" 
              : "Rejoignez la communauté Symbolica"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">
                {isAdminCreation ? 'Identifiant spécial' : 'Email'}
              </Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type={isAdminCreation ? "text" : "email"}
                  autoComplete={isAdminCreation ? "off" : "email"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <div className="mt-1">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={loading}
                aria-label={
                  isAdminCreation 
                    ? "Créer un compte administrateur" 
                    : isLogin 
                      ? "Se connecter" 
                      : "S'inscrire"
                }
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : isAdminCreation ? (
                  'Créer un compte administrateur'
                ) : isLogin ? (
                  'Se connecter'
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </div>
          </form>

          {!isAdminCreation && (
            <div className="mt-6">
              <button
                type="button"
                className="w-full text-center text-sm text-amber-600 hover:text-amber-700"
                onClick={() => {
                  setIsLogin(!isLogin);
                  logger.info('Auth mode switched', { isLogin: !isLogin });
                }}
              >
                {isLogin
                  ? "Vous n'avez pas de compte ? Inscrivez-vous"
                  : 'Vous avez déjà un compte ? Connectez-vous'}
              </button>
            </div>
          )}

          {isAdminCreation && (
            <div className="mt-6">
              <button
                type="button"
                className="w-full text-center text-sm text-amber-600 hover:text-amber-700"
                onClick={() => {
                  setIsAdminCreation(false);
                  setIsLogin(true);
                }}
              >
                Retour à la connexion normale
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
