
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, Flame, Star, ArrowUp, ArrowDown } from 'lucide-react';
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
      value: stats?.symbolsCount?.toLocaleString() || '0',
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: <I18nText translationKey="stats.newDiscoveries" ns="trending">Nouvelles découvertes</I18nText>,
      value: stats?.newToday?.toString() || '0',
      change: '+5 aujourd\'hui',
      changeType: 'positive' as const,
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: <I18nText translationKey="stats.recentContributions" ns="trending">Contributions récentes</I18nText>,
      value: stats?.contributionsCount?.toLocaleString() || '0',
      change: '+18%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: <I18nText translationKey="stats.activeCollections" ns="trending">Collections actives</I18nText>,
      value: stats?.collectionsCount?.toLocaleString() || '0',
      change: '+2 cette semaine',
      changeType: 'positive' as const,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {trendingStats.map((stat, index) => (
        <Card key={index} className={`bg-white hover:shadow-lg transition-all duration-200 border-l-4 ${stat.borderColor}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-2 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-sm font-medium ${stat.color}`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                    <span>{stat.change}</span>
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
