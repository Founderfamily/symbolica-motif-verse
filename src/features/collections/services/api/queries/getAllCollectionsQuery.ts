
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service for fetching all collections with translations - VERSION SIMPLIFIÉE
 */
export class GetAllCollectionsQuery {
  /**
   * Récupère toutes les collections avec leurs traductions
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    console.log('🚀 [GetAllCollectionsQuery] DÉBUT - Version simplifiée');
    console.log('🌍 [GetAllCollectionsQuery] Browser:', navigator.userAgent);
    console.log('🔧 [GetAllCollectionsQuery] Supabase client status:', !!supabase);
    
    try {
      // ÉTAPE 1: Récupérer toutes les collections
      console.log('📊 [GetAllCollectionsQuery] Étape 1 - Récupération des collections...');
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (collectionsError) {
        console.error('❌ [GetAllCollectionsQuery] ERREUR collections:', collectionsError);
        console.error('❌ [GetAllCollectionsQuery] ERREUR détails:', {
          message: collectionsError.message,
          details: collectionsError.details,
          hint: collectionsError.hint,
          code: collectionsError.code
        });
        throw collectionsError;
      }

      console.log('✅ [GetAllCollectionsQuery] Collections récupérées:', collectionsData?.length || 0);
      console.log('📄 [GetAllCollectionsQuery] Première collection:', collectionsData?.[0]);

      if (!collectionsData || collectionsData.length === 0) {
        console.log('⚠️ [GetAllCollectionsQuery] Aucune collection trouvée');
        return [];
      }

      // ÉTAPE 2: Récupérer toutes les traductions
      console.log('🌍 [GetAllCollectionsQuery] Étape 2 - Récupération des traductions...');
      const { data: translationsData, error: translationsError } = await supabase
        .from('collection_translations')
        .select('*');

      if (translationsError) {
        console.error('❌ [GetAllCollectionsQuery] ERREUR traductions:', translationsError);
        // Continue même si les traductions échouent
      }

      console.log('✅ [GetAllCollectionsQuery] Traductions récupérées:', translationsData?.length || 0);
      console.log('📄 [GetAllCollectionsQuery] Première traduction:', translationsData?.[0]);

      // ÉTAPE 3: Mapper les collections avec leurs traductions
      const collectionsWithTranslations: CollectionWithTranslations[] = collectionsData.map(collection => {
        const collectionTranslations = translationsData?.filter(
          translation => translation.collection_id === collection.id
        ) || [];

        console.log(`🔗 [GetAllCollectionsQuery] Collection ${collection.id}:`, {
          slug: collection.slug,
          is_featured: collection.is_featured,
          translationsCount: collectionTranslations.length
        });

        return {
          ...collection,
          collection_translations: collectionTranslations
        };
      });

      console.log('🎉 [GetAllCollectionsQuery] SUCCÈS FINAL:', {
        totalCollections: collectionsWithTranslations.length,
        collectionsWithTranslations: collectionsWithTranslations.filter(c => c.collection_translations.length > 0).length,
        collectionsWithoutTranslations: collectionsWithTranslations.filter(c => c.collection_translations.length === 0).length,
        featuredCollections: collectionsWithTranslations.filter(c => c.is_featured).length,
        browser: navigator.userAgent.includes('Safari') ? 'Safari' : 'Chrome'
      });

      return collectionsWithTranslations;

    } catch (error) {
      console.error('💥 [GetAllCollectionsQuery] ERREUR CRITIQUE:', error);
      console.error('💥 [GetAllCollectionsQuery] Error type:', typeof error);
      console.error('💥 [GetAllCollectionsQuery] Error constructor:', error?.constructor?.name);
      console.error('💥 [GetAllCollectionsQuery] Browser context:', {
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
      logger.error('Critical error in getAllCollectionsQuery', { error });
      throw error;
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
