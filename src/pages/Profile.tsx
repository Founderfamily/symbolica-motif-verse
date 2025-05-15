
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Loader } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isLoading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
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
                </div>
              </div>
            </CardHeader>
            
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">{t('profile.tabs.overview')}</TabsTrigger>
                  <TabsTrigger value="contributions">{t('profile.tabs.contributions')}</TabsTrigger>
                  <TabsTrigger value="settings">{t('profile.tabs.settings')}</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="overview">
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                      title={t('profile.stats.contributions')} 
                      value={user?.contributions_count || 0} 
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
                  
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                    <h3 className="font-medium text-amber-800 mb-2">{t('profile.about.title')}</h3>
                    <p className="text-amber-700">{t('profile.about.description')}</p>
                  </div>
                </CardContent>
              </TabsContent>
              
              <TabsContent value="contributions">
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-slate-500">{t('profile.noContributions')}</p>
                    <Button variant="outline" className="mt-4">
                      {t('profile.startContributing')}
                    </Button>
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
