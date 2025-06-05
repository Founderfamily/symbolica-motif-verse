
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service for fetching featured collections
 */
export class GetFeaturedCollectionsQuery {
  /**
   * Récupère les collections en vedette
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
        .limit(4);

      if (error) {
        console.error('❌ Featured collections query failed:', error);
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
