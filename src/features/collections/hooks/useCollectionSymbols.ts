import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectionSymbolWithTemporal } from '../types/collections';

export const useCollectionSymbols = (collectionId?: string) => {
  return useQuery({
    queryKey: ['collection-symbols', collectionId],
    queryFn: async () => {
      if (!collectionId) return [];

      const { data, error } = await supabase
        .from('collection_symbols')
        .select(`
          symbol_id,
          symbols (
            id,
            name,
            description,
            culture,
            period,
            created_at
          )
        `)
        .eq('collection_id', collectionId);

      if (error) {
        console.error('Error fetching collection symbols:', error);
        throw error;
      }

      // Transformer les données pour correspondre au format attendu
      const symbols = (data || []).map((item: any, index: number) => ({
        id: item.symbols?.id || '',
        name: item.symbols?.name || '',
        description: item.symbols?.description || '',
        culture: item.symbols?.culture || '',
        period: item.symbols?.period || '',
        created_at: item.symbols?.created_at || '',
        symbol_position: index,
        temporal_period_order: index,
        temporal_period_name: item.symbols?.period || null,
        cultural_period_name: item.symbols?.culture || null
      }));

      console.log('🔍 useCollectionSymbols - fetched symbols:', symbols);
      return symbols;
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};