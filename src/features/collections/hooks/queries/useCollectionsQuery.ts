
import { useQuery } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { logger } from '@/utils/logger';

// Centralized query keys
export const COLLECTIONS_QUERY_KEYS = {
  collections: ['collections'] as const,
  featured: ['collections', 'featured'] as const,
  bySlug: (slug: string) => ['collections', 'slug', slug] as const,
} as const;

export const useCollectionsQuery = () => {
  const query = useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.collections,
    queryFn: async () => {
      try {
        const result = await collectionsService.getCollections();
        return Array.isArray(result) ? result : [];
      } catch (error) {
        logger.error('Collections query failed', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return query;
};
