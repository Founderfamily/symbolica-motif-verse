
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service pour récupérer les collections en vedette - UTILISE LA VUE
 */
export class GetFeaturedCollectionsQuery {
  /**
   * Récupère les collections en vedette via la vue collections_with_symbols
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    try {
      const { data, error } = await supabase
        .from('collections_with_symbols')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) {
        logger.error('Featured collections query failed', { error });
        return [];
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

      return collections.filter(Boolean);
    } catch (error) {
      logger.error('Error fetching featured collections', { error });
      return [];
    }
  }
}

export const getFeaturedCollectionsQuery = new GetFeaturedCollectionsQuery();
