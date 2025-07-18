import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import ProfileEditor from '@/components/user/ProfileEditor';
import UserStatsCard from '@/components/gamification/UserStatsCard';
import LevelProgressBar from '@/components/gamification/LevelProgressBar';
import MyContributions from '@/components/profile/MyContributions';
import MyCommunities from '@/components/profile/MyCommunities';
import NotificationsAndMessages from '@/components/profile/NotificationsAndMessages';
import MyReports from '@/components/profile/MyReports';
import MyEvaluations from '@/components/profile/MyEvaluations';
import { I18nText } from '@/components/ui/i18n-text';
import { useGamification } from '@/hooks/useGamification';
import { User, FileText, Users, Bell, AlertTriangle, Settings, Star } from 'lucide-react';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile, isLoading, user } = useAuth();
  const { userLevel, userPoints, loading: gamificationLoading } = useGamification();

  const currentTab = searchParams.get('tab') || 'overview';

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

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
    <div className="max-w-6xl mx-auto p-6">
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
        <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Vue d'ensemble</span>
            </TabsTrigger>
            <TabsTrigger value="contributions" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Contributions</span>
            </TabsTrigger>
            <TabsTrigger value="evaluations" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span className="hidden sm:inline">Évaluations</span>
            </TabsTrigger>
            <TabsTrigger value="communities" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Communautés</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Signalements</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Paramètres</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* Gamification Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <UserStatsCard />
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        <I18nText translationKey="gamification.yourProgress">
                          Votre Progression
                        </I18nText>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {userLevel && !gamificationLoading ? (
                        <>
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                Niveau {userLevel.level}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {userLevel.next_level_xp - userLevel.xp} XP jusqu'au niveau suivant
                              </span>
                            </div>
                            <LevelProgressBar userLevel={userLevel} />
                          </div>
                          {userPoints && (
                            <div className="grid grid-cols-2 gap-4 text-sm">
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
                        </>
                      ) : (
                        <div className="text-center py-4">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile?.contributions_count || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <I18nText translationKey="profile.stats.contributions">
                            Contributions
                          </I18nText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {userPoints?.total || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <I18nText translationKey="profile.stats.points">
                            Points
                          </I18nText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {profile?.followers_count || 0}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <I18nText translationKey="profile.stats.followers">
                            Abonnés
                          </I18nText>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="contributions">
              <MyContributions userId={user?.id} />
            </TabsContent>

            <TabsContent value="evaluations">
              <MyEvaluations userId={user?.id} />
            </TabsContent>

            <TabsContent value="communities">
              <MyCommunities userId={user?.id} />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationsAndMessages userId={user?.id} />
            </TabsContent>

            <TabsContent value="reports">
              <MyReports userId={user?.id} />
            </TabsContent>

            <TabsContent value="settings">
              <ProfileEditor />
            </TabsContent>
          </div>
        </Tabs>
      ) : (
        // Public profile view for other users
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
                  <I18nText translationKey="profile.stats.contributions">
                    Contributions
                  </I18nText>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {userPoints?.total || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <I18nText translationKey="profile.stats.points">
                    Points
                  </I18nText>
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {profile?.followers_count || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  <I18nText translationKey="profile.stats.followers">
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
