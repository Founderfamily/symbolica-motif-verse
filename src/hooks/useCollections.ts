
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collectionsService';
import { CreateCollectionData } from '@/types/collections';

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: collectionsService.getCollections,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['collections', 'featured'],
    queryFn: collectionsService.getFeaturedCollections,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const useCollection = (slug: string) => {
  return useQuery({
    queryKey: ['collections', slug],
    queryFn: () => collectionsService.getCollectionBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) => collectionsService.createCollection(data),
    onSuccess: () => {
      // More conservative invalidation to avoid conflicts
      queryClient.invalidateQueries({ queryKey: ['collections'], exact: true });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateCollectionData> }) =>
      collectionsService.updateCollection(id, updates),
    onSuccess: (_, { id }) => {
      // More targeted invalidation
      queryClient.invalidateQueries({ queryKey: ['collections'], exact: true });
      queryClient.invalidateQueries({ queryKey: ['collections', id], exact: true });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'], exact: true });
    },
  });
};

export const useUpdateSymbolsOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, symbolIds }: { collectionId: string; symbolIds: string[] }) =>
      collectionsService.updateSymbolsOrder(collectionId, symbolIds),
    onSuccess: (_, { collectionId }) => {
      // Conservative invalidation for specific collection only
      queryClient.invalidateQueries({ queryKey: ['collections', collectionId], exact: true });
    },
  });
};
