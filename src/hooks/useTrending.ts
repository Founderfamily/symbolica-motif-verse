
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
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 3 * 60 * 1000, // 3 minutes
    enabled,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // Timeout plus court pour éviter les boucles
    meta: {
      timeout: 10000 // 10 secondes
    }
  });
};

export const useTrendingStats = () => {
  return useQuery({
    queryKey: ['trending-stats'],
    queryFn: () => trendingService.getTrendingStats(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
    retry: 2,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 8000 // 8 secondes
    }
  });
};

export const useTrendingCategories = () => {
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: () => trendingService.getTrendingCategories(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 8000
    }
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => trendingService.getRecentActivity(),
    staleTime: 30 * 1000, // 30 secondes pour l'activité récente
    gcTime: 2 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
    meta: {
      timeout: 6000
    }
  });
};
