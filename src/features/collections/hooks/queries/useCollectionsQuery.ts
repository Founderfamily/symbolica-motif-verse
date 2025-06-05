
import { useQuery } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { logger } from '@/services/logService';

// Centralized query keys
export const COLLECTIONS_QUERY_KEYS = {
  collections: ['collections'] as const,
  featured: ['collections', 'featured'] as const,
  bySlug: (slug: string) => ['collections', 'slug', slug] as const,
} as const;

export const useCollectionsQuery = () => {
  console.log('🎯 [useCollectionsQuery] Hook initialization');
  
  const query = useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.collections,
    queryFn: async () => {
      console.log('🚀 [useCollectionsQuery] Début de queryFn...');
      const startTime = Date.now();
      
      try {
        const result = await collectionsService.getCollections();
        const executionTime = Date.now() - startTime;
        
        console.log('✅ [useCollectionsQuery] queryFn SUCCESS!', {
          executionTime: `${executionTime}ms`,
          resultType: typeof result,
          isArray: Array.isArray(result),
          count: result?.length || 0,
          sample: result?.[0] || null,
          isValidArray: Array.isArray(result) && result.length >= 0
        });
        
        // Garantir que nous retournons toujours un tableau
        const finalResult = Array.isArray(result) ? result : [];
        console.log('📦 [useCollectionsQuery] Résultat final garanti comme tableau:', finalResult.length);
        
        return finalResult;
        
      } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error('❌ [useCollectionsQuery] queryFn ERROR!', {
          error,
          executionTime: `${executionTime}ms`,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack?.substring(0, 200) : 'No stack'
        });
        
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 [useCollectionsQuery] Retry attempt ${failureCount}:`, error);
      return failureCount < 3;
    },
    retryDelay: attemptIndex => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
      console.log(`⏰ [useCollectionsQuery] Retry delay: ${delay}ms`);
      return delay;
    },
    initialData: [],
  });

  // Debug complet du state React Query
  console.log('🔍 [useCollectionsQuery] État React Query COMPLET:', {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isPending: query.isPending,
    error: query.error ? {
      message: query.error.message,
      name: query.error.name
    } : null,
    dataInfo: {
      type: typeof query.data,
      isArray: Array.isArray(query.data),
      length: query.data?.length || 0,
      isNull: query.data === null,
      isUndefined: query.data === undefined
    },
    queryMeta: {
      dataUpdatedAt: query.dataUpdatedAt,
      errorUpdatedAt: query.errorUpdatedAt,
      failureCount: query.failureCount,
      failureReason: query.failureReason?.message
    }
  });

  return query;
};
