
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

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(false);
  
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
  
  // Mock gamification data (in a real app, this would come from the backend)
  const gamificationData = {
    level: 2,
    points: 125,
    nextLevelPoints: 200,
    badges: [
      { id: 1, name: 'First Contribution', icon: '🏆', date: '2023-04-15' },
      { id: 2, name: 'Pattern Finder', icon: '🔍', date: '2023-05-20' },
    ],
    achievements: [
      { id: 1, name: 'Upload 3 symbols', progress: 67, current: 2, target: 3 },
      { id: 2, name: 'Add 5 comments', progress: 40, current: 2, target: 5 },
      { id: 3, name: 'Complete your profile', progress: 100, current: 1, target: 1 },
    ]
  };
  
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
                      {t('profile.level', { level: gamificationData.level })}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {gamificationData.points} {t('profile.points')}
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
                  <TabsTrigger value="badges">{t('profile.tabs.badges')}</TabsTrigger>
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
                      title={t('profile.stats.symbols')} 
                      value={user?.symbols_count || 0} 
                      icon="🔍"
                    />
                    <StatCard 
                      title={t('profile.stats.verified')} 
                      value={user?.verified_uploads || 0} 
                      icon="✅"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('profile.progress.nextLevel')}</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Level {gamificationData.level}</span>
                        <span>Level {gamificationData.level + 1}</span>
                      </div>
                      <Progress value={(gamificationData.points / gamificationData.nextLevelPoints) * 100} className="h-2" />
                      <div className="text-xs text-slate-500 text-right">
                        {gamificationData.points} / {gamificationData.nextLevelPoints} {t('profile.points')}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('profile.achievements.inProgress')}</h3>
                    <div className="space-y-3">
                      {gamificationData.achievements.map(achievement => (
                        <div key={achievement.id} className="bg-white p-3 rounded border border-slate-200">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{achievement.name}</span>
                            <span className="text-sm text-slate-500">
                              {achievement.current}/{achievement.target}
                            </span>
                          </div>
                          <Progress value={achievement.progress} className="h-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="font-medium text-amber-800 mb-2">{t('profile.about.title')}</h3>
                    <p className="text-amber-700">{t('profile.about.description')}</p>
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
              
              <TabsContent value="badges">
                <CardContent>
                  <h3 className="font-medium text-lg mb-4">{t('profile.badges.earned')}</h3>
                  
                  {gamificationData.badges.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {gamificationData.badges.map(badge => (
                        <div key={badge.id} className="bg-white p-4 rounded-lg border border-slate-200 text-center">
                          <div className="text-3xl mb-2">{badge.icon}</div>
                          <h4 className="font-medium">{badge.name}</h4>
                          <p className="text-xs text-slate-500">{t('profile.badges.earned')} {new Date(badge.date).toLocaleDateString()}</p>
                        </div>
                      ))}
                      
                      {/* Placeholder for unearned badges */}
                      {[1, 2, 3, 4].map(i => (
                        <div key={`placeholder-${i}`} className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300 text-center">
                          <div className="text-3xl mb-2 text-slate-300">?</div>
                          <h4 className="font-medium text-slate-400">{t('profile.badges.locked')}</h4>
                          <p className="text-xs text-slate-400">{t('profile.badges.keepContributing')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-500">{t('profile.noBadges')}</p>
                      <Button variant="outline" className="mt-4">
                        {t('profile.howToEarnBadges')}
                      </Button>
                    </div>
                  )}
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
