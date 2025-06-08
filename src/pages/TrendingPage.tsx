
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { TrendingStatsCards } from '@/components/trending/TrendingStatsCards';
import { TrendingHeader } from '@/components/trending/TrendingHeader';
import { TrendingLayout } from '@/components/trending/TrendingLayout';
import { 
  useTrendingSymbolsOptimized, 
  useTrendingStatsOptimized, 
  useTrendingCategoriesOptimized, 
  useRecentActivityOptimized 
} from '@/hooks/useTrendingOptimized';

const TrendingPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  console.log('🎯 [TrendingPage] Rendering with timeFrame:', timeFrame);

  // Hooks optimisés avec timeouts et fallbacks
  const symbolsQuery = useTrendingSymbolsOptimized({
    timeFrame,
    limit: 12
  });

  const statsQuery = useTrendingStatsOptimized();
  const categoriesQuery = useTrendingCategoriesOptimized();
  const activitiesQuery = useRecentActivityOptimized();

  // Log des états actuels
  console.log('🔍 [TrendingPage] Current states:', {
    symbols: { 
      isLoading: symbolsQuery.isLoading, 
      count: symbolsQuery.data?.length || 0,
      error: symbolsQuery.error?.message 
    },
    stats: { 
      isLoading: statsQuery.isLoading, 
      data: statsQuery.data 
    },
    categories: { 
      isLoading: categoriesQuery.isLoading, 
      count: categoriesQuery.data?.length || 0 
    },
    activities: { 
      isLoading: activitiesQuery.isLoading, 
      count: activitiesQuery.data?.length || 0 
    }
  });

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
