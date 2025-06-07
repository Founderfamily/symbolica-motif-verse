
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '@/types/collections';
import { symbolMappingService } from '@/services/symbolMappingService';

/**
 * Hook pour récupérer les collections associées à un symbole
 */
export const useSymbolCollections = (symbolId: string | number) => {
  return useQuery({
    queryKey: ['symbol-collections', symbolId],
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      if (!symbolId) return [];

      console.log('useSymbolCollections - symbolId reçu:', symbolId);

      // Déterminer l'ID à utiliser pour la requête
      let queryId: string | null = null;
      
      if (symbolMappingService.isStaticSymbol(symbolId)) {
        // Pour les symboles statiques, utiliser l'ID mappé en base
        queryId = symbolMappingService.getCollectionQueryId(symbolId);
        console.log('Symbole statique détecté, utilisation de l\'ID mappé:', queryId);
        
        if (!queryId) {
          console.log('Aucun mapping trouvé pour le symbole statique:', symbolId);
          return [];
        }
      } else {
        // Pour les symboles de la base, utiliser l'ID directement
        queryId = symbolId.toString();
        console.log('Symbole de base détecté, utilisation de l\'ID:', queryId);
      }

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
        .eq('collection_symbols.symbol_id', queryId);

      if (error) {
        console.error('Error fetching symbol collections:', error);
        throw error;
      }

      console.log('Collections trouvées pour le symbole:', data?.length || 0);
      return data || [];
    },
    enabled: !!symbolId
  });
};
