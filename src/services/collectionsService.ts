
import { supabase } from '@/integrations/supabase/client';
import { Collection, CollectionWithTranslations, CollectionDetails, CreateCollectionData } from '@/types/collections';

export const collectionsService = {
  /**
   * Récupère toutes les collections avec leurs traductions
   */
  getCollections: async (): Promise<CollectionWithTranslations[]> => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select(`
          *,
          collection_translations (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching collections:', error);
      return [];
    }
  },

  /**
   * Récupère les collections en vedette
   */
  getFeaturedCollections: async (): Promise<CollectionWithTranslations[]> => {
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
      console.error('Error fetching featured collections:', error);
      return [];
    }
  },

  /**
   * Récupère une collection par son slug avec ses symboles
   */
  getCollectionBySlug: async (slug: string): Promise<CollectionDetails | null> => {
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
              description
            )
          )
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching collection by slug:', error);
      return null;
    }
  },

  /**
   * Crée une nouvelle collection
   */
  createCollection: async (collectionData: CreateCollectionData): Promise<Collection | null> => {
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
      const translations = [
        {
          collection_id: collection.id,
          language: 'fr',
          title: collectionData.translations.fr.title,
          description: collectionData.translations.fr.description
        },
        {
          collection_id: collection.id,
          language: 'en',
          title: collectionData.translations.en.title,
          description: collectionData.translations.en.description
        }
      ];

      const { error: translationsError } = await supabase
        .from('collection_translations')
        .insert(translations);

      if (translationsError) throw translationsError;

      // Ajouter les symboles si fournis
      if (collectionData.symbol_ids && collectionData.symbol_ids.length > 0) {
        const collectionSymbols = collectionData.symbol_ids.map((symbolId, index) => ({
          collection_id: collection.id,
          symbol_id: symbolId,
          position: index + 1
        }));

        const { error: symbolsError } = await supabase
          .from('collection_symbols')
          .insert(collectionSymbols);

        if (symbolsError) throw symbolsError;
      }

      return collection;
    } catch (error) {
      console.error('Error creating collection:', error);
      return null;
    }
  },

  /**
   * Met à jour une collection
   */
  updateCollection: async (id: string, updates: Partial<CreateCollectionData>): Promise<boolean> => {
    try {
      if (updates.slug || updates.is_featured !== undefined) {
        const { error: collectionError } = await supabase
          .from('collections')
          .update({
            ...(updates.slug && { slug: updates.slug }),
            ...(updates.is_featured !== undefined && { is_featured: updates.is_featured })
          })
          .eq('id', id);

        if (collectionError) throw collectionError;
      }

      if (updates.translations) {
        // Mettre à jour les traductions françaises
        if (updates.translations.fr) {
          await supabase
            .from('collection_translations')
            .update({
              title: updates.translations.fr.title,
              description: updates.translations.fr.description
            })
            .eq('collection_id', id)
            .eq('language', 'fr');
        }

        // Mettre à jour les traductions anglaises
        if (updates.translations.en) {
          await supabase
            .from('collection_translations')
            .update({
              title: updates.translations.en.title,
              description: updates.translations.en.description
            })
            .eq('collection_id', id)
            .eq('language', 'en');
        }
      }

      return true;
    } catch (error) {
      console.error('Error updating collection:', error);
      return false;
    }
  },

  /**
   * Supprime une collection
   */
  deleteCollection: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      return false;
    }
  },

  /**
   * Met à jour l'ordre des symboles dans une collection
   */
  updateSymbolsOrder: async (collectionId: string, symbolIds: string[]): Promise<boolean> => {
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
      return true;
    } catch (error) {
      console.error('Error updating symbols order:', error);
      return false;
    }
  }
};
