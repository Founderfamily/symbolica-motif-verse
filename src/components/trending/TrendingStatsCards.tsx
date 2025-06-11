
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Clock, Flame, Star, ArrowUp, Plus, Sparkles } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingStats } from '@/services/trendingService';

interface TrendingStatsCardsProps {
  stats: TrendingStats | undefined;
  isLoading: boolean;
}

export const TrendingStatsCards: React.FC<TrendingStatsCardsProps> = ({ stats, isLoading }) => {
  console.log('📊 [TrendingStatsCards] Rendering with stats:', stats, 'isLoading:', isLoading);

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

  const symbolsCount = stats?.symbolsCount || 0;
  const collectionsCount = stats?.collectionsCount || 0;
  const contributionsCount = stats?.contributionsCount || 0;
  const newToday = stats?.newToday || 0;

  console.log('📈 [TrendingStatsCards] Displaying real data:', { symbolsCount, collectionsCount, contributionsCount, newToday });

  const statsData = [
    {
      title: "Symboles découverts",
      value: symbolsCount.toLocaleString(),
      subtitle: symbolsCount > 0 ? "Dans notre collection" : "Prêt à démarrer",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      gradient: "from-blue-50 to-blue-100"
    },
    {
      title: "Collections créées",
      value: collectionsCount.toLocaleString(),
      subtitle: collectionsCount > 0 ? "Organisées par thème" : "En préparation",
      icon: Flame,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      gradient: "from-purple-50 to-purple-100"
    },
    {
      title: "Contributions partagées",
      value: contributionsCount.toLocaleString(),
      subtitle: contributionsCount === 0 ? "Bientôt disponible" : "De la communauté",
      icon: contributionsCount === 0 ? Plus : Sparkles,
      color: contributionsCount === 0 ? "text-green-600" : "text-emerald-600",
      bgColor: contributionsCount === 0 ? "bg-green-50" : "bg-emerald-50",
      borderColor: contributionsCount === 0 ? "border-green-200" : "border-emerald-200",
      gradient: contributionsCount === 0 ? "from-green-50 to-green-100" : "from-emerald-50 to-emerald-100"
    },
    {
      title: "Nouveautés aujourd'hui",
      value: newToday.toString(),
      subtitle: newToday > 0 ? "Ajoutées récemment" : "Explorez l'existant",
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      gradient: "from-amber-50 to-amber-100"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statsData.map((stat, index) => (
        <Card key={index} className={`bg-gradient-to-br ${stat.gradient} hover:shadow-lg transition-all duration-200 border-l-4 ${stat.borderColor}`}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-700 mb-2 font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  {stat.value !== "0" && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${stat.color}`}>
                      <ArrowUp className="w-3 h-3" />
                      <span className="text-xs">Actif</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-600">{stat.subtitle}</p>
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
