
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, Flame, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingStats } from '@/services/trendingService';

interface TrendingStatsCardsProps {
  stats: TrendingStats | undefined;
  isLoading: boolean;
}

export const TrendingStatsCards: React.FC<TrendingStatsCardsProps> = ({ stats, isLoading }) => {
  const trendingStats = [
    {
      title: <I18nText translationKey="stats.popularSymbols" ns="trending">Symboles populaires</I18nText>,
      value: stats?.symbolsCount?.toString() || '0',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: <I18nText translationKey="stats.newDiscoveries" ns="trending">Nouvelles découvertes</I18nText>,
      value: stats?.newToday?.toString() || '0',
      change: '+5',
      icon: Star,
      color: 'text-blue-600'
    },
    {
      title: <I18nText translationKey="stats.recentContributions" ns="trending">Contributions récentes</I18nText>,
      value: stats?.contributionsCount?.toString() || '0',
      change: '+18%',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: <I18nText translationKey="stats.activeCollections" ns="trending">Collections actives</I18nText>,
      value: stats?.collectionsCount?.toString() || '0',
      change: '+2',
      icon: Flame,
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="bg-white">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-8 bg-slate-200 rounded mb-1"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {trendingStats.map((stat, index) => (
        <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg bg-slate-50`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
