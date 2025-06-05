
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { CreateCollectionData } from '../../types/collections';
import { logger } from '@/services/logService';
import { COLLECTIONS_QUERY_KEYS } from '../queries/useCollectionsQuery';

export const useCreateCollectionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) => collectionsService.createCollection(data),
    onSuccess: (result) => {
      if (result) {
        logger.info('Collection created, invalidating cache');
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.collections });
        queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.featured });
      }
    },
    onError: (error) => {
      logger.error('Failed to create collection', { error });
    },
  });
};
