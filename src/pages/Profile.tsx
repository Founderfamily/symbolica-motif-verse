
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import ProfileEditor from '@/components/user/ProfileEditor';
import { I18nText } from '@/components/ui/i18n-text';

export default function Profile() {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="profile.notFound">
                Profil non trouvé
              </I18nText>
            </CardTitle>
            <CardDescription>
              <I18nText translationKey="profile.notFoundDescription">
                Impossible de charger les informations de profil.
              </I18nText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <I18nText translationKey="profile.title">
            Profil de {profile?.full_name || profile?.username || 'Utilisateur'}
          </I18nText>
        </h1>
        <p className="text-muted-foreground mt-1">
          <I18nText translationKey="profile.description">
            Gérez vos informations personnelles et vos préférences
          </I18nText>
        </p>
      </div>

      <ProfileEditor />
    </div>
  );
}
