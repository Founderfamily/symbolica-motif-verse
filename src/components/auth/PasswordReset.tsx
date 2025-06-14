
import React, { useState } from 'react';
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
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Validation schema for password reset
const resetSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide"
  }),
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function PasswordReset() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Reset form
  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: ResetFormValues) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: window.location.origin + '/reset-password-confirmation',
      });

      if (error) throw error;
      
      setEmailSent(true);
      toast({
        title: t('auth.resetPassword.emailSent'),
        description: t('auth.resetPassword.checkInbox'),
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('error.title'),
        description: error.message || t('auth.resetPassword.error'),
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
            <I18nText translationKey="auth.resetPassword.title">
              Réinitialiser votre mot de passe
            </I18nText>
          </CardTitle>
        </div>
        <CardDescription>
          <I18nText translationKey="auth.resetPassword.description">
            Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
          </I18nText>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 text-green-700 p-3 rounded-md">
              <p className="font-medium">
                <I18nText translationKey="auth.resetPassword.successTitle">
                  Email envoyé avec succès
                </I18nText>
              </p>
              <p className="text-sm mt-1">
                <I18nText translationKey="auth.resetPassword.successMessage">
                  Veuillez vérifier votre boîte de réception et suivre les instructions.
                </I18nText>
              </p>
            </div>
            
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <I18nText translationKey="auth.labels.email" />
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemple@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 
                  <I18nText translationKey="auth.buttons.sending" /> : 
                  <I18nText translationKey="auth.buttons.sendResetLink" />
                }
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
