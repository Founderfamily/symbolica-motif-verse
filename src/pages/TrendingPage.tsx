
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TrendingStatsCards } from '@/components/trending/TrendingStatsCards';
import { TrendingHeader } from '@/components/trending/TrendingHeader';
import { TrendingLayout } from '@/components/trending/TrendingLayout';
import { useTrendingSymbols, useTrendingStats, useTrendingCategories, useRecentActivity } from '@/hooks/useTrending';

const TrendingPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  // Hooks avec gestion d'erreur améliorée
  const { data: trendingSymbols, isLoading: symbolsLoading, error: symbolsError } = useTrendingSymbols({
    timeFrame,
    limit: 12
  });

  const { data: stats, isLoading: statsLoading } = useTrendingStats();
  const { data: categories = [], isLoading: categoriesLoading } = useTrendingCategories();
  const { data: activities = [], isLoading: activitiesLoading } = useRecentActivity();

  console.log('TrendingPage render:', {
    timeFrame,
    symbolsCount: trendingSymbols?.length,
    symbolsLoading,
    symbolsError,
    statsLoading,
    categoriesLoading,
    activitiesLoading
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <TrendingHeader />
        
        <TrendingStatsCards stats={stats} isLoading={statsLoading} />

        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
          <TrendingLayout
            timeFrame={timeFrame}
            symbols={trendingSymbols}
            symbolsLoading={symbolsLoading}
            symbolsError={symbolsError}
            categories={categories}
            activities={activities}
            categoriesLoading={categoriesLoading}
            activitiesLoading={activitiesLoading}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default TrendingPage;
