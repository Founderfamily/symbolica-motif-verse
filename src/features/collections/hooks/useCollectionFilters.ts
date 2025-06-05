
import { useState, useMemo } from 'react';
import { CollectionWithTranslations } from '../types/collections';

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'featured-first';
export type FilterCategory = 'all' | 'cultures' | 'periods' | 'sciences' | 'others';
export type FilterStatus = 'all' | 'featured' | 'regular';

interface UseCollectionFiltersProps {
  collections: any[]; // Union type from CollectionCategories
}

export const useCollectionFilters = ({ collections }: UseCollectionFiltersProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured-first');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedCollections = useMemo(() => {
    let result = [...collections];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(collection => {
        const title = 'title' in collection && typeof collection.title === 'string' 
          ? collection.title 
          : collection.collection_translations?.find((t: any) => t.title)?.title || '';
        return title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      if (filterStatus === 'featured') {
        result = result.filter(collection => collection.is_featured);
      } else if (filterStatus === 'regular') {
        result = result.filter(collection => !collection.is_featured);
      }
    }

    // Filter by category (basic implementation based on slug patterns)
    if (filterCategory !== 'all') {
      result = result.filter(collection => {
        const slug = collection.slug || '';
        switch (filterCategory) {
          case 'cultures':
            return slug.includes('culture') || slug.includes('mythologie') || slug.includes('religieux');
          case 'periods':
            return slug.includes('ancien') || slug.includes('ere') || slug.includes('moderne');
          case 'sciences':
            return slug.includes('geometrie') || slug.includes('alchimie') || slug.includes('esoterisme');
          default:
            return true;
        }
      });
    }

    // Sort collections
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': {
          const titleA = 'title' in a && typeof a.title === 'string' 
            ? a.title 
            : a.collection_translations?.find((t: any) => t.title)?.title || '';
          const titleB = 'title' in b && typeof b.title === 'string' 
            ? b.title 
            : b.collection_translations?.find((t: any) => t.title)?.title || '';
          return titleA.localeCompare(titleB);
        }
        case 'name-desc': {
          const titleA = 'title' in a && typeof a.title === 'string' 
            ? a.title 
            : a.collection_translations?.find((t: any) => t.title)?.title || '';
          const titleB = 'title' in b && typeof b.title === 'string' 
            ? b.title 
            : b.collection_translations?.find((t: any) => t.title)?.title || '';
          return titleB.localeCompare(titleA);
        }
        case 'date-asc':
          return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
        case 'date-desc':
          return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        case 'featured-first':
        default:
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
      }
    });

    return result;
  }, [collections, sortBy, filterCategory, filterStatus, searchQuery]);

  const resetFilters = () => {
    setSortBy('featured-first');
    setFilterCategory('all');
    setFilterStatus('all');
    setSearchQuery('');
  };

  return {
    sortBy,
    setSortBy,
    filterCategory,
    setFilterCategory,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    filteredAndSortedCollections,
    resetFilters,
    activeFiltersCount: [
      filterCategory !== 'all',
      filterStatus !== 'all',
      searchQuery !== ''
    ].filter(Boolean).length
  };
};
