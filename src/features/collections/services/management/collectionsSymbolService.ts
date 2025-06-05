
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/logService';

/**
 * Service for managing collection symbols relationships
 */
export class CollectionsSymbolService {
  /**
   * Ajoute des symboles à une collection
   */
  async addSymbolsToCollection(collectionId: string, symbolIds: string[]) {
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
}

export const collectionsSymbolService = new CollectionsSymbolService();
