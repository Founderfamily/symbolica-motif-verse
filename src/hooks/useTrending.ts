
import { useQuery } from '@tanstack/react-query';
import { trendingService, TrendingSymbol, TrendingStats, TrendingCategory, RecentActivity } from '@/services/trendingService';

interface UseTrendingSymbolsOptions {
  timeFrame: 'day' | 'week' | 'month';
  limit?: number;
  enabled?: boolean;
}

export const useTrendingSymbols = ({ timeFrame, limit = 12, enabled = true }: UseTrendingSymbolsOptions) => {
  return useQuery({
    queryKey: ['trending-symbols', timeFrame, limit],
    queryFn: () => trendingService.getTrendingSymbols(timeFrame, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled,
    retry: 2,
    retryDelay: 1000
  });
};

export const useTrendingStats = () => {
  return useQuery({
    queryKey: ['trending-stats'],
    queryFn: () => trendingService.getTrendingStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: 1000
  });
};

export const useTrendingCategories = () => {
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: () => trendingService.getTrendingCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,
    retry: 1
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => trendingService.getRecentActivity(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    retry: 1
  });
};
