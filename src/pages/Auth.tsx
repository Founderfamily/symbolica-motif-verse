
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Rediriger vers la page d'accueil si déjà connecté
  React.useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Connexion
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        toast({
          title: 'Connexion réussie',
          description: 'Vous êtes maintenant connecté',
        });
        
        navigate('/');
      } else {
        // Inscription
        const { error } = await signUp(email, password);
        if (error) throw error;
        
        toast({
          title: 'Inscription réussie',
          description: 'Vérifiez votre email pour confirmer votre compte',
        });
        
        setIsLogin(true);
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-serif font-bold text-slate-900">
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          {isLogin ? "Accédez à votre compte" : "Rejoignez la communauté Symbolica"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                ) : isLogin ? (
                  'Se connecter'
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <button
              type="button"
              className="w-full text-center text-sm text-amber-600 hover:text-amber-700"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Vous n'avez pas de compte ? Inscrivez-vous"
                : 'Vous avez déjà un compte ? Connectez-vous'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
