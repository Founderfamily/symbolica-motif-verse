
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { CreateCollectionData } from '../../types/collections';
import { logger } from '@/services/logService';
import { COLLECTIONS_QUERY_KEYS } from '../queries/useCollectionsQuery';

export const useUpdateCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateCollectionData> }) =>
      collectionsService.updateCollection(id, updates),
    onSuccess: (success, { id }) => {
      if (success) {
        logger.info('Collection updated, invalidating cache', { collectionId: id });
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.featured });
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
