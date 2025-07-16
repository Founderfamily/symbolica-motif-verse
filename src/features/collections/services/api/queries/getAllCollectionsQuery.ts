
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
    try {
      // STEP 1: Fetch all collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

      if (collectionsError) {
        throw collectionsError;
      }

      if (!collectionsData || collectionsData.length === 0) {
        return [];
      }

      // STEP 2: Fetch all translations
      const { data: translationsData, error: translationsError } = await supabase
        .from('collection_translations')
        .select('*');

      if (translationsError) {
        logger.warn('Translations fetch error', translationsError);
        // Continue even if translations fail
      }

      // STEP 3: Map collections with their translations
      const collectionsWithTranslations: CollectionWithTranslations[] = collectionsData.map(collection => {
        const collectionTranslations = translationsData?.filter(
          translation => translation.collection_id === collection.id
        ) || [];

        return {
          ...collection,
          collection_translations: collectionTranslations
        };
      });

      return collectionsWithTranslations;

    } catch (error) {
      logger.error('Critical error', { error });
      throw error;
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
