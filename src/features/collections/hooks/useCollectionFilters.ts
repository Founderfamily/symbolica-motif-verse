
import { useState, useMemo, useCallback } from 'react';
import { CollectionWithTranslations } from '../types/collections';

export type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'featured-first';
export type FilterCategory = 'all' | 'ancient' | 'asian' | 'european' | 'middle-eastern' | 'others';
export type FilterStatus = 'all' | 'featured' | 'regular';

interface UseCollectionFiltersProps {
  collections: CollectionWithTranslations[];
}

export const useCollectionFilters = ({ collections = [] }: UseCollectionFiltersProps) => {
  // Initialize with safe default values
  const [sortBy, setSortBy] = useState<SortOption>('featured-first');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Prevent unnecessary recalculations with stable references
  const resetFilters = useCallback(() => {
    setSortBy('featured-first');
    setFilterCategory('all');
    setFilterStatus('all');
    setSearchQuery('');
  }, []);

  // Apply filters with defensive coding to prevent errors
  const filteredAndSortedCollections = useMemo(() => {
    // Safety check for collections
    if (!Array.isArray(collections) || collections.length === 0) {
      return [];
    }

    console.log('🔍 [useCollectionFilters] Filtering and sorting', collections.length, 'collections');
    
    try {
      let result = [...collections];

      // Filter by search query
      if (searchQuery && searchQuery.trim() !== '') {
        result = result.filter(collection => {
          if (!collection) return false;
          
          const title = collection.collection_translations?.find((t: any) => t.title)?.title || '';
          const slug = collection.slug || '';
          const searchText = `${title} ${slug}`.toLowerCase();
          return searchText.includes(searchQuery.toLowerCase());
        });
      }

      // Filter by status
      if (filterStatus !== 'all') {
        result = result.filter(collection => {
          if (!collection) return false;
          
          if (filterStatus === 'featured') {
            return !!collection.is_featured;
          } else if (filterStatus === 'regular') {
            return !collection.is_featured;
          }
          return true;
        });
      }

      // Filter by category based on slug patterns
      if (filterCategory !== 'all') {
        const categoryMapping: Record<string, string[]> = {
          ancient: ['egypte', 'grece', 'rome', 'mesopotamie'],
          asian: ['chine', 'inde', 'japon', 'tibet'],
          european: ['celtique', 'nordique', 'viking', 'germanique'],
          'middle-eastern': ['arabe', 'islamique', 'perse', 'ottoman'],
          // Add an empty array for 'others' to avoid undefined errors
          others: []
        };
        
        const keywords = categoryMapping[filterCategory] || [];
        
        // For "others" category, show collections that don't match any defined category
        if (filterCategory === 'others') {
          // Combine all keywords from other categories
          const allDefinedKeywords = [
            ...categoryMapping.ancient,
            ...categoryMapping.asian,
            ...categoryMapping.european,
            ...categoryMapping['middle-eastern']
          ];
          
          result = result.filter(collection => {
            if (!collection || !collection.slug) return false;
            
            const slug = collection.slug.toLowerCase();
            // Return true if it doesn't match any defined category
            return !allDefinedKeywords.some(keyword => slug.includes(keyword));
          });
        } else {
          // For specific categories, filter by matching keywords
          result = result.filter(collection => {
            if (!collection || !collection.slug) return false;
            
            const slug = collection.slug.toLowerCase();
            return keywords.some(keyword => slug.includes(keyword));
          });
        }
      }

      // Sort collections with null checks
      result.sort((a, b) => {
        if (!a || !b) return 0;
        
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

      console.log('✅ [useCollectionFilters] Final result:', result.length, 'collections');
      return result;
    } catch (error) {
      console.error('❌ [useCollectionFilters] Error filtering collections:', error);
      return [];
    }
  }, [collections, sortBy, filterCategory, filterStatus, searchQuery]);

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return [
      filterCategory !== 'all',
      filterStatus !== 'all',
      !!searchQuery
    ].filter(Boolean).length;
  }, [filterCategory, filterStatus, searchQuery]);

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
    activeFiltersCount
  };
};
