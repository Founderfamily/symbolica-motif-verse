
import { supabase } from '@/integrations/supabase/client';
import { CollectionDetails } from '../../../types/collections';
import { logger } from '@/services/logService';

/**
 * Query service pour récupérer une collection par son slug - UTILISE LA VUE
 */
export class GetCollectionBySlugQuery {
  /**
   * Récupère une collection complète par son slug via la vue collections_with_symbols
   */
  async execute(slug: string): Promise<CollectionDetails | null> {
    try {
      const { data, error } = await supabase
        .from('collections_with_symbols')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        logger.error('Error fetching collection by slug', { error, slug });
        throw error;
      }

      if (!data) return null;

      // Convert the view data to proper format
      const collection: CollectionDetails = {
        id: data.id,
        slug: data.slug,
        created_by: data.created_by,
        created_at: data.created_at,
        updated_at: data.updated_at,
        is_featured: data.is_featured,
        collection_translations: Array.isArray(data.collection_translations) 
          ? data.collection_translations as any[] 
          : [],
        collection_symbols: Array.isArray(data.collection_symbols) 
          ? data.collection_symbols as any[] 
          : []
      };

      return collection;
    } catch (error) {
      logger.error('Error fetching collection by slug', { error, slug });
      return null;
    }
  }
}

export const getCollectionBySlugQuery = new GetCollectionBySlugQuery();
