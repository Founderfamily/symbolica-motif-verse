
import { useQuery } from '@tanstack/react-query';
import { getAllCollectionsQuery } from '../services/api/queries/getAllCollectionsQuery';
import { CollectionWithTranslations } from '../types/collections';

export const useCollections = () => {
  console.log('🎯 [useCollections] Hook appelé');
  
  return useQuery({
    queryKey: ['collections'],
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      console.log('🎯 [useCollections] Query function started');
      try {
        const result = await getAllCollectionsQuery.execute();
        console.log('🎯 [useCollections] Query function success:', result?.length || 0);
        return result;
      } catch (error) {
        console.error('🎯 [useCollections] Query function error:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      console.log('🎯 [useCollections] Retry attempt:', failureCount, error);
      return failureCount < 2;
    },
  });
};
