
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingCategory, RecentActivity } from '@/services/trendingService';

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

  return (
    <div className="space-y-6">
      {/* Trending Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <I18nText translationKey="categories" ns="trending">Catégories Tendance</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCategories ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{category.name}</p>
                    <p className="text-xs text-slate-500">{category.count} symboles</p>
                  </div>
                  <Badge 
                    variant={category.trend === 'up' ? 'default' : category.trend === 'down' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {category.trend === 'up' ? '↗' : category.trend === 'down' ? '↘' : '→'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <I18nText translationKey="recentActivity" ns="trending">Activité Récente</I18nText>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingActivities ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-2 animate-pulse">
                  <div className="w-2 h-2 bg-slate-200 rounded-full"></div>
                  <div className="h-3 bg-slate-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${getActivityColor(activity.type)} rounded-full`}></div>
                  <span className="text-slate-600">{activity.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
