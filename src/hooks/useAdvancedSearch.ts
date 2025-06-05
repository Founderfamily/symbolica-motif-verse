
import { useState, useCallback, useMemo } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useQueryClient } from '@tanstack/react-query';

interface SearchCache {
  [key: string]: {
    results: any[];
    timestamp: number;
  };
}

interface UseAdvancedSearchProps {
  onSearch: (query: string) => void;
  debounceMs?: number;
  cacheTimeout?: number;
}

export const useAdvancedSearch = ({
  onSearch,
  debounceMs = 300,
  cacheTimeout = 5 * 60 * 1000 // 5 minutes
}: UseAdvancedSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Cache local pour les résultats de recherche
  const [searchCache, setSearchCache] = useState<SearchCache>({});

  const debouncedSearch = useDebounceCallback((query: string) => {
    if (query.trim()) {
      // Vérifier le cache d'abord
      const cached = searchCache[query];
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < cacheTimeout) {
        console.log('Using cached search results for:', query);
        return;
      }
    }
    
    onSearch(query);
    
    // Ajouter à l'historique
    if (query.trim() && !searchHistory.includes(query)) {
      setSearchHistory(prev => [query, ...prev.slice(0, 4)]); // Garder seulement les 5 dernières
    }
  }, debounceMs);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    onSearch('');
  }, [onSearch]);

  // Mise en cache des résultats
  const cacheResults = useCallback((query: string, results: any[]) => {
    setSearchCache(prev => ({
      ...prev,
      [query]: {
        results,
        timestamp: Date.now()
      }
    }));
  }, []);

  // Nettoyer le cache expiré
  const cleanExpiredCache = useCallback(() => {
    const now = Date.now();
    setSearchCache(prev => {
      const cleaned: SearchCache = {};
      Object.entries(prev).forEach(([key, value]) => {
        if (now - value.timestamp < cacheTimeout) {
          cleaned[key] = value;
        }
      });
      return cleaned;
    });
  }, [cacheTimeout]);

  // Précharger les suggestions populaires
  const prefetchPopularQueries = useCallback((queries: string[]) => {
    queries.forEach(query => {
      queryClient.prefetchQuery({
        queryKey: ['groups', 'search', query],
        staleTime: cacheTimeout
      });
    });
  }, [queryClient, cacheTimeout]);

  // Suggestions basées sur l'historique
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return searchHistory;
    
    return searchHistory.filter(item => 
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, searchHistory]);

  return {
    searchQuery,
    searchHistory,
    suggestions,
    handleSearchChange,
    clearSearch,
    cacheResults,
    cleanExpiredCache,
    prefetchPopularQueries
  };
};
