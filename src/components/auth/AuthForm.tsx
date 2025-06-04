
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
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Shield } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="bg-white rounded-xl shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Shield className="h-8 w-8 text-white mr-2" />
            <h2 className="text-2xl font-bold text-white">
              <I18nText translationKey="app.name">Symbolica</I18nText>
            </h2>
          </div>
          <p className="text-amber-100 text-sm">
            <I18nText translationKey="auth.intro">
              Explore, analyze and contribute to the world's symbolic heritage
            </I18nText>
          </p>
        </div>

        <div className="p-6">
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span><I18nText translationKey="auth.buttons.login" /></span>
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span><I18nText translationKey="auth.buttons.register" /></span>
              </TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login" className="space-y-0">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  <I18nText translationKey="auth.titles.login" />
                </h3>
                <p className="text-slate-600 text-sm">
                  Connectez-vous pour accéder à votre espace personnel
                </p>
              </div>
              
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-5">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.email" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="email" 
                              placeholder="exemple@email.com" 
                              className="pl-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                          </div>
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
                          <FormLabel className="text-slate-700 font-medium">
                            <I18nText translationKey="auth.labels.password" />
                          </FormLabel>
                          <Link
                            to="/auth/reset-password"
                            className="text-xs text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            <I18nText translationKey="auth.buttons.forgotPassword">
                              Mot de passe oublié ?
                            </I18nText>
                          </Link>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {authError}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span><I18nText translationKey="auth.buttons.loggingIn" /></span>
                      </div>
                    ) : (
                      <I18nText translationKey="auth.buttons.login" />
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register" className="space-y-0">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  <I18nText translationKey="auth.titles.register" />
                </h3>
                <p className="text-slate-600 text-sm">
                  Créez votre compte pour rejoindre notre communauté
                </p>
              </div>
              
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.email" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="email" 
                              placeholder="exemple@email.com" 
                              className="pl-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                          </div>
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
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.username" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="text" 
                              className="pl-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                          </div>
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
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.fullName" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="text" 
                              className="pl-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                          </div>
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
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.password" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type={showPassword ? "text" : "password"}
                              className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
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
                        <FormLabel className="text-slate-700 font-medium">
                          <I18nText translationKey="auth.labels.confirmPassword" />
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input 
                              type="password"
                              className="pl-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500" 
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {authError}
                    </div>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span><I18nText translationKey="auth.buttons.creating" /></span>
                      </div>
                    ) : (
                      <I18nText translationKey="auth.buttons.register" />
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
