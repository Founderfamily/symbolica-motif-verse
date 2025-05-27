
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface SymbolicaDB extends DBSchema {
  symbols: {
    key: string;
    value: {
      id: string;
      data: any;
      lastSync: number;
      offline: boolean;
    };
  };
  contributions: {
    key: string;
    value: {
      id: string;
      data: any;
      images: string[];
      lastSync: number;
      pending: boolean;
    };
  };
  searches: {
    key: string;
    value: {
      query: string;
      results: any[];
      timestamp: number;
    };
  };
  fieldNotes: {
    key: string;
    value: {
      id: string;
      content: string;
      location: { lat: number; lng: number } | null;
      timestamp: number;
      audioUrl?: string;
      images: string[];
      synced: boolean;
    };
  };
}

class OfflineService {
  private db: IDBPDatabase<SymbolicaDB> | null = null;

  async initialize() {
    this.db = await openDB<SymbolicaDB>('symbolica-offline', 1, {
      upgrade(db) {
        // Symbols store
        if (!db.objectStoreNames.contains('symbols')) {
          db.createObjectStore('symbols', { keyPath: 'id' });
        }

        // Contributions store
        if (!db.objectStoreNames.contains('contributions')) {
          db.createObjectStore('contributions', { keyPath: 'id' });
        }

        // Search cache
        if (!db.objectStoreNames.contains('searches')) {
          const searchStore = db.createObjectStore('searches', { keyPath: 'query' });
          searchStore.createIndex('timestamp', 'timestamp');
        }

        // Field notes
        if (!db.objectStoreNames.contains('fieldNotes')) {
          const notesStore = db.createObjectStore('fieldNotes', { keyPath: 'id' });
          notesStore.createIndex('timestamp', 'timestamp');
        }
      }
    });
  }

  /**
   * Cache symbol data for offline access
   */
  async cacheSymbol(symbolData: any) {
    if (!this.db) await this.initialize();
    
    await this.db!.put('symbols', {
      id: symbolData.id,
      data: symbolData,
      lastSync: Date.now(),
      offline: false
    });
  }

  /**
   * Get cached symbol
   */
  async getCachedSymbol(symbolId: string) {
    if (!this.db) await this.initialize();
    return this.db!.get('symbols', symbolId);
  }

  /**
   * Save contribution for later sync
   */
  async saveContributionOffline(contribution: any, images: string[] = []) {
    if (!this.db) await this.initialize();
    
    const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.put('contributions', {
      id,
      data: contribution,
      images,
      lastSync: 0,
      pending: true
    });

    return id;
  }

  /**
   * Get pending contributions for sync
   */
  async getPendingContributions() {
    if (!this.db) await this.initialize();
    
    const tx = this.db!.transaction('contributions', 'readonly');
    const contributions = await tx.store.getAll();
    
    return contributions.filter(c => c.pending);
  }

  /**
   * Cache search results
   */
  async cacheSearchResults(query: string, results: any[]) {
    if (!this.db) await this.initialize();
    
    await this.db!.put('searches', {
      query,
      results,
      timestamp: Date.now()
    });
  }

  /**
   * Get cached search results
   */
  async getCachedSearchResults(query: string): Promise<any[] | null> {
    if (!this.db) await this.initialize();
    
    const cached = await this.db!.get('searches', query);
    
    // Return results if cached within last hour
    if (cached && (Date.now() - cached.timestamp) < 3600000) {
      return cached.results;
    }
    
    return null;
  }

  /**
   * Save field note
   */
  async saveFieldNote(content: string, location: { lat: number; lng: number } | null, audioUrl?: string, images: string[] = []) {
    if (!this.db) await this.initialize();
    
    const id = `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await this.db!.put('fieldNotes', {
      id,
      content,
      location,
      timestamp: Date.now(),
      audioUrl,
      images,
      synced: false
    });

    return id;
  }

  /**
   * Get all field notes
   */
  async getFieldNotes() {
    if (!this.db) await this.initialize();
    
    const tx = this.db!.transaction('fieldNotes', 'readonly');
    const notes = await tx.store.getAll();
    
    return notes.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Clear old cached data
   */
  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000) { // 7 days
    if (!this.db) await this.initialize();
    
    const cutoff = Date.now() - maxAge;
    
    // Clear old searches
    const tx = this.db!.transaction('searches', 'readwrite');
    const cursor = await tx.store.index('timestamp').openCursor(IDBKeyRange.upperBound(cutoff));
    
    while (cursor) {
      await cursor.delete();
      await cursor.continue();
    }
  }

  /**
   * Get storage usage stats
   */
  async getStorageStats() {
    if (!this.db) await this.initialize();
    
    const symbolsCount = await this.db!.count('symbols');
    const contributionsCount = await this.db!.count('contributions');
    const searchesCount = await this.db!.count('searches');
    const notesCount = await this.db!.count('fieldNotes');
    
    return {
      symbols: symbolsCount,
      contributions: contributionsCount,
      searches: searchesCount,
      fieldNotes: notesCount
    };
  }
}

export const offlineService = new OfflineService();
