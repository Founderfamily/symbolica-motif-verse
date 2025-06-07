
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

      try {
        // Étape 1: Récupérer les IDs des collections qui contiennent ce symbole
        const { data: collectionSymbols, error: symbolsError } = await supabase
          .from('collection_symbols')
          .select('collection_id')
          .eq('symbol_id', queryId);

        console.log('9. collection_symbols query result:', collectionSymbols);
        console.log('10. collection_symbols error:', symbolsError);

        if (symbolsError) {
          console.error('Error fetching collection symbols:', symbolsError);
          throw symbolsError;
        }

        if (!collectionSymbols || collectionSymbols.length === 0) {
          console.log('11. Aucune collection trouvée pour ce symbole');
          return [];
        }

        const collectionIds = collectionSymbols.map(cs => cs.collection_id);
        console.log('12. Collection IDs trouvés:', collectionIds);

        // Étape 2: Récupérer les détails des collections
        const { data: collections, error: collectionsError } = await supabase
          .from('collections')
          .select(`
            id,
            slug,
            created_by,
            created_at,
            updated_at,
            is_featured
          `)
          .in('id', collectionIds);

        console.log('13. collections query result:', collections);
        console.log('14. collections error:', collectionsError);

        if (collectionsError) {
          console.error('Error fetching collections:', collectionsError);
          throw collectionsError;
        }

        if (!collections || collections.length === 0) {
          console.log('15. Aucune collection trouvée');
          return [];
        }

        // Étape 3: Récupérer les traductions pour ces collections
        const { data: translations, error: translationsError } = await supabase
          .from('collection_translations')
          .select(`
            id,
            collection_id,
            language,
            title,
            description
          `)
          .in('collection_id', collectionIds);

        console.log('16. translations query result:', translations);
        console.log('17. translations error:', translationsError);

        if (translationsError) {
          console.error('Error fetching translations:', translationsError);
          throw translationsError;
        }

        // Étape 4: Combiner les données
        const collectionsWithTranslations: CollectionWithTranslations[] = collections.map(collection => ({
          ...collection,
          collection_translations: translations?.filter(t => t.collection_id === collection.id) || []
        }));

        console.log('18. Résultat final:', collectionsWithTranslations);
        console.log('19. Nombre de collections avec traductions:', collectionsWithTranslations.length);
        console.log('=== FIN DEBUG useSymbolCollections ===');

        return collectionsWithTranslations;

      } catch (error) {
        console.error('Erreur générale dans useSymbolCollections:', error);
        throw error;
      }
    },
    enabled: !!symbolId
  });
};
