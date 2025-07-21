import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCollectionSymbols = (collectionId?: string) => {
  return useQuery({
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
        ...item.symbols,
        position: item.position,
        image_url: item.symbols.symbol_images?.find(img => img.is_primary)?.image_url || null
      })) || [];
    },
    enabled: !!collectionId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};