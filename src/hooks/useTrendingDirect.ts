
import { useState, useEffect } from 'react';
import { trendingService, TrendingSymbol, TrendingStats, TrendingCategory, RecentActivity } from '@/services/trendingService';

interface UseTrendingSymbolsOptions {
  timeFrame: 'day' | 'week' | 'month';
  limit?: number;
}

export const useTrendingSymbolsDirect = ({ timeFrame, limit = 12 }: UseTrendingSymbolsOptions) => {
  const [data, setData] = useState<TrendingSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🔗 [useTrendingSymbolsDirect] Loading symbols for timeFrame:', timeFrame);
    setIsLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingSymbols(timeFrame, limit);
        console.log('✅ [useTrendingSymbolsDirect] Loaded', result.length, 'symbols');
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingSymbolsDirect] Error:', err);
        setError(err as Error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Timeout après 3 secondes maximum
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingSymbolsDirect] Timeout - setting empty data');
        setData([]);
        setIsLoading(false);
      }
    }, 3000);

    loadData();

    return () => clearTimeout(timeout);
  }, [timeFrame, limit]);

  return { data, isLoading, error };
};

export const useTrendingStatsDirect = () => {
  const [data, setData] = useState<TrendingStats | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('📊 [useTrendingStatsDirect] Loading stats');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingStats();
        console.log('✅ [useTrendingStatsDirect] Stats loaded:', result);
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingStatsDirect] Error:', err);
        // Fallback avec vraies données si échec
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

    // Timeout après 2 secondes
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingStatsDirect] Stats timeout - using fallback');
        setData({ 
          symbolsCount: 20, 
          contributionsCount: 0, 
          collectionsCount: 48, 
          newToday: 0 
        });
        setIsLoading(false);
      }
    }, 2000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};

export const useTrendingCategoriesDirect = () => {
  const [data, setData] = useState<TrendingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🏷️ [useTrendingCategoriesDirect] Loading categories');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingCategories();
        console.log('✅ [useTrendingCategoriesDirect] Categories loaded:', result.length);
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingCategoriesDirect] Error:', err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useTrendingCategoriesDirect] Categories timeout');
        setData([]);
        setIsLoading(false);
      }
    }, 2000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};

export const useRecentActivityDirect = () => {
  const [data, setData] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔔 [useRecentActivityDirect] Loading activity');
    setIsLoading(true);

    const loadData = async () => {
      try {
        const result = await trendingService.getRecentActivity();
        console.log('✅ [useRecentActivityDirect] Activity loaded:', result.length);
        setData(result);
      } catch (err) {
        console.error('❌ [useRecentActivityDirect] Error:', err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ [useRecentActivityDirect] Activity timeout');
        setData([]);
        setIsLoading(false);
      }
    }, 2000);

    loadData();

    return () => clearTimeout(timeout);
  }, []);

  return { data, isLoading };
};
