
import React from 'react';
import { TrendingContent } from './TrendingContent';
import { TrendingSidebar } from './TrendingSidebar';
import { TrendingSymbol, TrendingCategory, RecentActivity } from '@/services/trendingService';

interface TrendingLayoutProps {
  timeFrame: 'day' | 'week' | 'month';
  symbols: TrendingSymbol[] | undefined;
  symbolsLoading: boolean;
  symbolsError: any;
  categories: TrendingCategory[];
  activities: RecentActivity[];
  categoriesLoading: boolean;
  activitiesLoading: boolean;
}

export const TrendingLayout: React.FC<TrendingLayoutProps> = ({
  timeFrame,
  symbols,
  symbolsLoading,
  symbolsError,
  categories,
  activities,
  categoriesLoading,
  activitiesLoading
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <TrendingContent
        timeFrame={timeFrame}
        symbols={symbols}
        isLoading={symbolsLoading}
        error={symbolsError}
      />
      
      <div className="lg:col-span-1">
        <TrendingSidebar 
          categories={categories}
          activities={activities}
          isLoadingCategories={categoriesLoading}
          isLoadingActivities={activitiesLoading}
        />
      </div>
    </div>
  );
};
