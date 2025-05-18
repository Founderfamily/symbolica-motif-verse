
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { I18nText } from '@/components/ui/i18n-text';

// Define our own login function since useAuth doesn't provide it
interface AuthFormProps {
  redirectTo?: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ redirectTo = '/' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Since signIn doesn't exist in AuthContextType, let's use the supabase client directly
      const { error } = await window.supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Successfully signed in!');
      navigate(redirectTo);
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Since signUp doesn't exist in AuthContextType, let's use the supabase client directly
      const { error } = await window.supabase.auth.signUp({
        email,
        password
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Please check your email for verification.');
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Redirect if user is already logged in
  React.useEffect(() => {
    if (user) {
      navigate(redirectTo);
    }
  }, [user, navigate, redirectTo]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">
            <I18nText translationKey="auth.welcomeBack" />
          </CardTitle>
          <CardDescription>
            <I18nText translationKey="auth.continueWithAccount" />
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 mx-4">
            <TabsTrigger value="login">
              <I18nText translationKey="auth.signIn" />
            </TabsTrigger>
            <TabsTrigger value="register">
              <I18nText translationKey="auth.signUp" />
            </TabsTrigger>
          </TabsList>
          
          <CardContent>
            <TabsContent value="login">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email-login">
                    <I18nText translationKey="auth.email" />
                  </label>
                  <Input 
                    id="email-login"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password-login">
                      <I18nText translationKey="auth.password" />
                    </label>
                    <Button variant="link" className="p-0 h-auto text-xs">
                      <I18nText translationKey="auth.forgotPassword" />
                    </Button>
                  </div>
                  <Input 
                    id="password-login"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <I18nText translationKey="auth.signingIn" />
                  ) : (
                    <I18nText translationKey="auth.signIn" />
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email-register">
                    <I18nText translationKey="auth.email" />
                  </label>
                  <Input 
                    id="email-register"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password-register">
                    <I18nText translationKey="auth.password" />
                  </label>
                  <Input 
                    id="password-register"
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <I18nText translationKey="auth.signingUp" />
                  ) : (
                    <I18nText translationKey="auth.signUp" />
                  )}
                </Button>
              </form>
            </TabsContent>
          </CardContent>
          
          <CardFooter>
            <div className="w-full text-center text-sm text-slate-600">
              <I18nText translationKey="auth.termsNotice" />
            </div>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForm;
