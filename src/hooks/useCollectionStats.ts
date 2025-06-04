
import { useMemo } from 'react';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionStats = (collections: CollectionWithTranslations[] | undefined) => {
  const stats = useMemo(() => {
    if (!collections) {
      return {
        total: 0,
        featured: 0,
        cultures: 0,
        periods: 0,
        others: 0
      };
    }

    const total = collections.length;
    const featured = collections.filter(c => c.is_featured).length;
    const cultures = collections.filter(c => c.slug.startsWith('culture-')).length;
    const periods = collections.filter(c => c.slug.startsWith('periode-')).length;
    const others = collections.filter(c => 
      !c.is_featured && 
      !c.slug.startsWith('culture-') && 
      !c.slug.startsWith('periode-')
    ).length;

    return { total, featured, cultures, periods, others };
  }, [collections]);

  return stats;
};
