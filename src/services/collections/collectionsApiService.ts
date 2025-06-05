
import { supabase } from '@/integrations/supabase/client';
import { CollectionWithTranslations, CollectionDetails } from '@/types/collections';
import { logger } from '@/services/logService';

/**
 * Low-level API service for collections database operations
 */
export class CollectionsApiService {
  /**
   * Récupère toutes les collections avec leurs traductions - VERSION ROBUSTE
   */
  async getCollections(): Promise<CollectionWithTranslations[]> {
    try {
      console.log('🔍 CollectionsApiService: Starting database query...');
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_translations (*)
        `)
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ CollectionsApiService: Query completed in ${queryTime}ms`);

      if (error) {
        console.error('❌ CollectionsApiService: Supabase error:', error);
        logger.error('Supabase collections query failed', { error });
        return [];
      }
      
      console.log('📊 CollectionsApiService: Raw data analysis:', {
        totalRows: data?.length || 0,
        dataType: typeof data,
        isArray: Array.isArray(data),
        firstRow: data?.[0] || null,
        hasTranslations: data?.[0]?.collection_translations ? 'Yes' : 'No'
      });
      
      if (!data || !Array.isArray(data)) {
        console.warn('⚠️ CollectionsApiService: No data or invalid data format');
        return [];
      }
      
      const transformedData: CollectionWithTranslations[] = data.map(collection => {
        if (!collection) {
          console.warn('⚠️ CollectionsApiService: Found null/undefined collection');
          return null;
        }

        const result = {
          ...collection,
          collection_translations: Array.isArray(collection.collection_translations) 
            ? collection.collection_translations 
            : []
        };
        
        console.log(`📝 Transformed collection ${collection.slug}:`, {
          id: result.id,
          slug: result.slug,
          translationsCount: result.collection_translations.length,
          translations: result.collection_translations.map(t => `${t.language}: ${t.title}`)
        });
        
        return result;
      }).filter(Boolean);
      
      console.log('✅ CollectionsApiService: Successfully transformed', transformedData.length, 'collections');
      return transformedData;
    } catch (error) {
      console.error('❌ CollectionsApiService: Critical error in getCollections:', error);
      logger.error('Error fetching collections', { error });
      return [];
    }
  }

  /**
   * Récupère les collections en vedette
   */
  async getFeaturedCollections(): Promise<CollectionWithTranslations[]> {
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

  /**
   * Récupère une collection par son slug
   */
  async getCollectionBySlug(slug: string): Promise<CollectionDetails | null> {
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

export const collectionsApiService = new CollectionsApiService();
