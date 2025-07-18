import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, ArrowLeft, Mail } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const emailSchema = z.object({
  newEmail: z.string().email("Veuillez entrer une adresse email valide"),
  password: z.string().min(1, "Le mot de passe est requis pour confirmer le changement"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function UpdateEmail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      newEmail: '',
      password: '',
    },
  });

  const onSubmit = async (data: EmailFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // First verify the password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.password
      });

      if (signInError) {
        throw new Error("Mot de passe incorrect");
      }

      // Then update the email
      const { error } = await supabase.auth.updateUser({
        email: data.newEmail
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour de l'email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardContent className="text-center py-8">
            <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <div className="text-green-600 text-lg font-semibold mb-2">
              Email mis à jour !
            </div>
            <p className="text-gray-600 mb-4">
              Un email de confirmation a été envoyé à votre nouvelle adresse. 
              Veuillez cliquer sur le lien dans l'email pour confirmer le changement.
            </p>
            <Button onClick={() => navigate('/profile?tab=settings')}>
              Retour au profil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <I18nText translationKey="auth:updateEmail.title">
              Mettre à jour l'email
            </I18nText>
          </CardTitle>
          <CardDescription>
            Email actuel : {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nouvelle adresse email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} placeholder="nouvelle@email.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe actuel</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} placeholder="Confirmez avec votre mot de passe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour l'email"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}