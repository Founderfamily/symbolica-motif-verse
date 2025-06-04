
import { useMemo } from 'react';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionCategories = (collections: CollectionWithTranslations[] | undefined) => {
  const categorizedCollections = useMemo(() => {
    if (!collections) {
      return {
        featured: [],
        cultures: [],
        periods: [],
        others: []
      };
    }

    const featured = collections.filter(c => c.is_featured);
    const cultures = collections.filter(c => c.slug.startsWith('culture-'));
    const periods = collections.filter(c => c.slug.startsWith('periode-'));
    const others = collections.filter(c => 
      !c.is_featured && 
      !c.slug.startsWith('culture-') && 
      !c.slug.startsWith('periode-')
    );

    return { featured, cultures, periods, others };
  }, [collections]);

  return categorizedCollections;
};
