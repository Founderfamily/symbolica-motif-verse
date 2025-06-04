
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { UserProfile } from '@/types/auth';
import { I18nText } from '@/components/ui/i18n-text';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Login validation schema with translated messages
const createLoginSchema = (t: (key: string) => string) => z.object({
  email: z.string()
    .min(1, { message: t('auth.validation.email.required') })
    .email({ message: t('auth.validation.email.invalid') }),
  password: z.string()
    .min(1, { message: t('auth.validation.password.required') })
    .min(6, { message: t('auth.validation.password.minLength') }),
});

// Register validation schema with translated messages
const createRegisterSchema = (t: (key: string) => string) => z.object({
  email: z.string()
    .min(1, { message: t('auth.validation.email.required') })
    .email({ message: t('auth.validation.email.invalid') }),
  username: z.string()
    .min(1, { message: t('auth.validation.username.required') })
    .min(3, { message: t('auth.validation.username.minLength') })
    .max(50, { message: t('auth.validation.username.maxLength') }),
  fullName: z.string()
    .min(2, { message: t('auth.validation.fullName.minLength') })
    .max(100, { message: t('auth.validation.fullName.maxLength') })
    .optional(),
  password: z.string()
    .min(1, { message: t('auth.validation.password.required') })
    .min(6, { message: t('auth.validation.password.minLength') })
    .regex(/[A-Z]/, { message: t('auth.validation.password.uppercase') })
    .regex(/[a-z]/, { message: t('auth.validation.password.lowercase') })
    .regex(/\d/, { message: t('auth.validation.password.number') }),
  confirmPassword: z.string()
    .min(1, { message: t('auth.validation.confirmPassword.required') }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.validation.confirmPassword.mismatch",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;

export default function AuthForm() {
  const { t } = useTranslation();
  const { signIn, signUp, isLoading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  const loginSchema = createLoginSchema(t);
  const registerSchema = createRegisterSchema(t);

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
      confirmPassword: '',
    },
  });

  // Get error message based on error code
  const getErrorMessage = (error: any): string => {
    const message = error?.message || '';
    
    if (message.includes('Invalid login credentials')) {
      return t('auth.errors.invalidCredentials');
    }
    if (message.includes('already registered')) {
      return t('auth.errors.emailAlreadyExists');
    }
    if (message.includes('Password')) {
      return t('auth.errors.weakPassword');
    }
    return t('auth.errors.unknownError');
  };

  // Handle login submission
  const onLoginSubmit = async (values: LoginFormValues) => {
    try {
      const result = await signIn(values.email, values.password);
      if (result.error) {
        toast({
          variant: "destructive",
          title: t('auth.errors.title'),
          description: getErrorMessage(result.error),
        });
      } else {
        toast({
          title: t('auth.success.signedIn'),
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.errors.title'),
        description: getErrorMessage(error),
      });
    }
  };

  // Handle registration submission
  const onRegisterSubmit = async (values: RegisterFormValues) => {
    try {
      const userData: Partial<UserProfile> = {
        username: values.username,
        full_name: values.fullName || values.username,
      };
      
      const result = await signUp(values.email, values.password, userData);
      if (result.error) {
        toast({
          variant: "destructive",
          title: t('auth.errors.registerTitle'),
          description: getErrorMessage(result.error),
        });
      } else {
        toast({
          title: t('auth.success.accountCreated'),
          description: t('auth.success.checkEmail'),
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('auth.errors.registerTitle'),
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <Card className="shadow-xl border-0">
      <CardHeader className="space-y-1">
        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">
              <I18nText translationKey="auth.login.title" />
            </TabsTrigger>
            <TabsTrigger value="register">
              <I18nText translationKey="auth.register.title" />
            </TabsTrigger>
          </TabsList>
          
          {/* Login Form */}
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-xl">
                <I18nText translationKey="auth.login.title" />
              </CardTitle>
              <CardDescription>
                <I18nText translationKey="auth.login.subtitle" />
              </CardDescription>
            </div>
            
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.fields.email.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="email" 
                            placeholder={t('auth.fields.email.placeholder')} 
                            className="pl-10" 
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
                      <FormLabel>
                        <I18nText translationKey="auth.fields.password.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.fields.password.placeholder')}
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span><I18nText translationKey="auth.login.loading" /></span>
                    </div>
                  ) : (
                    <I18nText translationKey="auth.login.button" />
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-slate-600">
              <I18nText translationKey="auth.login.noAccount" />{' '}
              <button 
                onClick={() => setActiveTab('register')}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                <I18nText translationKey="auth.login.signUpLink" />
              </button>
            </div>
          </TabsContent>
          
          {/* Register Form */}
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-2 text-center">
              <CardTitle className="text-xl">
                <I18nText translationKey="auth.register.title" />
              </CardTitle>
              <CardDescription>
                <I18nText translationKey="auth.register.subtitle" />
              </CardDescription>
            </div>
            
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.fields.email.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="email" 
                            placeholder={t('auth.fields.email.placeholder')} 
                            className="pl-10" 
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
                      <FormLabel>
                        <I18nText translationKey="auth.fields.username.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="text" 
                            placeholder={t('auth.fields.username.placeholder')}
                            className="pl-10" 
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
                      <FormLabel>
                        <I18nText translationKey="auth.fields.fullName.label" /> 
                        <span className="text-slate-400 text-sm">(<I18nText translationKey="auth.fields.fullName.optional" />)</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="text" 
                            placeholder={t('auth.fields.fullName.placeholder')}
                            className="pl-10" 
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
                      <FormLabel>
                        <I18nText translationKey="auth.fields.password.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder={t('auth.fields.password.placeholder')}
                            className="pl-10 pr-10" 
                            {...field} 
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="auth.fields.confirmPassword.label" />
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input 
                            type="password"
                            placeholder={t('auth.fields.confirmPassword.placeholder')}
                            className="pl-10" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span><I18nText translationKey="auth.register.loading" /></span>
                    </div>
                  ) : (
                    <I18nText translationKey="auth.register.button" />
                  )}
                </Button>
              </form>
            </Form>

            <div className="text-center text-sm text-slate-600">
              <I18nText translationKey="auth.register.hasAccount" />{' '}
              <button 
                onClick={() => setActiveTab('login')}
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                <I18nText translationKey="auth.register.signInLink" />
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
