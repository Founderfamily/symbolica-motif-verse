
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service pour récupérer les collections en vedette
 */
export class GetFeaturedCollectionsQuery {
  /**
   * Récupère les collections en vedette avec leurs traductions
   */
  async execute(): Promise<CollectionWithTranslations[]> {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_translations (*)
        `)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        logger.error('Featured collections query failed', { error });
        return [];
      }

      return (data || []).filter(Boolean);
    } catch (error) {
      logger.error('Error fetching featured collections', { error });
      return [];
    }
  }
}

export const getFeaturedCollectionsQuery = new GetFeaturedCollectionsQuery();
