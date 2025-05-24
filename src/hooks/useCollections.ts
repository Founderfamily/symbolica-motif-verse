
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collectionsService';
import { CreateCollectionData } from '@/types/collections';

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: collectionsService.getCollections,
  });
};

export const useFeaturedCollections = () => {
  return useQuery({
    queryKey: ['collections', 'featured'],
    queryFn: collectionsService.getFeaturedCollections,
  });
};

export const useCollection = (slug: string) => {
  return useQuery({
    queryKey: ['collections', slug],
    queryFn: () => collectionsService.getCollectionBySlug(slug),
    enabled: !!slug,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionData) => collectionsService.createCollection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<CreateCollectionData> }) =>
      collectionsService.updateCollection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsService.deleteCollection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useUpdateSymbolsOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ collectionId, symbolIds }: { collectionId: string; symbolIds: string[] }) =>
      collectionsService.updateSymbolsOrder(collectionId, symbolIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};
