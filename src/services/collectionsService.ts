
import { CollectionWithTranslations, CollectionDetails, Collection, CreateCollectionData } from '@/types/collections';
import { collectionsApiService } from './collections/collectionsApiService';
import { collectionsManagementService } from './collections/collectionsManagementService';
import { collectionsSymbolService } from './collections/collectionsSymbolService';

/**
 * Main collections service - facade pattern
 */
class CollectionsService {
  private static instance: CollectionsService;

  static getInstance(): CollectionsService {
    if (!CollectionsService.instance) {
      CollectionsService.instance = new CollectionsService();
    }
    return CollectionsService.instance;
  }

  // API operations
  async getCollections(): Promise<CollectionWithTranslations[]> {
    return collectionsApiService.getCollections();
  }

  async getFeaturedCollections(): Promise<CollectionWithTranslations[]> {
    return collectionsApiService.getFeaturedCollections();
  }

  async getCollectionBySlug(slug: string): Promise<CollectionDetails | null> {
    return collectionsApiService.getCollectionBySlug(slug);
  }

  // Management operations
  async createCollection(collectionData: CreateCollectionData): Promise<Collection | null> {
    return collectionsManagementService.createCollection(collectionData);
  }

  async updateCollection(id: string, updates: Partial<CreateCollectionData>): Promise<boolean> {
    return collectionsManagementService.updateCollection(id, updates);
  }

  async deleteCollection(id: string): Promise<boolean> {
    return collectionsManagementService.deleteCollection(id);
  }

  // Symbol operations
  async updateSymbolsOrder(collectionId: string, symbolIds: string[]): Promise<boolean> {
    return collectionsSymbolService.updateSymbolsOrder(collectionId, symbolIds);
  }
}

export const collectionsService = CollectionsService.getInstance();
