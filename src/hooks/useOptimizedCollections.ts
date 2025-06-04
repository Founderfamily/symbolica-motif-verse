
import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collectionsService';
import { CollectionWithTranslations } from '@/types/collections';

export const useOptimizedCollections = () => {
  const queryClient = useQueryClient();

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      console.log('Fetching collections...');
      const result = await collectionsService.getCollections();
      console.log('Collections fetched:', result?.length || 0);
      return result;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
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

  // Cache intelligent avec persistance locale - CORRIGÉ
  const getCachedCollections = useCallback((): CollectionWithTranslations[] | undefined => {
    const cached = queryClient.getQueryData<CollectionWithTranslations[]>(['collections']);
    console.log('Cache check:', cached?.length || 0);
    
    if (cached && cached.length > 0) {
      // Sauvegarder en localStorage pour persistance seulement si on a des données
      try {
        localStorage.setItem('collections_cache', JSON.stringify({
          data: cached,
          timestamp: Date.now()
        }));
      } catch (error) {
        console.warn('Failed to save to localStorage:', error);
      }
    }
    return cached;
  }, [queryClient]);

  // Récupération du cache local en cas d'échec réseau - CORRIGÉ
  const getLocalCache = useCallback((): CollectionWithTranslations[] | null => {
    try {
      const cached = localStorage.getItem('collections_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        // Cache valide pendant 1 heure ET doit contenir des données
        if (Date.now() - parsed.timestamp < 60 * 60 * 1000 && parsed.data && parsed.data.length > 0) {
          console.log('Using local cache:', parsed.data.length);
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Failed to parse local cache:', error);
    }
    return null;
  }, []);

  // LOGIQUE CORRIGÉE : Ne pas retourner de tableau vide si on est en cours de chargement
  const optimizedCollections = useMemo(() => {
    console.log('Computing optimized collections:', {
      collections: collections?.length || 0,
      isLoading,
      error: !!error
    });

    // Si on a des données fraîches, les utiliser
    if (collections && collections.length > 0) {
      return collections;
    }

    // Si on est en cours de chargement, ne pas utiliser le cache pour éviter les états vides
    if (isLoading) {
      return undefined;
    }

    // Seulement si on a une erreur, essayer le cache
    if (error) {
      const cached = getCachedCollections();
      if (cached && cached.length > 0) {
        return cached;
      }
      
      const localCache = getLocalCache();
      if (localCache && localCache.length > 0) {
        return localCache;
      }
    }

    // Retourner les données même si elles sont vides (pour gérer l'état vide)
    return collections || [];
  }, [collections, isLoading, error, getCachedCollections, getLocalCache]);

  return {
    collections: optimizedCollections,
    isLoading,
    error,
    prefetchFeatured,
    getCachedCollections,
  };
};
