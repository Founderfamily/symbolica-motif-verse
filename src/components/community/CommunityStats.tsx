
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Star, Activity } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCommunityStats } from '@/hooks/useCommunityStats';

const CommunityStats: React.FC = () => {
  const { data: stats, isLoading, error } = useCommunityStats();

  console.log('📊 [CommunityStats] Stats data:', stats, 'Loading:', isLoading, 'Error:', error);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-3"></div>
                <div className="h-8 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    console.error('❌ [CommunityStats] Error loading stats:', error);
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalGroups || 0}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.groups">Groupes d'Intérêt</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalMembers?.toLocaleString() || '0'}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.members">Membres de la Communauté</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats?.totalDiscoveries?.toLocaleString() || '0'}</p>
              <p className="text-slate-600 text-sm">
                <I18nText translationKey="community.stats.discoveries">Découvertes Partagées</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;
