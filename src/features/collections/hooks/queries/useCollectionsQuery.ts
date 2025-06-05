
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
  console.log('🎯 [useCollectionsQuery] Hook démarré - Version corrigée');
  
  const query = useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.collections,
    queryFn: async () => {
      console.log('🚀 [useCollectionsQuery] Début queryFn...');
      const startTime = Date.now();
      
      try {
        const result = await collectionsService.getCollections();
        const executionTime = Date.now() - startTime;
        
        console.log('✅ [useCollectionsQuery] queryFn SUCCÈS!', {
          executionTime: `${executionTime}ms`,
          resultType: typeof result,
          isArray: Array.isArray(result),
          count: result?.length || 0
        });
        
        // Toujours retourner un tableau, même vide
        return Array.isArray(result) ? result : [];
        
      } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error('❌ [useCollectionsQuery] queryFn ERREUR!', {
          error,
          executionTime: `${executionTime}ms`,
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
        
        // Laisser React Query gérer l'erreur
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 [useCollectionsQuery] Tentative ${failureCount}:`, error);
      return failureCount < 2; // Réduire les tentatives
    },
    retryDelay: attemptIndex => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 10000);
      console.log(`⏰ [useCollectionsQuery] Délai retry: ${delay}ms`);
      return delay;
    },
    // Supprimer initialData pour forcer le fetch
  });

  // Debug détaillé de l'état React Query
  console.log('🔍 [useCollectionsQuery] État React Query:', {
    status: query.status,
    fetchStatus: query.fetchStatus,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    isSuccess: query.isSuccess,
    isPending: query.isPending,
    hasData: !!query.data,
    dataLength: query.data?.length || 0,
    error: query.error ? {
      message: query.error.message,
      name: query.error.name
    } : null
  });

  return query;
};
