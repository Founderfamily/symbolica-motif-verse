import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCommunityStats } from '@/hooks/useCommunityStats';
import { usePlatformStats } from '@/hooks/usePlatformStats';

const CommunityStats: React.FC = () => {
  const { data: stats, isLoading, error } = useCommunityStats();
  const { data: platformStats } = usePlatformStats();

  console.log('📊 [CommunityStats] Stats data:', stats, 'Loading:', isLoading, 'Error:', error);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-white/75 backdrop-blur-sm border-stone-200/60 shadow-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-stone-200 rounded mb-3"></div>
                <div className="h-8 bg-stone-200 rounded mb-2"></div>
                <div className="h-3 bg-stone-200 rounded w-2/3"></div>
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

  // Utiliser les vraies données de la base de données
  const totalGroups = stats?.totalGroups || 0;
  const totalContributions = platformStats?.totalContributions || 0;
  const totalSymbols = platformStats?.totalSymbols || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white/75 backdrop-blur-sm border-stone-200/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-stone-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{totalGroups}</p>
              <p className="text-stone-600 text-sm">
                <I18nText translationKey="community.stats.groups">Groupes d'Intérêt</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/75 backdrop-blur-sm border-stone-200/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-stone-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{totalContributions}</p>
              <p className="text-stone-600 text-sm">
                <I18nText translationKey="community.stats.contributions">Contributions</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/75 backdrop-blur-sm border-stone-200/60 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-stone-100 p-3 rounded-full">
              <Star className="h-6 w-6 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-stone-800">{totalSymbols}</p>
              <p className="text-stone-600 text-sm">
                <I18nText translationKey="community.stats.discoveries">Symboles</I18nText>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityStats;
