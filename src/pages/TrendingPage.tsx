
import React, { useState, useEffect } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TrendingStatsCards } from '@/components/trending/TrendingStatsCards';
import { TrendingHeader } from '@/components/trending/TrendingHeader';
import { TrendingLayout } from '@/components/trending/TrendingLayout';
import { useTrendingSymbols, useTrendingStats, useTrendingCategories, useRecentActivity } from '@/hooks/useTrending';

const TrendingPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  console.log('🎯 [TrendingPage] Component rendering with timeFrame:', timeFrame);

  // Hooks with detailed logging
  const symbolsQuery = useTrendingSymbols({
    timeFrame,
    limit: 12
  });

  const statsQuery = useTrendingStats();
  const categoriesQuery = useTrendingCategories();
  const activitiesQuery = useRecentActivity();

  // Log all query states
  useEffect(() => {
    console.log('🔍 [TrendingPage] Query states:', {
      symbols: {
        isLoading: symbolsQuery.isLoading,
        isFetching: symbolsQuery.isFetching,
        error: symbolsQuery.error?.message,
        dataLength: symbolsQuery.data?.length,
        status: symbolsQuery.status
      },
      stats: {
        isLoading: statsQuery.isLoading,
        isFetching: statsQuery.isFetching,
        error: statsQuery.error?.message,
        data: statsQuery.data,
        status: statsQuery.status
      },
      categories: {
        isLoading: categoriesQuery.isLoading,
        isFetching: categoriesQuery.isFetching,
        error: categoriesQuery.error?.message,
        dataLength: categoriesQuery.data?.length,
        status: categoriesQuery.status
      },
      activities: {
        isLoading: activitiesQuery.isLoading,
        isFetching: activitiesQuery.isFetching,
        error: activitiesQuery.error?.message,
        dataLength: activitiesQuery.data?.length,
        status: activitiesQuery.status
      }
    });
  }, [
    symbolsQuery.isLoading, symbolsQuery.isFetching, symbolsQuery.error, symbolsQuery.data,
    statsQuery.isLoading, statsQuery.isFetching, statsQuery.error, statsQuery.data,
    categoriesQuery.isLoading, categoriesQuery.isFetching, categoriesQuery.error, categoriesQuery.data,
    activitiesQuery.isLoading, activitiesQuery.isFetching, activitiesQuery.error, activitiesQuery.data
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <TrendingHeader />
        
        <TrendingStatsCards stats={statsQuery.data} isLoading={statsQuery.isLoading} />

        <Tabs value={timeFrame} onValueChange={(value) => {
          console.log('🔄 [TrendingPage] Changing timeFrame to:', value);
          setTimeFrame(value as any);
        }}>
          <TrendingLayout
            timeFrame={timeFrame}
            symbols={symbolsQuery.data}
            symbolsLoading={symbolsQuery.isLoading}
            symbolsError={symbolsQuery.error}
            categories={categoriesQuery.data || []}
            activities={activitiesQuery.data || []}
            categoriesLoading={categoriesQuery.isLoading}
            activitiesLoading={activitiesQuery.isLoading}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default TrendingPage;
