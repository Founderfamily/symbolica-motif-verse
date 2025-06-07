
import { CollectionWithTranslations, CollectionDetails } from '../../types/collections';
import { getAllCollectionsQuery } from './queries/getAllCollectionsQuery';
import { getFeaturedCollectionsQuery } from './queries/getFeaturedCollectionsQuery';
import { getCollectionBySlugQuery } from './queries/getCollectionBySlugQuery';

/**
 * Service API unifié pour les collections
 * Centralise toutes les opérations de base de données
 */
export class CollectionsApiService {
  /**
   * Récupère toutes les collections avec leurs traductions
   */
  async getCollections(): Promise<CollectionWithTranslations[]> {
    return getAllCollectionsQuery.execute();
  }

  /**
   * Récupère les collections en vedette
   */
  async getFeaturedCollections(): Promise<CollectionWithTranslations[]> {
    return getFeaturedCollectionsQuery.execute();
  }

  /**
   * Récupère une collection par son slug
   */
  async getCollectionBySlug(slug: string): Promise<CollectionDetails | null> {
    return getCollectionBySlugQuery.execute(slug);
  }
}

export const collectionsApiService = new CollectionsApiService();
