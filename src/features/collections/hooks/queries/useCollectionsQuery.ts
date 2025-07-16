
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
  logger.debug('[useCollectionsQuery] Hook initialized');
  
  const query = useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.collections,
    queryFn: async () => {
      logger.debug('[useCollectionsQuery] Starting query execution');
      const startTime = Date.now();
      
      try {
        const result = await collectionsService.getCollections();
        const executionTime = Date.now() - startTime;
        
        logger.debug('[useCollectionsQuery] Query successful', {
          executionTime: `${executionTime}ms`,
          count: result?.length || 0
        });
        
        // Always return an array, even if empty
        return Array.isArray(result) ? result : [];
        
      } catch (error) {
        const executionTime = Date.now() - startTime;
        logger.error('[useCollectionsQuery] Query failed', {
          error,
          executionTime: `${executionTime}ms`,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Let React Query handle the error
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      logger.debug(`[useCollectionsQuery] Retry attempt ${failureCount}`, error);
      return failureCount < 2; // Reduce retry attempts
    },
    retryDelay: attemptIndex => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 10000);
      logger.debug(`[useCollectionsQuery] Retry delay: ${delay}ms`);
      return delay;
    },
  });

  logger.debug('[useCollectionsQuery] React Query state', {
    status: query.status,
    hasData: !!query.data,
    dataLength: query.data?.length || 0,
    isError: query.isError
  });

  return query;
};
