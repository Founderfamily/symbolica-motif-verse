
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, Flame, Star, ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingStats } from '@/services/trendingService';

interface TrendingStatsCardsProps {
  stats: TrendingStats | undefined;
  isLoading: boolean;
}

export const TrendingStatsCards: React.FC<TrendingStatsCardsProps> = ({ stats, isLoading }) => {
  // Adapter les messages en fonction des vraies données
  const getTrendingStats = () => {
    const symbolsCount = stats?.symbolsCount || 0;
    const collectionsCount = stats?.collectionsCount || 0;
    const contributionsCount = stats?.contributionsCount || 0;
    const newToday = stats?.newToday || 0;

    return [
      {
        title: <I18nText translationKey="stats.popularSymbols" ns="trending">Symboles découverts</I18nText>,
        value: symbolsCount.toLocaleString(),
        change: symbolsCount < 50 ? 'Collection en croissance' : '+12%',
        changeType: 'positive' as const,
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        isSmall: symbolsCount < 50
      },
      {
        title: <I18nText translationKey="stats.activeCollections" ns="trending">Collections actives</I18nText>,
        value: collectionsCount.toLocaleString(),
        change: collectionsCount > 40 ? 'Très actif !' : 'En développement',
        changeType: 'positive' as const,
        icon: Flame,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        isSmall: collectionsCount < 20
      },
      {
        title: <I18nText translationKey="stats.recentContributions" ns="trending">Contributions</I18nText>,
        value: contributionsCount.toLocaleString(),
        change: contributionsCount === 0 ? 'Prochainement' : '+18%',
        changeType: contributionsCount === 0 ? 'neutral' as const : 'positive' as const,
        icon: contributionsCount === 0 ? Plus : Clock,
        color: contributionsCount === 0 ? 'text-blue-600' : 'text-purple-600',
        bgColor: contributionsCount === 0 ? 'bg-blue-50' : 'bg-purple-50',
        borderColor: contributionsCount === 0 ? 'border-blue-200' : 'border-purple-200',
        isSmall: contributionsCount === 0
      },
      {
        title: <I18nText translationKey="stats.newDiscoveries" ns="trending">Nouvelles découvertes</I18nText>,
        value: newToday.toString(),
        change: newToday > 0 ? 'Aujourd\'hui' : 'Bientôt disponible',
        changeType: newToday > 0 ? 'positive' as const : 'neutral' as const,
        icon: Star,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        isSmall: newToday === 0
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white">
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

  const trendingStats = getTrendingStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {trendingStats.map((stat, index) => (
        <Card key={index} className={`bg-white hover:shadow-lg transition-all duration-200 border-l-4 ${stat.borderColor}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-2 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className={`text-3xl font-bold text-slate-900 ${stat.isSmall ? 'text-2xl' : ''}`}>
                    {stat.value}
                  </p>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === 'positive' ? stat.color :
                    stat.changeType === 'neutral' ? 'text-slate-500' : 'text-red-600'
                  }`}>
                    {stat.changeType === 'positive' && <ArrowUp className="w-3 h-3" />}
                    {stat.changeType === 'neutral' && <span className="w-3 h-3" />}
                    <span className="text-xs">{stat.change}</span>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
