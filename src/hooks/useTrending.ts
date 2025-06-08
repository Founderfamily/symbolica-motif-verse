
import { useQuery } from '@tanstack/react-query';
import { trendingService, TrendingSymbol, TrendingStats, TrendingCategory, RecentActivity } from '@/services/trendingService';

interface UseTrendingSymbolsOptions {
  timeFrame: 'day' | 'week' | 'month';
  limit?: number;
  enabled?: boolean;
}

export const useTrendingSymbols = ({ timeFrame, limit = 12, enabled = true }: UseTrendingSymbolsOptions) => {
  console.log('🔗 [useTrendingSymbols] Hook called with:', { timeFrame, limit, enabled });
  
  return useQuery({
    queryKey: ['trending-symbols', timeFrame, limit],
    queryFn: async () => {
      console.log('🚀 [useTrendingSymbols] Starting query...');
      const result = await trendingService.getTrendingSymbols(timeFrame, limit);
      console.log('📝 [useTrendingSymbols] Query completed:', result.length, 'symbols');
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    enabled,
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};

export const useTrendingStats = () => {
  console.log('📊 [useTrendingStats] Hook called');
  
  return useQuery({
    queryKey: ['trending-stats'],
    queryFn: async () => {
      console.log('🚀 [useTrendingStats] Starting query...');
      const result = await trendingService.getTrendingStats();
      console.log('📝 [useTrendingStats] Query completed:', result);
      return result;
    },
    staleTime: 60 * 1000, // 1 minute
    gcTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
    retryDelay: 500,
    refetchOnWindowFocus: false
  });
};

export const useTrendingCategories = () => {
  console.log('🏷️ [useTrendingCategories] Hook called');
  
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: async () => {
      console.log('🚀 [useTrendingCategories] Starting query...');
      const result = await trendingService.getTrendingCategories();
      console.log('📝 [useTrendingCategories] Query completed:', result.length, 'categories');
      return result;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false
  });
};

export const useRecentActivity = () => {
  console.log('🔔 [useRecentActivity] Hook called');
  
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: async () => {
      console.log('🚀 [useRecentActivity] Starting query...');
      const result = await trendingService.getRecentActivity();
      console.log('📝 [useRecentActivity] Query completed:', result.length, 'activities');
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 60 * 1000, // 1 minute
    retry: 1,
    refetchOnWindowFocus: false
  });
};
