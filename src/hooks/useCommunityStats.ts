
import { useQuery } from '@tanstack/react-query';
import { communityStatsService, CommunityStats } from '@/services/communityStatsService';

export const useCommunityStats = () => {
  return useQuery({
    queryKey: ['community-stats'],
    queryFn: communityStatsService.getCommunityStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Actualiser toutes les 10 minutes
  });
};
