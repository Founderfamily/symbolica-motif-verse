import { useQuery } from '@tanstack/react-query';
import { getGroupBySlug } from '@/services/interestGroupService';

export const useGroupBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['interest-group', slug],
    queryFn: () => getGroupBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};