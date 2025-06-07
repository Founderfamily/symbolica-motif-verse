
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
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { SecurityBadges } from './SecurityBadges';
import { WelcomeModal } from './WelcomeModal';

export default function AuthForm() {
  const { t } = useTranslation();
  const { signIn, signUp, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [newUserName, setNewUserName] = useState<string>('');

  // Validation schema for login with internationalized messages
  const loginSchema = z.object({
    email: z.string().email(t('errors.invalidEmail', { ns: 'auth' })),
    password: z.string().min(6, t('errors.passwordTooShort', { ns: 'auth' })),
  });

  // Extended validation schema for registration with internationalized messages
  const registerSchema = z.object({
    email: z.string().email(t('errors.invalidEmail', { ns: 'auth' })),
    username: z.string().min(3, t('errors.usernameTooShort', { ns: 'auth' })).max(50),
    fullName: z.string().min(2, t('errors.fullNameTooShort', { ns: 'auth' })).max(100).optional(),
    password: z.string()
      .min(6, t('errors.passwordTooShort', { ns: 'auth' }))
      .regex(/[A-Z]/, t('errors.passwordUppercase', { ns: 'auth' }))
      .regex(/[a-z]/, t('errors.passwordLowercase', { ns: 'auth' }))
      .regex(/\d/, t('errors.passwordNumber', { ns: 'auth' })),
    passwordConfirm: z.string().min(6),
  }).refine((data) => data.password === data.passwordConfirm, {
    message: t('errors.passwordsNoMatch', { ns: 'auth' }),
    path: ["passwordConfirm"],
  });

  type LoginFormValues = z.infer<typeof loginSchema>;
  type RegisterFormValues = z.infer<typeof registerSchema>;

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

  // Watch password for strength indicator
  const watchedPassword = registerForm.watch('password');

  // Handle login submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    setAuthError(null);
    try {
      const result = await signIn(values.email, values.password);
      if (result.error) {
        setAuthError(result.error.message === 'Invalid login credentials' 
          ? t('errors.invalidCredentials', { ns: 'auth' })
          : result.error.message);
      }
    } catch (error: any) {
      setAuthError(t('errors.loginError', { ns: 'auth' }));
    }
  };

  // Handle registration submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    setAuthError(null);
    try {
      const userData: Partial<UserProfile> = {
        username: values.username,
        full_name: values.fullName || values.username,
      };
      const result = await signUp(values.email, values.password, userData);
      if (result.error) {
        if (result.error.message.includes('already registered')) {
          setAuthError(t('errors.emailAlreadyUsed', { ns: 'auth' }));
        } else {
          setAuthError(result.error.message);
        }
      } else {
        setNewUserName(values.username);
        setShowWelcomeModal(true);
      }
    } catch (error: any) {
      setAuthError(t('errors.registrationError', { ns: 'auth' }));
    }
  };

  const getFieldValidationIcon = (fieldName: string, form: any) => {
    const fieldState = form.getFieldState(fieldName);
    if (fieldState.isTouched) {
      return fieldState.error ? (
        <AlertCircle className="h-4 w-4 text-red-500" />
      ) : (
        <CheckCircle className="h-4 w-4 text-green-500" />
      );
    }
    return null;
  };

  return (
    <>
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
              <I18nText translationKey="intro">Explorez, analysez et contribuez à l'héritage symbolique mondial</I18nText>
            </p>
          </div>

          <div className="p-6">
            <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span><I18nText translationKey="buttons.login">Se connecter</I18nText></span>
                </TabsTrigger>
                <TabsTrigger value="register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span><I18nText translationKey="buttons.register">S'inscrire</I18nText></span>
                </TabsTrigger>
              </TabsList>
              
              {/* Login Form */}
              <TabsContent value="login" className="space-y-0">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    <I18nText translationKey="titles.login">Bon retour</I18nText>
                  </h3>
                  <p className="text-slate-600 text-sm">
                    <I18nText translationKey="form.loginDescription">Connectez-vous pour accéder à votre espace personnel</I18nText>
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
                            <I18nText translationKey="labels.email">Adresse email</I18nText>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type="email" 
                                placeholder={t('form.emailPlaceholder', { ns: 'auth' })} 
                                className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getFieldValidationIcon('email', loginForm)}
                              </div>
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
                              <I18nText translationKey="labels.password">Mot de passe</I18nText>
                            </FormLabel>
                            <Link
                              to="/auth/reset-password"
                              className="text-xs text-amber-600 hover:text-amber-700 transition-colors"
                            >
                              <I18nText translationKey="buttons.forgotPassword">Mot de passe oublié ?</I18nText>
                            </Link>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder={t('form.passwordPlaceholder', { ns: 'auth' })}
                                className="pl-10 pr-10 h-12 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{authError}</span>
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
                          <span><I18nText translationKey="buttons.loggingIn">Connexion...</I18nText></span>
                        </div>
                      ) : (
                        <I18nText translationKey="buttons.login">Se connecter</I18nText>
                      )}
                    </Button>
                  </form>
                </Form>

                <SecurityBadges />
              </TabsContent>
              
              {/* Register Form */}
              <TabsContent value="register" className="space-y-0">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    <I18nText translationKey="titles.register">Rejoignez notre communauté</I18nText>
                  </h3>
                  <p className="text-slate-600 text-sm">
                    <I18nText translationKey="form.registerDescription">Créez votre compte pour rejoindre notre communauté</I18nText>
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
                            <I18nText translationKey="labels.email">Adresse email</I18nText>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type="email" 
                                placeholder={t('form.emailPlaceholder', { ns: 'auth' })} 
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getFieldValidationIcon('email', registerForm)}
                              </div>
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
                            <I18nText translationKey="labels.username">Nom d'utilisateur</I18nText>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type="text" 
                                placeholder={t('form.usernamePlaceholder', { ns: 'auth' })}
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getFieldValidationIcon('username', registerForm)}
                              </div>
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
                            <I18nText translationKey="labels.fullName">Nom complet</I18nText> <span className="text-slate-400 text-xs">
                              <I18nText translationKey="form.fullNameOptional">(optionnel)</I18nText>
                            </span>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type="text" 
                                placeholder={t('form.fullNamePlaceholder', { ns: 'auth' })}
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getFieldValidationIcon('fullName', registerForm)}
                              </div>
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
                            <I18nText translationKey="labels.password">Mot de passe</I18nText>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type={showPassword ? "text" : "password"}
                                placeholder={t('form.passwordPlaceholder', { ns: 'auth' })}
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </FormControl>
                          <PasswordStrengthIndicator password={watchedPassword || ''} />
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
                            <I18nText translationKey="labels.confirmPassword">Confirmer le mot de passe</I18nText>
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                              <Input 
                                type="password"
                                placeholder={t('form.passwordPlaceholder', { ns: 'auth' })}
                                className="pl-10 pr-10 h-11 border-slate-200 focus:border-amber-500 focus:ring-amber-500 transition-colors" 
                                {...field} 
                              />
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {getFieldValidationIcon('passwordConfirm', registerForm)}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {authError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{authError}</span>
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
                          <span><I18nText translationKey="buttons.creating">Création du compte...</I18nText></span>
                        </div>
                      ) : (
                        <I18nText translationKey="buttons.register">S'inscrire</I18nText>
                      )}
                    </Button>
                  </form>
                </Form>

                <SecurityBadges />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={() => setShowWelcomeModal(false)}
        userName={newUserName}
      />
    </>
  );
}
