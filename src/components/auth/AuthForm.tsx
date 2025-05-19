
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/i18n/useTranslation';
import { UserProfile } from '@/types/auth';
import { I18nText } from '@/components/ui/i18n-text';
import { Link } from 'react-router-dom';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Extended validation schema for registration
const registerSchema = loginSchema.extend({
  username: z.string().min(3).max(50),
  fullName: z.string().min(2).max(100),
  passwordConfirm: z.string().min(6),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthForm() {
  const { t } = useTranslation();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [authError, setAuthError] = useState<string | null>(null);

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      username: '',
      fullName: '',
      password: '',
      passwordConfirm: '',
    },
  });

  // Handle login submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      await signIn(values.email, values.password);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  // Handle registration submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setAuthError(null);
    try {
      const userData: Partial<UserProfile> = {
        username: values.username,
        full_name: values.fullName,
      };
      await signUp(values.email, values.password, userData);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">
            <I18nText translationKey="auth.buttons.login" />
          </TabsTrigger>
          <TabsTrigger value="register">
            <I18nText translationKey="auth.buttons.register" />
          </TabsTrigger>
        </TabsList>
        
        {/* Login Form */}
        <TabsContent value="login">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="auth.titles.login" />
            </h3>
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.email" />
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          <I18nText translationKey="auth.labels.password" />
                        </FormLabel>
                        <Link
                          to="/auth/reset-password"
                          className="text-xs text-amber-600 hover:text-amber-700"
                        >
                          <I18nText translationKey="auth.buttons.forgotPassword">
                            Mot de passe oublié ?
                          </I18nText>
                        </Link>
                      </div>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError && (
                  <div className="text-red-500 text-sm">{authError}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 
                    <I18nText translationKey="auth.buttons.loggingIn" /> : 
                    <I18nText translationKey="auth.buttons.login" />
                  }
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
        
        {/* Register Form */}
        <TabsContent value="register">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">
              <I18nText translationKey="auth.titles.register" />
            </h3>
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.email" />
                      </FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@mail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.username" />
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.fullName" />
                      </FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.password" />
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="passwordConfirm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.labels.confirmPassword" />
                      </FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {authError && (
                  <div className="text-red-500 text-sm">{authError}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 
                    <I18nText translationKey="auth.buttons.creating" /> : 
                    <I18nText translationKey="auth.buttons.register" />
                  }
                </Button>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
