
import { supabase } from '@/integrations/supabase/client';
import { CreateCollectionData } from '../../types/collections';

/**
 * Service for managing collection translations
 */
export class CollectionsTranslationService {
  /**
   * Crée les traductions pour une collection
   */
  async createTranslations(collectionId: string, translations: CreateCollectionData['translations']) {
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

  /**
   * Met à jour les traductions d'une collection
   */
  async updateTranslations(collectionId: string, translations: CreateCollectionData['translations']) {
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
}

export const collectionsTranslationService = new CollectionsTranslationService();
