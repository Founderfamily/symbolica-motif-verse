
import { useState, useEffect } from 'react';
import { trendingService, TrendingSymbol, TrendingStats, TrendingCategory, RecentActivity } from '@/services/trendingService';

interface UseTrendingSymbolsOptions {
  timeFrame: 'day' | 'week' | 'month';
  limit?: number;
}

export const useTrendingSymbolsOptimized = ({ timeFrame, limit = 12 }: UseTrendingSymbolsOptions) => {
  const [data, setData] = useState<TrendingSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🔗 [useTrendingSymbolsOptimized] Loading symbols for timeFrame:', timeFrame);
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingSymbols(timeFrame, limit);
        console.log('✅ [useTrendingSymbolsOptimized] Loaded', result.length, 'symbols');
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingSymbolsOptimized] Error:', err);
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Timeout de sécurité
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingSymbolsOptimized] Timeout - setting empty data');
        setData([]);
        setIsLoading(false);
      }
    }, 5000);

    loadData();

    return () => clearTimeout(timeout);
  }, [timeFrame, limit]);

  return { data, isLoading, error };
};

export const useTrendingStatsOptimized = () => {
  const [data, setData] = useState<TrendingStats | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('📊 [useTrendingStatsOptimized] Loading stats');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingStats();
        console.log('✅ [useTrendingStatsOptimized] Stats loaded:', result);
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingStatsOptimized] Error:', err);
        setData({ 
          symbolsCount: 20, 
          contributionsCount: 0, 
          collectionsCount: 48, 
          newToday: 0 
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingStatsOptimized] Stats timeout - using fallback');
        setData({ 
          symbolsCount: 20, 
          contributionsCount: 0, 
          collectionsCount: 48, 
          newToday: 0 
        });
        setIsLoading(false);
      }
    }, 3000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};

export const useTrendingCategoriesOptimized = () => {
  const [data, setData] = useState<TrendingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🏷️ [useTrendingCategoriesOptimized] Loading categories');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingCategories();
        console.log('✅ [useTrendingCategoriesOptimized] Categories loaded:', result.length);
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingCategoriesOptimized] Error:', err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingCategoriesOptimized] Categories timeout');
        setData([]);
        setIsLoading(false);
      }
    }, 3000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};

export const useRecentActivityOptimized = () => {
  const [data, setData] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔔 [useRecentActivityOptimized] Loading activity');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getRecentActivity();
        console.log('✅ [useRecentActivityOptimized] Activity loaded:', result.length);
        setData(result);
      } catch (err) {
        console.error('❌ [useRecentActivityOptimized] Error:', err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useRecentActivityOptimized] Activity timeout');
        setData([]);
        setIsLoading(false);
      }
    }, 3000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};
