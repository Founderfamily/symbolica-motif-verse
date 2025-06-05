
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '../services';
import { CreateCollectionData } from '../types/collections';
import { logger } from '@/services/logService';

// Clés de requête centralisées
const QUERY_KEYS = {
  collections: ['collections'] as const,
  featured: ['collections', 'featured'] as const,
  bySlug: (slug: string) => ['collections', 'slug', slug] as const,
} as const;

export const useCollections = () => {
  console.log('🎯 [useCollections] Hook initialization');
  
  const query = useQuery({
    queryKey: QUERY_KEYS.collections,
    queryFn: async () => {
      console.log('🚀 [useCollections] Début de queryFn...');
      const startTime = Date.now();
      
      try {
        const result = await collectionsService.getCollections();
        const executionTime = Date.now() - startTime;
        
        console.log('✅ [useCollections] queryFn SUCCESS!', {
          executionTime: `${executionTime}ms`,
          resultType: typeof result,
          isArray: Array.isArray(result),
          count: result?.length || 0,
          sample: result?.[0] || null,
          isValidArray: Array.isArray(result) && result.length >= 0
        });
        
        // Garantir que nous retournons toujours un tableau
        const finalResult = Array.isArray(result) ? result : [];
        console.log('📦 [useCollections] Résultat final garanti comme tableau:', finalResult.length);
        
        return finalResult;
        
      } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error('❌ [useCollections] queryFn ERROR!', {
          error,
          executionTime: `${executionTime}ms`,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack?.substring(0, 200) : 'No stack'
        });
        
        // Lancer l'erreur pour que React Query puisse la gérer
        throw error;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: (failureCount, error) => {
      console.log(`🔄 [useCollections] Retry attempt ${failureCount}:`, error);
      return failureCount < 3; // Retry jusqu'à 3 fois
    },
    retryDelay: attemptIndex => {
      const delay = Math.min(1000 * 2 ** attemptIndex, 30000);
      console.log(`⏰ [useCollections] Retry delay: ${delay}ms`);
      return delay;
    },
    initialData: [], // Garantir un tableau vide par défaut
  });

  // Debug complet du state React Query
  console.log('🔍 [useCollections] État React Query COMPLET:', {
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

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.featured,
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

export const useCollection = (slug: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.bySlug(slug),
    queryFn: () => collectionsService.getCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) => collectionsService.createCollection(data),
    onSuccess: (result) => {
      if (result) {
        logger.info('Collection created, invalidating cache');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featured });
      }
    },
    onError: (error) => {
      logger.error('Failed to create collection', { error });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateCollectionData> }) =>
      collectionsService.updateCollection(id, updates),
    onSuccess: (success, { id }) => {
      if (success) {
        logger.info('Collection updated, invalidating cache', { collectionId: id });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featured });
        queryClient.invalidateQueries({ 
          predicate: (query) => query.queryKey[0] === 'collections' && query.queryKey[1] === 'slug'
        });
      }
    },
    onError: (error) => {
      logger.error('Failed to update collection', { error });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: (success) => {
      if (success) {
        logger.info('Collection deleted, invalidating cache');
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.featured });
      }
    },
    onError: (error) => {
      logger.error('Failed to delete collection', { error });
    },
  });
};

export const useUpdateSymbolsOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, symbolIds }: { collectionId: string; symbolIds: string[] }) =>
      collectionsService.updateSymbolsOrder(collectionId, symbolIds),
    onSuccess: (success, { collectionId }) => {
      if (success) {
        logger.info('Symbols order updated, invalidating cache', { collectionId });
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            return query.queryKey[0] === 'collections' && 
                   query.queryKey[1] === 'slug';
          }
        });
      }
    },
    onError: (error) => {
      logger.error('Failed to update symbols order', { error });
    },
  });
};
