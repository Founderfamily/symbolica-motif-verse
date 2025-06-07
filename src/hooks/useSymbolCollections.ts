
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

      console.log('=== DEBUG useSymbolCollections ===');
      console.log('1. symbolId reçu:', symbolId, typeof symbolId);

      // Déterminer l'ID à utiliser pour la requête
      let queryId: string | null = null;
      const symbolIdStr = symbolId.toString();
      
      console.log('2. symbolIdStr:', symbolIdStr);
      console.log('3. isStaticSymbol test:', symbolMappingService.isStaticSymbol(symbolIdStr));
      
      if (symbolMappingService.isStaticSymbol(symbolIdStr)) {
        // Pour les symboles statiques, utiliser l'ID mappé en base
        queryId = symbolMappingService.getCollectionQueryId(symbolIdStr);
        console.log('4. Symbole statique détecté');
        console.log('5. ID mappé obtenu:', queryId);
        
        if (!queryId) {
          console.log('6. ERREUR: Aucun mapping trouvé pour le symbole statique:', symbolIdStr);
          console.log('7. Mappings disponibles:', Object.keys(symbolMappingService['staticToDbMapping'] || {}));
          return [];
        }
      } else {
        // Pour les symboles de la base, utiliser l'ID directement
        queryId = symbolIdStr;
        console.log('4. Symbole de base détecté, utilisation de l\'ID:', queryId);
      }

      console.log('8. ID final pour la requête:', queryId);

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

      console.log('9. Requête Supabase terminée');
      console.log('10. Error:', error);
      console.log('11. Data reçue:', data);
      console.log('12. Nombre de collections trouvées:', data?.length || 0);

      if (error) {
        console.error('Error fetching symbol collections:', error);
        throw error;
      }

      console.log('=== FIN DEBUG useSymbolCollections ===');
      return data || [];
    },
    enabled: !!symbolId
  });
};
