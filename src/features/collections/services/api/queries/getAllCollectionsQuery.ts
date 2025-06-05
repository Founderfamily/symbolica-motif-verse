
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service for fetching all collections with translations
 */
export class GetAllCollectionsQuery {
  /**
   * Récupère toutes les collections avec leurs traductions - VERSION DIAGNOSTIQUE RENFORCÉE
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    console.log('🚀 [GetAllCollectionsQuery] DÉBUT de getCollections()');
    
    try {
      // Test de connexion Supabase
      console.log('🔗 [GetAllCollectionsQuery] Test de connexion Supabase...');
      const { data: testConnection } = await supabase.from('collections').select('count', { count: 'exact' });
      console.log('📊 [GetAllCollectionsQuery] Connexion OK - Nombre total de collections:', testConnection);

      const startTime = Date.now();
      console.log('🔍 [GetAllCollectionsQuery] Exécution de la requête principale...');
      
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_translations (*)
        `)
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ [GetAllCollectionsQuery] Requête terminée en ${queryTime}ms`);

      // Diagnostic d'erreur approfondi
      if (error) {
        console.error('❌ [GetAllCollectionsQuery] ERREUR SUPABASE DÉTAILLÉE:', {
          error,
          code: error.code,
          details: error.details,
          hint: error.hint,
          message: error.message
        });
        
        logger.error('Supabase collections query failed', { 
          error,
          queryTime,
          timestamp: new Date().toISOString()
        });
        
        // Retourner un tableau vide au lieu de lancer l'erreur
        console.warn('⚠️ [GetAllCollectionsQuery] Retour tableau vide à cause de l\'erreur');
        return [];
      }
      
      // Analyse très détaillée des données reçues
      console.log('📊 [GetAllCollectionsQuery] ANALYSE DÉTAILLÉE des données reçues:', {
        totalRows: data?.length || 0,
        dataType: typeof data,
        isArray: Array.isArray(data),
        isNull: data === null,
        isUndefined: data === undefined,
        rawDataSample: data?.slice(0, 2) || null,
        queryTime: `${queryTime}ms`
      });

      // Analyse de chaque collection individuellement
      if (data && Array.isArray(data)) {
        data.forEach((collection, index) => {
          console.log(`📝 [GetAllCollectionsQuery] Collection ${index + 1}:`, {
            id: collection?.id,
            slug: collection?.slug,
            is_featured: collection?.is_featured,
            translationsCount: collection?.collection_translations?.length || 0,
            translationsRaw: collection?.collection_translations,
            hasValidTranslations: Array.isArray(collection?.collection_translations) && collection.collection_translations.length > 0
          });
        });
      }
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ [GetAllCollectionsQuery] Données invalides ou nulles reçues de Supabase');
        return [];
      }
      
      // Transformation avec validation renforcée
      const transformedData: CollectionWithTranslations[] = data
        .filter(collection => {
          if (!collection) {
            console.warn('⚠️ [GetAllCollectionsQuery] Collection null/undefined filtrée');
            return false;
          }
          if (!collection.slug) {
            console.warn('⚠️ [GetAllCollectionsQuery] Collection sans slug filtrée:', collection.id);
            return false;
          }
          return true;
        })
        .map(collection => {
          const result = {
            ...collection,
            collection_translations: Array.isArray(collection.collection_translations) 
              ? collection.collection_translations 
              : []
          };
          
          console.log(`✅ [GetAllCollectionsQuery] Collection transformée avec succès:`, {
            id: result.id,
            slug: result.slug,
            is_featured: result.is_featured,
            translationsCount: result.collection_translations.length,
            validTranslations: result.collection_translations.filter(t => t.title && t.title.trim()).length
          });
          
          return result;
        });
      
      console.log('✅ [GetAllCollectionsQuery] SUCCÈS FINAL:', {
        collectionsTransformées: transformedData.length,
        collectionsAvecTraductions: transformedData.filter(c => c.collection_translations.length > 0).length,
        collectionsEnVedette: transformedData.filter(c => c.is_featured).length,
        échantillon: transformedData.slice(0, 1).map(c => ({
          slug: c.slug,
          translations: c.collection_translations.map(t => `${t.language}: ${t.title}`)
        }))
      });
      
      return transformedData;
      
    } catch (error) {
      console.error('❌ [GetAllCollectionsQuery] ERREUR CRITIQUE dans getCollections:', {
        error,
        stack: error instanceof Error ? error.stack : 'No stack trace',
        timestamp: new Date().toISOString()
      });
      
      logger.error('Critical error fetching collections', { 
        error,
        timestamp: new Date().toISOString()
      });
      
      // Retourner un tableau vide même en cas d'erreur critique
      return [];
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
