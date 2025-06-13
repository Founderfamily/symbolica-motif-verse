
import { useQuery } from '@tanstack/react-query';
import { platformStatsService } from '@/services/platformStatsService';

export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      console.log('🔍 [usePlatformStats] Fetching platform stats...');
      const stats = await platformStatsService.getPlatformStats();
      console.log('📊 [usePlatformStats] Stats received:', stats);
      return stats;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
