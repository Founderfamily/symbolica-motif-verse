
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

// Validation schema for profile edit
const profileSchema = z.object({
  username: z.string().min(3, {
    message: "Le nom d'utilisateur doit comporter au moins 3 caractères"
  }).max(50),
  full_name: z.string().min(2, {
    message: "Le nom complet doit comporter au moins 2 caractères"
  }).max(100),
  bio: z.string().max(500, {
    message: "La biographie ne peut pas dépasser 500 caractères"
  }).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url({
    message: "Veuillez entrer une URL valide"
  }).optional().or(z.string().length(0)),
  avatar_url: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileEditor() {
  const { t } = useTranslation();
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Initialize form with current profile data
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || '',
      full_name: profile?.full_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || '',
      avatar_url: profile?.avatar_url || '',
    },
  });

  useEffect(() => {
    // Update form values when profile data changes
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile, form]);

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast({
          variant: "destructive",
          title: t('profile:edit.error'),
          description: t('profile:edit.notAnImage'),
        });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          variant: "destructive",
          title: t('profile:edit.error'),
          description: t('profile:edit.fileTooLarge'),
        });
        return;
      }
      
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  // Handle avatar upload to storage
  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      // Structure: user_id/avatar.ext (pour correspondre aux politiques RLS)
      const filePath = `${user?.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user_content')
        .upload(filePath, file, { upsert: true });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Provide specific error messages based on error type
        if (uploadError.message?.includes('Bucket not found')) {
          throw new Error('Bucket de stockage non trouvé. Veuillez contacter le support.');
        } else if (uploadError.message?.includes('File size')) {
          throw new Error('Fichier trop volumineux. La taille maximale est de 5 MB.');
        } else if (uploadError.message?.includes('Invalid file type')) {
          throw new Error('Type de fichier non supporté. Utilisez JPG, PNG ou GIF.');
        } else if (uploadError.message?.includes('row-level security policy')) {
          throw new Error('Permissions insuffisantes pour télécharger le fichier.');
        } else {
          throw new Error(`Échec du téléchargement: ${uploadError.message}`);
        }
      }
      
      const { data: urlData } = await supabase.storage
        .from('user_content')
        .getPublicUrl(filePath);
        
      return urlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      
      // Re-throw the error with message to be caught by the calling function
      throw error;
    }
  };
  
  const onSubmit = async (data: ProfileFormValues) => {
    setLoading(true);
    setError(null);
    
    try {
      let avatarUrl = data.avatar_url || null;
      
      // Upload new avatar if selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar(avatarFile);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        } else {
          throw new Error(t('profile:edit.avatarUploadFailed'));
        }
      }
      
      // Update profile with new data
      await updateProfile({
        ...data,
        avatar_url: avatarUrl,
      });
      
      toast({
        title: t('profile:edit.success'),
        description: t('profile:edit.profileUpdated'),
      });
      
      // Clean up avatar preview URL
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setAvatarFile(null);
      }
      
    } catch (err: any) {
      setError(err.message || t('profile:edit.updateError'));
      toast({
        variant: "destructive",
        title: t('profile:edit.error'),
        description: err.message || t('profile:edit.updateError'),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <I18nText translationKey="profile:edit.title">
            Modifier votre profil
          </I18nText>
        </CardTitle>
        <CardDescription>
          <I18nText translationKey="profile:edit.description">
            Mettez à jour vos informations personnelles
          </I18nText>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              <I18nText translationKey="profile:edit.error">Erreur</I18nText>
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar upload section */}
          <div className="flex flex-col items-center space-y-4 pb-4 md:pb-0 md:pr-6 md:border-r border-slate-200">
            <Avatar className="w-24 h-24">
              <AvatarImage 
                src={avatarPreview || profile?.avatar_url || undefined} 
                alt={profile?.full_name || profile?.username || "Avatar"} 
              />
              <AvatarFallback className="text-2xl bg-amber-100 text-amber-700">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="text-sm"
            >
              <I18nText translationKey="profile:edit.changeAvatar">
                Changer d'avatar
              </I18nText>
            </Button>
            
            <p className="text-xs text-slate-500 text-center max-w-[200px]">
              <I18nText translationKey="profile:edit.avatarRequirements">
                JPG, PNG ou GIF. 5 MB maximum.
              </I18nText>
            </p>
          </div>
          
          {/* Profile form */}
          <div className="flex-grow">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="profile:edit.username" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="profile:edit.fullName" />
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <I18nText translationKey="profile:edit.bio" />
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ''}
                          placeholder={t('profile:edit.bioPlaceholder')}
                          className="resize-none"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <I18nText translationKey="profile:edit.location" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            placeholder={t('profile:edit.locationPlaceholder')}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <I18nText translationKey="profile:edit.website" />
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ''}
                            placeholder="https://example.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mr-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <I18nText translationKey="profile:edit.saving">
                          Sauvegarde en cours...
                        </I18nText>
                      </>
                    ) : (
                      <I18nText translationKey="profile:edit.saveChanges">
                        Sauvegarder les modifications
                      </I18nText>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    disabled={loading}
                  >
                    <I18nText translationKey="profile:edit.cancel">
                      Annuler
                    </I18nText>
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-lg font-medium mb-2">
            <I18nText translationKey="profile:edit.emailSection">
              Email et Mot de passe
            </I18nText>
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            <I18nText translationKey="profile:edit.emailDescription">
              Gérez votre email et votre mot de passe
            </I18nText>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild>
              <a href="/auth/reset-password">
                <I18nText translationKey="auth:buttons.changePassword">
                  Changer de mot de passe
                </I18nText>
              </a>
            </Button>
            
            <Button variant="outline" asChild>
              <a href="/auth/update-email">
                <I18nText translationKey="auth:buttons.updateEmail">
                  Mettre à jour l'email
                </I18nText>
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
