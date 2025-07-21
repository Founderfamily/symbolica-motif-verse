import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectionSymbolWithTemporal } from '../types/collections';

export const useCollectionSymbols = (collectionId?: string) => {
  return useQuery<CollectionSymbolWithTemporal[]>({
    queryKey: ['collection-symbols', collectionId],
    queryFn: async () => {
      if (!collectionId) return [];

      const { data, error } = await supabase
        .rpc('get_collection_symbols_with_temporal_periods', {
          p_collection_id: collectionId
        });

      if (error) throw error;

      return data || [];
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};