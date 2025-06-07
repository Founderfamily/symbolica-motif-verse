
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '@/types/collections';

/**
 * Hook pour récupérer les collections associées à un symbole
 */
export const useSymbolCollections = (symbolId: string | number) => {
  return useQuery({
    queryKey: ['symbol-collections', symbolId],
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      if (!symbolId) return [];

      // Convertir l'ID en string si c'est un nombre (pour les symboles statiques)
      const symbolIdStr = symbolId.toString();

      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          slug,
          created_by,
          created_at,
          updated_at,
          is_featured,
          collection_translations!inner (
            id,
            collection_id,
            language,
            title,
            description
          ),
          collection_symbols!inner (
            symbol_id
          )
        `)
        .eq('collection_symbols.symbol_id', symbolIdStr);

      if (error) {
        console.error('Error fetching symbol collections:', error);
        throw error;
      }

      // Return the data as-is since it already matches CollectionWithTranslations type
      return data || [];
    },
    enabled: !!symbolId
  });
};
