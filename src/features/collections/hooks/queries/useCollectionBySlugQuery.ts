
import { useQuery } from '@tanstack/react-query';
import { collectionsService } from '../../services';
import { COLLECTIONS_QUERY_KEYS } from './useCollectionsQuery';

export const useCollectionBySlugQuery = (slug: string) => {
  return useQuery({
    queryKey: COLLECTIONS_QUERY_KEYS.bySlug(slug),
    queryFn: () => collectionsService.getCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
