
import { useState, useMemo } from 'react';
import { CollectionWithTranslations } from '../types/collections';

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'featured-first';
export type FilterCategory = 'all' | 'ancient' | 'asian' | 'european' | 'middle-eastern' | 'others';
export type FilterStatus = 'all' | 'featured' | 'regular';

interface UseCollectionFiltersProps {
  collections: CollectionWithTranslations[];
}

export const useCollectionFilters = ({ collections }: UseCollectionFiltersProps) => {
  const [sortBy, setSortBy] = useState<SortOption>('featured-first');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAndSortedCollections = useMemo(() => {
    console.log('🔍 [useCollectionFilters] Filtrage et tri de', collections?.length || 0, 'collections');
    
    if (!collections || collections.length === 0) {
      return [];
    }

    let result = [...collections];

    // Filter by search query
    if (searchQuery) {
      result = result.filter(collection => {
        const title = collection.collection_translations?.find((t: any) => t.title)?.title || '';
        const slug = collection.slug || '';
        const searchText = `${title} ${slug}`.toLowerCase();
        return searchText.includes(searchQuery.toLowerCase());
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

    // Filter by category based on slug patterns
    if (filterCategory !== 'all') {
      const categoryMapping = {
        ancient: ['egypte', 'grece', 'rome', 'mesopotamie'],
        asian: ['chine', 'inde', 'japon', 'tibet'],
        european: ['celtique', 'nordique', 'viking', 'germanique'],
        'middle-eastern': ['arabe', 'islamique', 'perse', 'ottoman']
      };
      
      const keywords = categoryMapping[filterCategory as keyof typeof categoryMapping] || [];
      result = result.filter(collection => {
        const slug = collection.slug?.toLowerCase() || '';
        return keywords.some(keyword => slug.includes(keyword));
      });
    }

    // Sort collections
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc': {
          const titleA = a.collection_translations?.find((t: any) => t.title)?.title || '';
          const titleB = b.collection_translations?.find((t: any) => t.title)?.title || '';
          return titleA.localeCompare(titleB);
        }
        case 'name-desc': {
          const titleA = a.collection_translations?.find((t: any) => t.title)?.title || '';
          const titleB = b.collection_translations?.find((t: any) => t.title)?.title || '';
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

    console.log('✅ [useCollectionFilters] Résultat final:', result.length, 'collections');
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
