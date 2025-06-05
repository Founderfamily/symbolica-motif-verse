
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { InterestGroup } from '@/types/interest-groups';

interface CommunityCache {
  prefetchGroup: (groupId: string) => void;
  invalidateGroups: () => void;
  getCachedGroup: (groupId: string) => InterestGroup | undefined;
  setCachedGroup: (group: InterestGroup) => void;
}

export const useCommunityCache = (): CommunityCache => {
  const queryClient = useQueryClient();

  const prefetchGroup = useCallback(async (groupId: string) => {
    await queryClient.prefetchQuery({
      queryKey: ['group', groupId],
      queryFn: async () => {
        // This would be implemented with your group detail service
        console.log('Prefetching group:', groupId);
        return null;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }, [queryClient]);

  const invalidateGroups = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['groups'] });
  }, [queryClient]);

  const getCachedGroup = useCallback((groupId: string): InterestGroup | undefined => {
    return queryClient.getQueryData(['group', groupId]);
  }, [queryClient]);

  const setCachedGroup = useCallback((group: InterestGroup) => {
    queryClient.setQueryData(['group', group.id], group);
  }, [queryClient]);

  return {
    prefetchGroup,
    invalidateGroups,
    getCachedGroup,
    setCachedGroup,
  };
};
