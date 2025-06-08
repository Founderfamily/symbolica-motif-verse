
import { useQuery } from '@tanstack/react-query';
import { communityStatsService, CommunityStats } from '@/services/communityStatsService';

export const useCommunityStats = () => {
  return useQuery({
    queryKey: ['community-stats'],
    queryFn: communityStatsService.getCommunityStats,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 15 * 60 * 1000, // Refresh every 15 minutes
    retry: 0, // No retries for faster UI
    refetchOnWindowFocus: false, // Reduce unnecessary requests
  });
};
