
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '@/types/collections';
import { symbolMappingService } from '@/services/symbolMappingService';

/**
 * Hook pour récupérer les collections associées à un symbole
 */
export const useSymbolCollections = (symbolId: string | number) => {
  return useQuery({
    queryKey: ['symbol-collections-v2', symbolId, Date.now()], // Version mise à jour avec timestamp pour forcer le refresh
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      if (!symbolId) return [];

      console.log('=== DEBUG useSymbolCollections v2 ===');
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
          return [];
        }
      } else {
        // Pour les symboles de la base, utiliser l'ID directement
        queryId = symbolIdStr;
        console.log('4. Symbole de base détecté, utilisation de l\'ID:', queryId);
      }

      console.log('8. ID final pour la requête:', queryId);

      try {
        // Utiliser la syntaxe native Supabase avec jointures imbriquées (comme dans les collections)
        const { data, error } = await supabase
          .from('collection_symbols')
          .select(`
            collection_id,
            collections (
              id,
              slug,
              created_by,
              created_at,
              updated_at,
              is_featured,
              collection_translations (
                id,
                collection_id,
                language,
                title,
                description
              )
            )
          `)
          .eq('symbol_id', queryId);

        console.log('9. Requête Supabase terminée');
        console.log('10. Error:', error);
        console.log('11. Data reçue:', data);
        console.log('12. Nombre de relations trouvées:', data?.length || 0);

        if (error) {
          console.error('Error fetching symbol collections:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('13. Aucune collection trouvée pour ce symbole');
          return [];
        }

        // Transformer les données pour correspondre au type attendu
        const collectionsWithTranslations: CollectionWithTranslations[] = data
          .filter(item => item.collections) // S'assurer que la collection existe
          .map(item => ({
            id: item.collections.id,
            slug: item.collections.slug,
            created_by: item.collections.created_by,
            created_at: item.collections.created_at,
            updated_at: item.collections.updated_at,
            is_featured: item.collections.is_featured,
            collection_translations: item.collections.collection_translations || []
          }));

        console.log('14. Résultat final:', collectionsWithTranslations);
        console.log('15. Nombre de collections avec traductions:', collectionsWithTranslations.length);
        console.log('=== FIN DEBUG useSymbolCollections ===');

        return collectionsWithTranslations;

      } catch (error) {
        console.error('Erreur générale dans useSymbolCollections:', error);
        throw error;
      }
    },
    enabled: !!symbolId,
    staleTime: 0, // Désactiver le cache pour debug
    cacheTime: 0, // Forcer la requête à chaque fois
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });
};
