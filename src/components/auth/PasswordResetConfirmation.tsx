
import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Validation schema for password reset confirmation
const resetConfirmationSchema = z
  .object({
    password: z.string().min(6, {
      message: "Le mot de passe doit contenir au moins 6 caractères"
    }),
    confirmPassword: z.string().min(6),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type ResetConfirmationFormValues = z.infer<typeof resetConfirmationSchema>;

export default function PasswordResetConfirmation() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hashPresent, setHashPresent] = useState(false);

  useEffect(() => {
    // Check if hash fragment is present in URL (indicates valid reset link)
    const hash = window.location.hash;
    setHashPresent(hash !== '');
    
    if (!hash) {
      setError(t('auth.resetPassword.invalidLink'));
    }
  }, [t]);

  // Reset confirmation form
  const form = useForm<ResetConfirmationFormValues>({
    resolver: zodResolver(resetConfirmationSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: ResetConfirmationFormValues) => {
    if (!hashPresent) {
      setError(t('auth.resetPassword.invalidLink'));
      return;
    }
    
    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.password
      });

      if (updateError) throw updateError;
      
      setSuccess(true);
      setError(null);
      toast({
        title: t('auth.resetPassword.successTitle'),
        description: t('auth.resetPassword.passwordUpdated'),
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      setError(error.message || t('auth.resetPassword.updateError'));
      toast({
        variant: "destructive",
        title: t('error.title'),
        description: error.message || t('auth.resetPassword.updateError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link to="/auth" className="text-slate-500 hover:text-slate-700 mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <CardTitle>
            <I18nText translationKey="auth.resetPassword.newPasswordTitle">
              Définir un nouveau mot de passe
            </I18nText>
          </CardTitle>
        </div>
        <CardDescription>
          <I18nText translationKey="auth.resetPassword.newPasswordDescription">
            Veuillez entrer votre nouveau mot de passe ci-dessous.
          </I18nText>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              <I18nText translationKey="error.title">Erreur</I18nText>
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {success ? (
          <div className="text-center space-y-4">
            <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">
                <I18nText translationKey="auth.resetPassword.successTitle">
                  Mot de passe mis à jour
                </I18nText>
              </AlertTitle>
              <AlertDescription className="text-green-600">
                <I18nText translationKey="auth.resetPassword.passwordUpdated">
                  Votre mot de passe a été mis à jour avec succès. Vous allez être redirigé vers la page de connexion.
                </I18nText>
              </AlertDescription>
            </Alert>
            
            <Button asChild variant="outline" className="mt-4">
              <Link to="/auth">
                <I18nText translationKey="auth.buttons.backToLogin">
                  Retour à la connexion
                </I18nText>
              </Link>
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <I18nText translationKey="auth.labels.newPassword" />
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <I18nText translationKey="auth.labels.confirmNewPassword" />
                    </FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !hashPresent}
              >
                {loading ? 
                  <I18nText translationKey="auth.buttons.updating" /> : 
                  <I18nText translationKey="auth.buttons.updatePassword" />
                }
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
