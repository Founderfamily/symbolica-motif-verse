
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { logger } from '@/services/logService';

export const useUpdateSymbolsOrderMutation = () => {
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
