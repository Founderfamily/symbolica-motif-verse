
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/utils/logger';

/**
 * Query service for fetching all collections with translations - UTILISE LA VUE
 */
export class GetAllCollectionsQuery {
  /**
   * Récupère toutes les collections avec leurs traductions via la vue collections_with_symbols
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    try {
      const { data, error } = await supabase
        .from('collections_with_symbols')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('Error fetching collections from view', { error });
        throw error;
      }

      // Convert the view data to proper format
      const collections: CollectionWithTranslations[] = (data || []).map(item => ({
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

      return collections;
    } catch (error) {
      logger.error('Critical error', { error });
      throw error;
    }
  }
}

export const getAllCollectionsQuery = new GetAllCollectionsQuery();
