
import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collectionsService';
import { CollectionWithTranslations } from '@/types/collections';

export const useOptimizedCollections = () => {
  const queryClient = useQueryClient();

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: collectionsService.getCollections,
    staleTime: 15 * 60 * 1000, // 15 minutes - augmenté pour Phase 2
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Prefetch des collections populaires
  const prefetchFeatured = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['collections', 'featured'],
      queryFn: collectionsService.getFeaturedCollections,
      staleTime: 15 * 60 * 1000,
    });
  }, [queryClient]);

  // Cache intelligent avec persistance locale
  const getCachedCollections = useCallback((): CollectionWithTranslations[] | undefined => {
    const cached = queryClient.getQueryData<CollectionWithTranslations[]>(['collections']);
    if (cached) {
      // Sauvegarder en localStorage pour persistance
      localStorage.setItem('collections_cache', JSON.stringify({
        data: cached,
        timestamp: Date.now()
      }));
    }
    return cached;
  }, [queryClient]);

  // Récupération du cache local en cas d'échec réseau
  const getLocalCache = useCallback((): CollectionWithTranslations[] | null => {
    try {
      const cached = localStorage.getItem('collections_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valide pendant 1 heure
        if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Failed to parse local cache:', error);
    }
    return null;
  }, []);

  const optimizedCollections = useMemo(() => {
    return collections || getCachedCollections() || getLocalCache() || [];
  }, [collections, getCachedCollections, getLocalCache]);

  return {
    collections: optimizedCollections,
    isLoading,
    error,
    prefetchFeatured,
    getCachedCollections,
  };
};
