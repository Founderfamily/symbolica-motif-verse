
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

interface MobileFieldNote {
  id: string;
  content: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  audioUrl?: string;
  images: string[];
  synced: boolean;
}

interface CacheEntry {
  query: string;
  results: any[];
  timestamp: number;
}

// Type guards for data validation
function isValidLocation(location: Json): location is { lat: number; lng: number } | null {
  if (location === null) return true;
  if (typeof location === 'object' && location !== null && !Array.isArray(location)) {
    const loc = location as any;
    return typeof loc.lat === 'number' && typeof loc.lng === 'number';
  }
  return false;
}

function isValidImages(images: Json): images is string[] {
  return Array.isArray(images) && images.every(item => typeof item === 'string');
}

class OfflineService {
  private userId: string | null = null;

  constructor() {
    this.initializeUser();
  }

  private async initializeUser() {
    const { data: { user } } = await supabase.auth.getUser();
    this.userId = user?.id || null;
  }

  /**
   * Initialize the service (alias for initializeUser for compatibility)
   */
  async initialize() {
    await this.initializeUser();
  }

  private async ensureUser() {
    if (!this.userId) {
      await this.initializeUser();
    }
    return this.userId;
  }

  /**
   * Save field note to database
   */
  async saveFieldNote(
    content: string, 
    location: { lat: number; lng: number } | null, 
    audioUrl?: string, 
    images: string[] = []
  ): Promise<string> {
    const userId = await this.ensureUser();
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('mobile_field_notes')
      .insert({
        user_id: userId,
        content,
        location,
        timestamp: Date.now(),
        audio_url: audioUrl,
        images,
        synced: true
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Get all field notes
   */
  async getFieldNotes(): Promise<MobileFieldNote[]> {
    const userId = await this.ensureUser();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('mobile_field_notes')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching field notes:', error);
      return [];
    }

    return data.map(note => {
      const location = isValidLocation(note.location) ? note.location : null;
      const images = isValidImages(note.images) ? note.images : [];
      
      return {
        id: note.id,
        content: note.content,
        location,
        timestamp: note.timestamp,
        audioUrl: note.audio_url,
        images,
        synced: note.synced
      };
    });
  }

  /**
   * Cache search results
   */
  async cacheSearchResults(query: string, results: any[]): Promise<void> {
    const userId = await this.ensureUser();
    
    const { error } = await supabase
      .from('mobile_cache_data')
      .upsert({
        user_id: userId,
        cache_type: 'search_results',
        cache_key: query,
        data: results,
        expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
      });

    if (error) {
      console.error('Error caching search results:', error);
    }
  }

  /**
   * Get cached search results
   */
  async getCachedSearchResults(query: string): Promise<any[] | null> {
    const userId = await this.ensureUser();
    
    const { data, error } = await supabase
      .from('mobile_cache_data')
      .select('data, expires_at')
      .eq('cache_type', 'search_results')
      .eq('cache_key', query)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;

    // Check if cache is expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      // Clean up expired cache
      await supabase
        .from('mobile_cache_data')
        .delete()
        .eq('cache_type', 'search_results')
        .eq('cache_key', query)
        .eq('user_id', userId);
      
      return null;
    }

    // Validate that data is an array
    if (Array.isArray(data.data)) {
      return data.data;
    }
    
    return null;
  }

  /**
   * Cache symbol data
   */
  async cacheSymbol(symbolData: any): Promise<void> {
    const { error } = await supabase
      .from('mobile_cache_data')
      .upsert({
        user_id: null, // Public cache for symbols
        cache_type: 'symbol_data',
        cache_key: symbolData.id,
        data: symbolData,
        expires_at: new Date(Date.now() + 24 * 3600000).toISOString() // 24 hours
      });

    if (error) {
      console.error('Error caching symbol:', error);
    }
  }

  /**
   * Get cached symbol
   */
  async getCachedSymbol(symbolId: string): Promise<any | null> {
    const { data, error } = await supabase
      .from('mobile_cache_data')
      .select('data')
      .eq('cache_type', 'symbol_data')
      .eq('cache_key', symbolId)
      .maybeSingle();

    if (error || !data) return null;
    return data.data;
  }

  /**
   * Save contribution for later sync
   */
  async saveContributionOffline(contribution: any, images: string[] = []): Promise<string> {
    const userId = await this.ensureUser();
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('mobile_sync_queue')
      .insert({
        user_id: userId,
        action_type: 'create',
        entity_type: 'contribution',
        entity_data: { ...contribution, images },
        local_id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  /**
   * Get pending contributions for sync
   */
  async getPendingContributions(): Promise<any[]> {
    const userId = await this.ensureUser();
    if (!userId) return [];

    const { data, error } = await supabase
      .from('mobile_sync_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('processed', false)
      .eq('entity_type', 'contribution');

    if (error) {
      console.error('Error fetching pending contributions:', error);
      return [];
    }

    return data;
  }

  /**
   * Clear old cached data
   */
  async clearOldCache(maxAge: number = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    const cutoff = new Date(Date.now() - maxAge).toISOString();
    
    const { error } = await supabase
      .from('mobile_cache_data')
      .delete()
      .lt('created_at', cutoff);

    if (error) {
      console.error('Error clearing old cache:', error);
    }
  }

  /**
   * Get storage usage stats
   */
  async getStorageStats(): Promise<{
    fieldNotes: number;
    cacheEntries: number;
    pendingSync: number;
  }> {
    const userId = await this.ensureUser();
    if (!userId) return { fieldNotes: 0, cacheEntries: 0, pendingSync: 0 };

    const [fieldNotesResult, cacheResult, syncResult] = await Promise.all([
      supabase.from('mobile_field_notes').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('mobile_cache_data').select('id', { count: 'exact' }).eq('user_id', userId),
      supabase.from('mobile_sync_queue').select('id', { count: 'exact' }).eq('user_id', userId).eq('processed', false)
    ]);

    return {
      fieldNotes: fieldNotesResult.count || 0,
      cacheEntries: cacheResult.count || 0,
      pendingSync: syncResult.count || 0
    };
  }
}

export const offlineService = new OfflineService();
