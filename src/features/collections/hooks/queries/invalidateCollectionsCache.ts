import { useQueryClient } from '@tanstack/react-query';
import { COLLECTIONS_QUERY_KEYS } from './useCollectionsQuery';

/**
 * Hook to invalidate all collections cache after database restructuring
 */
export const useInvalidateCollectionsCache = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    // Invalidate all collections related queries
    queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.collections });
    queryClient.invalidateQueries({ queryKey: COLLECTIONS_QUERY_KEYS.featured });
    queryClient.invalidateQueries({ queryKey: ['collections'] });
    queryClient.invalidateQueries({ queryKey: ['collection'] });
    
    // Clear any cached collections data
    queryClient.removeQueries({ queryKey: COLLECTIONS_QUERY_KEYS.collections });
    queryClient.removeQueries({ queryKey: COLLECTIONS_QUERY_KEYS.featured });
    queryClient.removeQueries({ queryKey: ['collections'] });
    
    console.log('Collections cache invalidated after database restructuring');
  };

  return { invalidateAll };
};