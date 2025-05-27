
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Settings, Award, Activity, BarChart3 } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import ProfileEditor from '@/components/user/ProfileEditor';
import { 
  UserStatsCard, 
  AchievementsList, 
  ActivityFeed, 
  LeaderboardDisplay,
  useGamificationNotifications 
} from '@/components/gamification';

const Profile = () => {
  const { user } = useAuth();
  const { recentActivities, loading } = useGamification();
  
  // Enable gamification notifications
  useGamificationNotifications();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <User className="h-12 w-12 mx-auto mb-4 text-slate-400" />
            <h2 className="text-xl font-semibold mb-2">
              <I18nText translationKey="auth.loginRequired">
                Login Required
              </I18nText>
            </h2>
            <p className="text-slate-600 mb-4">
              <I18nText translationKey="auth.loginToAccessProfile">
                Please login to access your profile
              </I18nText>
            </p>
            <Button asChild>
              <a href="/auth">
                <I18nText translationKey="auth.login">Login</I18nText>
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full p-3">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user.full_name || user.username || 'User'}
              </h1>
              <p className="text-slate-600">
                <I18nText translationKey="profile.memberSince">
                  Member since
                </I18nText>{' '}
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <I18nText translationKey="profile.overview">Overview</I18nText>
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <I18nText translationKey="profile.achievements">Achievements</I18nText>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <I18nText translationKey="profile.activity">Activity</I18nText>
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <I18nText translationKey="profile.leaderboard">Leaderboard</I18nText>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <I18nText translationKey="profile.settings">Settings</I18nText>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <UserStatsCard />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <I18nText translationKey="profile.recentActivity">Recent Activity</I18nText>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ActivityFeed activities={recentActivities} loading={loading} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements">
            <AchievementsList />
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>
                  <I18nText translationKey="profile.activityHistory">Activity History</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed activities={recentActivities} loading={loading} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <LeaderboardDisplay />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileEditor />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
