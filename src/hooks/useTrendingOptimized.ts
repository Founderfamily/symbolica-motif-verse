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

    // Always use fallback first for immediate UI response
    const fallbackData = [
      {
        id: '1',
        name: 'Triskèle Celtique',
        culture: 'Celtique',
        period: 'Antiquité',
        description: 'Symbole à trois branches représentant les trois mondes',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        trending_score: 95,
        view_count: 156,
        like_count: 34
      },
      {
        id: '2',
        name: 'Spirale Sacrée',
        culture: 'Universelle',
        period: 'Néolithique',
        description: 'Motif spiralé retrouvé dans de nombreuses cultures anciennes',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        trending_score: 87,
        view_count: 123,
        like_count: 28
      }
    ];

    // Set fallback data immediately
    setData(fallbackData);
    setIsLoading(false);

    // Try to load real data in background
    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingSymbols(timeFrame, limit);
        if (result.length > 0) {
          console.log('✅ [useTrendingSymbolsOptimized] Real data loaded, updating UI');
          setData(result);
        }
      } catch (err) {
        console.error('❌ [useTrendingSymbolsOptimized] Error loading real data:', err);
        setError(err as Error);
        // Keep fallback data
      }
    };

    // Load real data after a short delay to not block UI
    setTimeout(loadData, 100);
  }, [timeFrame, limit]);

  return { data, isLoading, error };
};

export const useTrendingStatsOptimized = () => {
  const [data, setData] = useState<TrendingStats>({ 
    symbolsCount: 20, 
    contributionsCount: 0, 
    collectionsCount: 48, 
    newToday: 0 
  });
  const [isLoading, setIsLoading] = useState(false); // Start as false for immediate display

  useEffect(() => {
    console.log('📊 [useTrendingStatsOptimized] Loading stats in background');

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingStats();
        console.log('✅ [useTrendingStatsOptimized] Stats loaded:', result);
        setData(result);
      } catch (err) {
        console.error('❌ [useTrendingStatsOptimized] Error loading stats:', err);
        // Keep default fallback data
      }
    };

    // Load data in background without blocking UI
    setTimeout(loadData, 200);
  }, []);

  return { data, isLoading };
};

export const useTrendingCategoriesOptimized = () => {
  const [data, setData] = useState<TrendingCategory[]>([
    { name: 'Celtique', count: 5, trend: 'up' },
    { name: 'Nordique', count: 4, trend: 'up' },
    { name: 'Grec', count: 3, trend: 'stable' },
    { name: 'Égyptien', count: 3, trend: 'up' },
    { name: 'Universel', count: 5, trend: 'stable' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🏷️ [useTrendingCategoriesOptimized] Loading categories in background');

    const loadData = async () => {
      try {
        const result = await trendingService.getTrendingCategories();
        if (result.length > 0) {
          console.log('✅ [useTrendingCategoriesOptimized] Categories loaded:', result.length);
          setData(result);
        }
      } catch (err) {
        console.error('❌ [useTrendingCategoriesOptimized] Error loading categories:', err);
        // Keep fallback data
      }
    };

    setTimeout(loadData, 300);
  }, []);

  return { data, isLoading };
};

export const useRecentActivityOptimized = () => {
  const [data, setData] = useState<RecentActivity[]>([
    { 
      type: 'symbol', 
      message: 'Exploration du symbole "Croix Celtique"', 
      timestamp: new Date(Date.now() - 15 * 60000).toISOString() 
    },
    { 
      type: 'collection', 
      message: 'Collection "Symboles Nordiques" mise à jour', 
      timestamp: new Date(Date.now() - 45 * 60000).toISOString() 
    },
    { 
      type: 'symbol', 
      message: 'Nouveau symbole "Runes Viking" découvert', 
      timestamp: new Date(Date.now() - 90 * 60000).toISOString() 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🔔 [useRecentActivityOptimized] Loading activity in background');

    const loadData = async () => {
      try {
        const result = await trendingService.getRecentActivity();
        if (result.length > 0) {
          console.log('✅ [useRecentActivityOptimized] Activity loaded:', result.length);
          setData(result);
        }
      } catch (err) {
        console.error('❌ [useRecentActivityOptimized] Error loading activity:', err);
        // Keep fallback data
      }
    };

    setTimeout(loadData, 400);
  }, []);

  return { data, isLoading };
};
