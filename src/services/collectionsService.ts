import { supabase } from '@/integrations/supabase/client';
import { Collection, CollectionWithTranslations, CollectionDetails, CreateCollectionData } from '@/types/collections';
import { logger } from './logService';

class CollectionsService {
  private static instance: CollectionsService;

  static getInstance(): CollectionsService {
    if (!CollectionsService.instance) {
      CollectionsService.instance = new CollectionsService();
    }
    return CollectionsService.instance;
  }

  /**
   * Récupère toutes les collections avec leurs traductions - VERSION CORRIGÉE
   */
  async getCollections(): Promise<CollectionWithTranslations[]> {
    try {
      console.log('🔍 CollectionsService: Starting database query...');
      
      const startTime = Date.now();
      const { data, error } = await supabase
        .from('collections')
        .select(`
          id,
          slug,
          created_by,
          created_at,
          updated_at,
          is_featured,
          collection_translations (
            id,
            collection_id,
            language,
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      const queryTime = Date.now() - startTime;
      console.log(`⏱️ CollectionsService: Query completed in ${queryTime}ms`);

      if (error) {
        console.error('❌ CollectionsService: Supabase error:', error);
        throw error;
      }
      
      console.log('📊 CollectionsService: Raw data analysis:', {
        totalRows: data?.length || 0,
        firstRow: data?.[0] || null,
        hasTranslations: data?.[0]?.collection_translations ? 'Yes' : 'No'
      });
      
      // Transformation sécurisée des données
      const transformedData: CollectionWithTranslations[] = (data || []).map(collection => {
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
      });
      
      console.log('✅ CollectionsService: Successfully transformed', transformedData.length, 'collections');
      return transformedData;
    } catch (error) {
      console.error('❌ CollectionsService: Critical error in getCollections:', error);
      logger.error('Error fetching collections', { error });
      // Au lieu de retourner un tableau vide, jeter l'erreur pour que React Query la gère
      throw error;
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

      if (error) throw error;
      return data || [];
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

  /**
   * Crée une nouvelle collection
   */
  async createCollection(collectionData: CreateCollectionData): Promise<Collection | null> {
    try {
      // Créer la collection
      const { data: collection, error: collectionError } = await supabase
        .from('collections')
        .insert({
          slug: collectionData.slug,
          is_featured: collectionData.is_featured || false
        })
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Créer les traductions
      await this.createTranslations(collection.id, collectionData.translations);

      // Ajouter les symboles si fournis
      if (collectionData.symbol_ids?.length) {
        await this.addSymbolsToCollection(collection.id, collectionData.symbol_ids);
      }

      logger.info('Collection created successfully', { collectionId: collection.id });
      return collection;
    } catch (error) {
      logger.error('Error creating collection', { error });
      return null;
    }
  }

  /**
   * Met à jour une collection
   */
  async updateCollection(id: string, updates: Partial<CreateCollectionData>): Promise<boolean> {
    try {
      if (updates.slug || updates.is_featured !== undefined) {
        const { error } = await supabase
          .from('collections')
          .update({
            ...(updates.slug && { slug: updates.slug }),
            ...(updates.is_featured !== undefined && { is_featured: updates.is_featured })
          })
          .eq('id', id);

        if (error) throw error;
      }

      if (updates.translations) {
        await this.updateTranslations(id, updates.translations);
      }

      logger.info('Collection updated successfully', { collectionId: id });
      return true;
    } catch (error) {
      logger.error('Error updating collection', { error, collectionId: id });
      return false;
    }
  }

  /**
   * Supprime une collection
   */
  async deleteCollection(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      logger.info('Collection deleted successfully', { collectionId: id });
      return true;
    } catch (error) {
      logger.error('Error deleting collection', { error, collectionId: id });
      return false;
    }
  }

  /**
   * Met à jour l'ordre des symboles dans une collection
   */
  async updateSymbolsOrder(collectionId: string, symbolIds: string[]): Promise<boolean> {
    try {
      // Supprimer tous les symboles existants
      await supabase
        .from('collection_symbols')
        .delete()
        .eq('collection_id', collectionId);

      // Réinsérer avec le nouvel ordre
      const collectionSymbols = symbolIds.map((symbolId, index) => ({
        collection_id: collectionId,
        symbol_id: symbolId,
        position: index + 1
      }));

      const { error } = await supabase
        .from('collection_symbols')
        .insert(collectionSymbols);

      if (error) throw error;
      
      logger.info('Symbols order updated successfully', { collectionId });
      return true;
    } catch (error) {
      logger.error('Error updating symbols order', { error, collectionId });
      return false;
    }
  }

  // Méthodes privées pour réduire la duplication
  private async createTranslations(collectionId: string, translations: CreateCollectionData['translations']) {
    const translationData = [
      {
        collection_id: collectionId,
        language: 'fr',
        title: translations.fr.title,
        description: translations.fr.description
      },
      {
        collection_id: collectionId,
        language: 'en',
        title: translations.en.title,
        description: translations.en.description
      }
    ];

    const { error } = await supabase
      .from('collection_translations')
      .insert(translationData);

    if (error) throw error;
  }

  private async updateTranslations(collectionId: string, translations: CreateCollectionData['translations']) {
    if (translations.fr) {
      await supabase
        .from('collection_translations')
        .update({
          title: translations.fr.title,
          description: translations.fr.description
        })
        .eq('collection_id', collectionId)
        .eq('language', 'fr');
    }

    if (translations.en) {
      await supabase
        .from('collection_translations')
        .update({
          title: translations.en.title,
          description: translations.en.description
        })
        .eq('collection_id', collectionId)
        .eq('language', 'en');
    }
  }

  private async addSymbolsToCollection(collectionId: string, symbolIds: string[]) {
    const collectionSymbols = symbolIds.map((symbolId, index) => ({
      collection_id: collectionId,
      symbol_id: symbolId,
      position: index + 1
    }));

    const { error } = await supabase
      .from('collection_symbols')
      .insert(collectionSymbols);

    if (error) throw error;
  }
}

export const collectionsService = CollectionsService.getInstance();
