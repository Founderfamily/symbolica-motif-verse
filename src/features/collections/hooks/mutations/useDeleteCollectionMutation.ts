
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { logger } from '@/services/logService';
import { COLLECTIONS_QUERY_KEYS } from '../queries/useCollectionsQuery';

export const useDeleteCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: (success) => {
      if (success) {
        logger.info('Collection deleted, invalidating cache');
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.featured });
      }
    },
    onError: (error) => {
      logger.error('Failed to delete collection', { error });
    },
  });
};
