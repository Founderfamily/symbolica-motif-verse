
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingCategory, RecentActivity } from '@/services/trendingService';
import { TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

interface TrendingSidebarProps {
  categories: TrendingCategory[];
  activities: RecentActivity[];
  isLoadingCategories: boolean;
  isLoadingActivities: boolean;
}

export const TrendingSidebar: React.FC<TrendingSidebarProps> = ({
  categories,
  activities,
  isLoadingCategories,
  isLoadingActivities
}) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'symbol': return '🔷';
      case 'collection': return '📚';
      case 'contribution': return '✨';
      case 'comment': return '💬';
      default: return '🔹';
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'symbol': return 'bg-blue-500';
      case 'collection': return 'bg-purple-500';
      case 'contribution': return 'bg-green-500';
      case 'comment': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend: TrendingCategory['trend']) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <div className="space-y-6">
      {/* Trending Categories */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <I18nText translationKey="categories" ns="trending">Catégories Tendance</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingCategories ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm text-slate-900">{category.name}</p>
                      {getTrendIcon(category.trend)}
                    </div>
                    <p className="text-xs text-slate-500">{category.count.toLocaleString()} symboles</p>
                  </div>
                  <Badge 
                    variant={category.trend === 'up' ? 'default' : category.trend === 'down' ? 'destructive' : 'secondary'}
                    className="text-xs font-medium"
                  >
                    {category.trend === 'up' ? 'Populaire' : category.trend === 'down' ? 'En baisse' : 'Stable'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <I18nText translationKey="recentActivity" ns="trending">Activité Récente</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {isLoadingActivities ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 animate-pulse">
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                  <div className="h-3 bg-slate-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full mt-2 flex-shrink-0`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-700 leading-relaxed">{activity.message}</p>
                    <p className="text-xs text-slate-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
