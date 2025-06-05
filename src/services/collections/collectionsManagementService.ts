
import { supabase } from '@/integrations/supabase/client';
import { Collection, CreateCollectionData } from '@/types/collections';
import { collectionsTranslationService } from './collectionsTranslationService';
import { collectionsSymbolService } from './collectionsSymbolService';
import { logger } from '@/services/logService';

/**
 * Service for collection CRUD operations
 */
export class CollectionsManagementService {
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
      await collectionsTranslationService.createTranslations(collection.id, collectionData.translations);

      // Ajouter les symboles si fournis
      if (collectionData.symbol_ids?.length) {
        await collectionsSymbolService.addSymbolsToCollection(collection.id, collectionData.symbol_ids);
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
        await collectionsTranslationService.updateTranslations(id, updates.translations);
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
}

export const collectionsManagementService = new CollectionsManagementService();
