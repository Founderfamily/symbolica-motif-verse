
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service for fetching all collections with translations - VERSION CORRIGÉE
 */
export class GetAllCollectionsQuery {
  /**
   * Récupère toutes les collections avec leurs traductions
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    console.log('🚀 [GetAllCollectionsQuery] DÉBUT - Version corrigée pour jointure');
    
    try {
      // Test de base simple d'abord
      console.log('🔗 [GetAllCollectionsQuery] Test de connexion basique...');
      const { data: testData, error: testError } = await supabase
        .from('collections')
        .select('id, slug, is_featured')
        .limit(5);
      
      if (testError) {
        console.error('❌ [GetAllCollectionsQuery] ERREUR test basique:', testError);
        throw testError;
      }
      
      console.log('✅ [GetAllCollectionsQuery] Test basique OK:', testData?.length || 0, 'collections');

      // Requête principale avec LEFT JOIN au lieu de INNER JOIN
      const startTime = Date.now();
      console.log('🔍 [GetAllCollectionsQuery] Exécution requête principale avec LEFT JOIN...');
      
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          slug,
          is_featured,
          created_at,
          updated_at,
          created_by,
          collection_translations (
            id,
            collection_id,
            language,
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ [GetAllCollectionsQuery] Requête terminée en ${queryTime}ms`);

      // Gestion d'erreur stricte - NE PAS masquer les erreurs
      if (error) {
        console.error('❌ [GetAllCollectionsQuery] ERREUR SUPABASE:', error);
        logger.error('Collections query failed', { error, queryTime });
        throw new Error(`Supabase query failed: ${error.message}`);
      }
      
      console.log('📊 [GetAllCollectionsQuery] Données reçues:', {
        totalRows: data?.length || 0,
        dataType: typeof data,
        isArray: Array.isArray(data),
        sampleData: data?.[0] || null
      });

      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ [GetAllCollectionsQuery] Données nulles ou invalides');
        return [];
      }
      
      // Transformation avec validation stricte et gestion défensive des traductions
      const transformedData: CollectionWithTranslations[] = data
        .filter(collection => {
          const isValid = collection && collection.slug;
          if (!isValid) {
            console.warn('⚠️ [GetAllCollectionsQuery] Collection invalide filtrée:', collection?.id);
          }
          return isValid;
        })
        .map(collection => {
          // Gestion défensive : s'assurer qu'on a un tableau de traductions
          const translations = Array.isArray(collection.collection_translations) 
            ? collection.collection_translations 
            : [];
          
          const result = {
            ...collection,
            collection_translations: translations
          };
          
          console.log(`✅ [GetAllCollectionsQuery] Collection transformée:`, {
            id: result.id,
            slug: result.slug,
            is_featured: result.is_featured,
            translationsCount: result.collection_translations.length,
            hasTranslations: result.collection_translations.length > 0
          });
          
          return result;
        });
      
      console.log('🎉 [GetAllCollectionsQuery] SUCCÈS FINAL:', {
        collectionsTotal: transformedData.length,
        collectionsAvecTraductions: transformedData.filter(c => c.collection_translations.length > 0).length,
        collectionsSansTraductions: transformedData.filter(c => c.collection_translations.length === 0).length,
        collectionsEnVedette: transformedData.filter(c => c.is_featured).length
      });
      
      return transformedData;
      
    } catch (error) {
      console.error('💥 [GetAllCollectionsQuery] ERREUR CRITIQUE:', error);
      logger.error('Critical error in getAllCollectionsQuery', { error });
      
      // NE PAS retourner un tableau vide - propager l'erreur
      throw error;
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
