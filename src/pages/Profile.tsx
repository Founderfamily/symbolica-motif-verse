
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Loader, MapPin, Award, Trophy, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getUserContributions } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { gamificationService } from '@/services/gamificationService';
import { UserAchievement, Achievement, UserPoints, UserActivity, UserLevel } from '@/types/gamification';
import AchievementsList from '@/components/gamification/AchievementsList';
import ActivityFeed from '@/components/gamification/ActivityFeed';
import UserRanking from '@/components/gamification/UserRanking';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loadingGamification, setLoadingGamification] = useState(false);
  
  // Load user contributions
  useEffect(() => {
    if (user) {
      setLoading(true);
      getUserContributions(user.id)
        .then(data => {
          setContributions(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching contributions:", error);
          setLoading(false);
        });
    }
  }, [user]);
  
  // Load gamification data
  useEffect(() => {
    if (user) {
      setLoadingGamification(true);
      
      // Fetch all gamification data in parallel
      Promise.all([
        gamificationService.getAchievements(),
        gamificationService.getUserAchievements(user.id),
        gamificationService.getUserPoints(user.id),
        gamificationService.getUserLevel(user.id),
        gamificationService.getUserActivities(user.id),
        gamificationService.getLeaderboard(10)
      ]).then(([
        achievementsData,
        userAchievementsData,
        userPointsData,
        userLevelData,
        activitiesData,
        leaderboardData
      ]) => {
        setAchievements(achievementsData);
        setUserAchievements(userAchievementsData);
        setUserPoints(userPointsData);
        setUserLevel(userLevelData);
        setActivities(activitiesData);
        setTopUsers(leaderboardData);
        setLoadingGamification(false);
      }).catch(error => {
        console.error("Error loading gamification data:", error);
        setLoadingGamification(false);
      });
    }
  }, [user]);
  
  // Redirect if user is not logged in
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  // Calculate in-progress achievements
  const inProgressAchievements = userAchievements
    .filter(ua => !ua.completed && ua.achievement)
    .sort((a, b) => {
      // Calculate progress percentage
      const progressA = (a.progress / (a.achievement?.requirement || 1)) * 100;
      const progressB = (b.progress / (b.achievement?.requirement || 1)) * 100;
      // Sort by highest progress first
      return progressB - progressA;
    })
    .slice(0, 3);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                  <AvatarImage src={user?.avatar_url || undefined} />
                  <AvatarFallback className="text-2xl bg-amber-600 text-white">
                    {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{user?.full_name || user?.username}</CardTitle>
                  <CardDescription>
                    {user?.username && <span className="font-medium">@{user.username}</span>}
                    <span className="text-sm ml-2">
                      {t('profile.memberSince', { date: new Date(user?.created_at || '').toLocaleDateString() })}
                    </span>
                  </CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                      {t('profile.level', { level: userLevel?.level || 1 })}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {userPoints?.total || 0} {t('profile.points')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="overview">{t('profile.tabs.overview')}</TabsTrigger>
                  <TabsTrigger value="contributions">{t('profile.tabs.contributions')}</TabsTrigger>
                  <TabsTrigger value="achievements">{t('profile.tabs.achievements')}</TabsTrigger>
                  <TabsTrigger value="settings">{t('profile.tabs.settings')}</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                      title={t('profile.stats.contributions')} 
                      value={contributions.length} 
                      icon="📝"
                    />
                    <StatCard 
                      title={t('profile.stats.points')} 
                      value={userPoints?.total || 0} 
                      icon="⭐"
                    />
                    <StatCard 
                      title={t('profile.stats.achievements')} 
                      value={userAchievements.filter(ua => ua.completed).length} 
                      icon="🏆"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('profile.progress.nextLevel')}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Level {userLevel?.level || 1}</span>
                        <span>Level {(userLevel?.level || 1) + 1}</span>
                      </div>
                      <Progress 
                        value={userLevel ? (userLevel.xp / userLevel.next_level_xp) * 100 : 0} 
                        className="h-2" 
                      />
                      <div className="text-xs text-slate-500 text-right">
                        {userLevel?.xp || 0} / {userLevel?.next_level_xp || 100} XP
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('profile.achievements.inProgress')}</h3>
                    {loadingGamification ? (
                      <div className="text-center py-4">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
                      </div>
                    ) : inProgressAchievements.length > 0 ? (
                      <div className="space-y-3">
                        <AchievementsList 
                          achievements={inProgressAchievements.map(ua => ua.achievement!)}
                          userAchievements={inProgressAchievements}
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                        <p className="text-slate-500">{t('profile.noInProgressAchievements')}</p>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('profile.activity.recent')}</h3>
                    <ActivityFeed 
                      activities={activities} 
                      loading={loadingGamification}
                    />
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="contributions">
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <Loader className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p>{t('profile.loadingContributions')}</p>
                    </div>
                  ) : contributions.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-medium text-lg mb-2">{t('profile.yourContributions')}</h3>
                      
                      {contributions.map(contribution => (
                        <Link 
                          key={contribution.id} 
                          to={`/contributions/${contribution.id}`}
                          className="block"
                        >
                          <div className="bg-white p-4 rounded-lg border border-slate-200 hover:border-amber-300 transition-colors">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{contribution.title}</h4>
                              <Badge 
                                variant={
                                  contribution.status === 'approved' ? 'default' : 
                                  contribution.status === 'rejected' ? 'destructive' : 
                                  'outline'
                                }
                              >
                                {t(`contributions.status.${contribution.status}`)}
                              </Badge>
                            </div>
                            
                            {contribution.location_name && (
                              <div className="flex items-center text-sm text-slate-500 mt-1">
                                <MapPin className="h-3 w-3 mr-1" />
                                {contribution.location_name}
                              </div>
                            )}
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {contribution.tags.slice(0, 3).map(tag => (
                                <Badge key={tag.id} variant="secondary" className="text-xs">
                                  {tag.tag}
                                </Badge>
                              ))}
                              {contribution.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{contribution.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500 mb-4">{t('profile.noContributions')}</p>
                      <Button asChild variant="outline">
                        <Link to="/contributions/new">
                          {t('profile.startContributing')}
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </TabsContent>
              
              <TabsContent value="achievements">
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-amber-600" />
                        {t('profile.leaderboard')}
                      </h3>
                      <UserRanking 
                        users={topUsers} 
                        title={t('profile.topContributors')} 
                        translationKey="profile.topContributors"
                        loading={loadingGamification}
                      />
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-600" />
                        {t('profile.stats.summary')}
                      </h3>
                      
                      <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100">
                        <div className="p-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-sm text-slate-500">{t('profile.stats.contributions')}</p>
                              <p className="text-2xl font-bold">{userPoints?.contribution_points || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">{t('profile.stats.exploration')}</p>
                              <p className="text-2xl font-bold">{userPoints?.exploration_points || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">{t('profile.stats.validation')}</p>
                              <p className="text-2xl font-bold">{userPoints?.validation_points || 0}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">{t('profile.stats.community')}</p>
                              <p className="text-2xl font-bold">{userPoints?.community_points || 0}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 bg-amber-50">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-amber-800">{t('profile.stats.totalPoints')}</p>
                              <p className="text-2xl font-bold text-amber-700">{userPoints?.total || 0}</p>
                            </div>
                            <div className="bg-amber-100 p-2 rounded-full">
                              <Trophy className="h-8 w-8 text-amber-600" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-4">{t('profile.achievements.earned')}</h3>
                    <Tabs defaultValue="all" className="mb-6">
                      <TabsList className="mb-4">
                        <TabsTrigger value="all">{t('gamification.allAchievements')}</TabsTrigger>
                        <TabsTrigger value="contribution">{t('gamification.contribution')}</TabsTrigger>
                        <TabsTrigger value="exploration">{t('gamification.exploration')}</TabsTrigger>
                        <TabsTrigger value="community">{t('gamification.community')}</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="all">
                        <AchievementsList 
                          achievements={achievements} 
                          userAchievements={userAchievements}
                          loading={loadingGamification}
                          showAll
                        />
                      </TabsContent>
                      
                      <TabsContent value="contribution">
                        <AchievementsList 
                          achievements={achievements} 
                          userAchievements={userAchievements}
                          loading={loadingGamification}
                          type="contribution"
                          showAll
                        />
                      </TabsContent>
                      
                      <TabsContent value="exploration">
                        <AchievementsList 
                          achievements={achievements} 
                          userAchievements={userAchievements}
                          loading={loadingGamification}
                          type="exploration"
                          showAll
                        />
                      </TabsContent>
                      
                      <TabsContent value="community">
                        <AchievementsList 
                          achievements={achievements} 
                          userAchievements={userAchievements}
                          loading={loadingGamification}
                          type="community"
                          showAll
                        />
                      </TabsContent>
                    </Tabs>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="settings">
                <CardContent className="space-y-4">
                  <h3 className="font-semibold text-lg">{t('profile.accountSettings')}</h3>
                  <p className="text-slate-500">{t('profile.settingsDescription')}</p>
                  
                  <div className="pt-4">
                    <Button variant="destructive" onClick={signOut}>
                      {t('profile.signOut')}
                    </Button>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="border-t bg-slate-50">
              <div className="text-xs text-slate-500">
                {user?.is_admin && (
                  <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium mr-2">
                    {t('profile.adminBadge')}
                  </span>
                )}
                ID: {user?.id}
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Helper component for stats
const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
  <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="text-2xl">{icon}</div>
    </div>
  </div>
);

export default ProfilePage;
