
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

      // Transformer les données pour correspondre au type CollectionWithTranslations
      return (data || []).map(collection => ({
        ...collection,
        translations: collection.collection_translations.reduce((acc, trans) => {
          acc[trans.language as 'en' | 'fr'] = {
            title: trans.title,
            description: trans.description
          };
          return acc;
        }, {} as Record<'en' | 'fr', { title: string; description: string | null }>)
      }));
    },
    enabled: !!symbolId
  });
};
