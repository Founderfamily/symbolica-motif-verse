import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collectionsService';
import { CreateCollectionData } from '@/types/collections';
import { logger } from '@/services/logService';

// Clés de requête centralisées
const QUERY_KEYS = {
  collections: ['collections'] as const,
  featured: ['collections', 'featured'] as const,
  bySlug: (slug: string) => ['collections', 'slug', slug] as const,
} as const;

export const useCollections = () => {
  const query = useQuery({
    queryKey: QUERY_KEYS.collections,
    queryFn: async () => {
      console.log('🚀 useCollections: Starting fetch...');
      try {
        const result = await collectionsService.getCollections();
        console.log('✅ useCollections: Success!', {
          count: result?.length || 0,
          sample: result?.[0] || null
        });
        return result;
      } catch (error) {
        console.error('❌ useCollections: Error!', error);
        // Ne pas jeter l'erreur, retourner un tableau vide pour éviter le loading infini
        return [];
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Force une valeur par défaut pour éviter undefined
    placeholderData: [],
  });

  // Debug du state React Query
  console.log('🔍 useCollections state:', {
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error?.message,
    dataLength: query.data?.length || 0,
    status: query.status
  });

  return query;
};

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: QUERY_KEYS.featured,
    queryFn: collectionsService.getFeaturedCollections,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

export const useCollection = (slug: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.bySlug(slug),
    queryFn: () => collectionsService.getCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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
        // Invalider aussi la collection spécifique si on a son slug
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
        // Invalider seulement les requêtes qui incluent des détails de collection
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
