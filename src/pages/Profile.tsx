
import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import ProfileEditor from '@/components/user/ProfileEditor';
import UserStatsCard from '@/components/gamification/UserStatsCard';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import { I18nText } from '@/components/ui/i18n-text';
import { useGamification } from '@/hooks/useGamification';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { profile, isLoading, user } = useAuth();
  const { userLevel, userPoints, loading: gamificationLoading } = useGamification();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If no username in params, show current user's profile
  const isOwnProfile = !username || username === profile?.username || username === user?.id;

  if (!user && isOwnProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <CardHeader>
            <CardTitle>
              <I18nText translationKey="profile:notFound">
                Profil non trouvé
              </I18nText>
            </CardTitle>
            <CardDescription>
              <I18nText translationKey="profile:notFoundDescription">
                Impossible de charger les informations de profil.
              </I18nText>
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || user?.email || 'Utilisateur';

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <I18nText 
            translationKey="profile:title" 
            params={{ name: displayName }}
          >
            Profil de {displayName}
          </I18nText>
        </h1>
        <p className="text-muted-foreground mt-1">
          <I18nText translationKey="profile:description">
            Gérez vos informations personnelles et vos préférences
          </I18nText>
        </p>
      </div>

      {isOwnProfile ? (
        <div className="space-y-6">
          {/* Gamification Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UserStatsCard />
            {userLevel && !gamificationLoading && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    <I18nText translationKey="gamification.yourProgress">
                      Votre Progression
                    </I18nText>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LevelProgressBar userLevel={userLevel} />
                  {userPoints && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-amber-600">{userPoints.total}</div>
                        <div className="text-slate-600">Points totaux</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-green-600">{userPoints.contribution_points}</div>
                        <div className="text-slate-600">Contributions</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Profile Editor */}
          <ProfileEditor />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{displayName}</CardTitle>
            <CardDescription>
              Profil public de {displayName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.contributions_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <I18nText translationKey="profile:stats.contributions">
                    Contributions
                  </I18nText>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.total_points || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <I18nText translationKey="profile:stats.points">
                    Points
                  </I18nText>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.followers_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <I18nText translationKey="profile:stats.followers">
                    Abonnés
                  </I18nText>
                </div>
              </div>
            </div>
            
            {profile?.bio && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Biographie</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            {profile?.location && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Localisation</h3>
                <p className="text-muted-foreground">{profile.location}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
