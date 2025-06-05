
import { supabase } from '@/integrations/supabase/client';
import { CollectionDetails } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service for fetching a collection by its slug
 */
export class GetCollectionBySlugQuery {
  /**
   * Récupère une collection par son slug
   */
  async execute(slug: string): Promise<CollectionDetails | null> {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_translations (*),
          collection_symbols (
            position,
            symbol_id,
            symbols (
              id,
              name,
              culture,
              period,
              description,
              created_at,
              updated_at,
              medium,
              technique,
              function,
              translations
            )
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as CollectionDetails;
    } catch (error) {
      logger.error('Error fetching collection by slug', { error, slug });
      return null;
    }
  }
}

export const getCollectionBySlugQuery = new GetCollectionBySlugQuery();
