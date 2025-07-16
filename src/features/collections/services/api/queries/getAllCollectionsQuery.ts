
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/utils/logger';

/**
 * Query service for fetching all collections with translations - VERSION SIMPLIFIÉE
 */
export class GetAllCollectionsQuery {
  /**
   * Récupère toutes les collections avec leurs traductions
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    logger.debug('[GetAllCollectionsQuery] Starting query execution');
    
    try {
      // STEP 1: Fetch all collections
      logger.debug('[GetAllCollectionsQuery] Fetching collections...');
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (collectionsError) {
        logger.error('[GetAllCollectionsQuery] Collections fetch error', {
          message: collectionsError.message,
          code: collectionsError.code
        });
        throw collectionsError;
      }

      logger.debug('[GetAllCollectionsQuery] Collections fetched', {
        count: collectionsData?.length || 0
      });

      if (!collectionsData || collectionsData.length === 0) {
        logger.info('[GetAllCollectionsQuery] No collections found');
        return [];
      }

      // STEP 2: Fetch all translations
      logger.debug('[GetAllCollectionsQuery] Fetching translations...');
      const { data: translationsData, error: translationsError } = await supabase
        .from('collection_translations')
        .select('*');

      if (translationsError) {
        logger.warn('[GetAllCollectionsQuery] Translations fetch error', translationsError);
        // Continue even if translations fail
      }

      logger.debug('[GetAllCollectionsQuery] Translations fetched', {
        count: translationsData?.length || 0
      });

      // STEP 3: Map collections with their translations
      const collectionsWithTranslations: CollectionWithTranslations[] = collectionsData.map(collection => {
        const collectionTranslations = translationsData?.filter(
          translation => translation.collection_id === collection.id
        ) || [];

        logger.debug(`[GetAllCollectionsQuery] Mapping collection ${collection.slug}`, {
          translationsCount: collectionTranslations.length
        });

        return {
          ...collection,
          collection_translations: collectionTranslations
        };
      });

      logger.debug('[GetAllCollectionsQuery] Query completed successfully', {
        totalCollections: collectionsWithTranslations.length,
        featuredCollections: collectionsWithTranslations.filter(c => c.is_featured).length
      });

      return collectionsWithTranslations;

    } catch (error) {
      logger.error('[GetAllCollectionsQuery] Critical error', { error });
      throw error;
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
