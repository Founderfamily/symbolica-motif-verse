
import { useQuery } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { COLLECTIONS_QUERY_KEYS } from './useCollectionsQuery';

export const useFeaturedCollectionsQuery = () => {
  return useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.featured,
    queryFn: async () => {
      const result = await collectionsService.getFeaturedCollections();
      return result || [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    initialData: [],
  });
};
