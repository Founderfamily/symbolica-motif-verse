
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '@/types/collections';

/**
 * Hook pour récupérer les collections associées à un symbole
 * Maintenant utilise directement les UUIDs Supabase
 */
export const useSymbolCollections = (symbolId: string | number) => {
  return useQuery({
    queryKey: ['symbol-collections-v4', symbolId], // Version mise à jour
    queryFn: async (): Promise<CollectionWithTranslations[]> => {
      if (!symbolId && symbolId !== 0) return [];

      console.log('=== DEBUG useSymbolCollections v4 (Supabase unifié) ===');
      console.log('1. symbolId reçu:', symbolId, typeof symbolId);

      // Convertir en string pour la requête (les UUIDs sont des strings)
      const queryId = symbolId.toString();
      console.log('2. ID pour la requête:', queryId);

      try {
        // Nouvelle approche: utiliser des requêtes séparées au lieu des relations cassées
        
        // 1. Récupérer les IDs des collections liées à ce symbole
        const { data: symbolCollectionLinks, error: linksError } = await supabase
          .from('collection_symbols')
          .select('collection_id')
          .eq('symbol_id', queryId);

        if (linksError) {
          console.error('Error fetching collection links:', linksError);
          throw linksError;
        }

        if (!symbolCollectionLinks || symbolCollectionLinks.length === 0) {
          console.log('7. Aucune collection trouvée pour ce symbole');
          return [];
        }

        const collectionIds = symbolCollectionLinks.map(link => link.collection_id);
        console.log('7. IDs des collections trouvées:', collectionIds);

        // 2. Récupérer les collections avec leurs traductions via la vue
        const { data: collectionsData, error: collectionsError } = await supabase
          .from('collections_with_symbols')
          .select('*')
          .in('id', collectionIds);

        if (collectionsError) {
          console.error('Error fetching collections data:', collectionsError);
          throw collectionsError;
        }

        // 3. Transformer les données pour correspondre au type attendu
        const collectionsWithTranslations: CollectionWithTranslations[] = (collectionsData || []).map(item => ({
          id: item.id,
          slug: item.slug,
          created_by: item.created_by,
          created_at: item.created_at,
          updated_at: item.updated_at,
          is_featured: item.is_featured,
          collection_translations: Array.isArray(item.collection_translations) 
            ? item.collection_translations as any[] 
            : []
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
