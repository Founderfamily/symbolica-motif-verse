import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { CollectionSymbolWithTemporal } from '../types/collections';

export const useCollectionSymbols = (collectionId?: string) => {
  return useQuery<CollectionSymbolWithTemporal[]>({
    queryKey: ['collection-symbols', collectionId],
    queryFn: async () => {
      if (!collectionId) return [];

      const { data, error } = await supabase
        .from('collection_symbols')
        .select(`
          position,
          symbols (
            id,
            name,
            description,
            culture,
            period,
            created_at,
            symbol_images!fk_symbol_images_symbol_id (
              image_url,
              is_primary
            )
          )
        `)
        .eq('collection_id', collectionId)
        .order('position');

      if (error) throw error;

      return data?.map(item => ({
        id: item.symbols.id,
        name: item.symbols.name,
        description: item.symbols.description || undefined,
        culture: item.symbols.culture,
        period: item.symbols.period,
        created_at: item.symbols.created_at,
        symbol_position: item.position,
        image_url: item.symbols.symbol_images?.find(img => img.is_primary)?.image_url || undefined,
        temporal_period_order: 999, // Temporaire, sera remplacé par la fonction RPC
        temporal_period_name: undefined,
        cultural_period_name: undefined
      })) || [];
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};