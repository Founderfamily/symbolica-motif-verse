
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '@/types/collections';

/**
 * Hook pour récupérer les collections associées à un symbole
 * Utilise maintenant une approche simplifiée basée sur les indices statiques
 */
export const useSymbolCollections = (symbolId: string | number) => {
  return useQuery({
    queryKey: ['symbol-collections-v3', symbolId], // Version mise à jour
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      if (!symbolId && symbolId !== 0) return [];

      console.log('=== DEBUG useSymbolCollections v3 (simplifié) ===');
      console.log('1. symbolId reçu:', symbolId, typeof symbolId);

      // Convertir en string pour la requête
      const queryId = symbolId.toString();
      console.log('2. ID pour la requête:', queryId);

      try {
        // Requête directe avec l'ID (qui est maintenant toujours l'index statique)
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

        console.log('3. Requête Supabase terminée');
        console.log('4. Error:', error);
        console.log('5. Data reçue:', data);
        console.log('6. Nombre de relations trouvées:', data?.length || 0);

        if (error) {
          console.error('Error fetching symbol collections:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('7. Aucune collection trouvée pour ce symbole');
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

        console.log('8. Résultat final:', collectionsWithTranslations);
        console.log('9. Nombre de collections avec traductions:', collectionsWithTranslations.length);
        console.log('=== FIN DEBUG useSymbolCollections ===');

        return collectionsWithTranslations;

      } catch (error) {
        console.error('Erreur générale dans useSymbolCollections:', error);
        throw error;
      }
    },
    enabled: (symbolId !== null && symbolId !== undefined),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
