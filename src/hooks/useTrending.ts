
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
    staleTime: 2 * 60 * 1000, // 2 minutes - plus court pour des données plus fraîches
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled,
    retry: 1, // Moins de tentatives pour éviter les boucles
    retryDelay: 2000,
    refetchOnWindowFocus: false, // Éviter les recharges automatiques
    refetchOnMount: false // Éviter les recharges au montage si on a déjà des données
  });
};

export const useTrendingStats = () => {
  return useQuery({
    queryKey: ['trending-stats'],
    queryFn: () => trendingService.getTrendingStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    retryDelay: 2000,
    refetchOnWindowFocus: false
  });
};

export const useTrendingCategories = () => {
  return useQuery({
    queryKey: ['trending-categories'],
    queryFn: () => trendingService.getTrendingCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });
};

export const useRecentActivity = () => {
  return useQuery({
    queryKey: ['recent-activity'],
    queryFn: () => trendingService.getRecentActivity(),
    staleTime: 1 * 60 * 1000, // 1 minute pour l'activité récente
    gcTime: 3 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false
  });
};
