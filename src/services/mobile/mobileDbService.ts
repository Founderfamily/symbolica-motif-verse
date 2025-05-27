
import { supabase } from '@/integrations/supabase/client';

export interface MobileFieldNote {
  id: string;
  user_id: string;
  content: string;
  location: { lat: number; lng: number } | null;
  timestamp: number;
  audio_url?: string;
  images: string[];
  synced: boolean;
  created_at: string;
  updated_at: string;
}

export interface MobileCacheData {
  id: string;
  user_id?: string;
  cache_type: string;
  cache_key: string;
  data: any;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MobileSyncQueue {
  id: string;
  user_id: string;
  action_type: 'create' | 'update' | 'delete';
  entity_type: string;
  entity_data: any;
  local_id?: string;
  server_id?: string;
  processed: boolean;
  error_message?: string;
  retry_count: number;
  created_at: string;
  processed_at?: string;
}

class MobileDbService {
  
  /**
   * Field Notes Operations
   */
  async createFieldNote(note: Omit<MobileFieldNote, 'id' | 'created_at' | 'updated_at'>): Promise<MobileFieldNote> {
    const { data, error } = await supabase
      .from('mobile_field_notes')
      .insert(note)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getFieldNotes(userId: string): Promise<MobileFieldNote[]> {
    const { data, error } = await supabase
      .from('mobile_field_notes')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async updateFieldNote(id: string, updates: Partial<MobileFieldNote>): Promise<MobileFieldNote> {
    const { data, error } = await supabase
      .from('mobile_field_notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFieldNote(id: string): Promise<void> {
    const { error } = await supabase
      .from('mobile_field_notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Cache Operations
   */
  async setCacheData(cache: Omit<MobileCacheData, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    const { error } = await supabase
      .from('mobile_cache_data')
      .upsert(cache);

    if (error) throw error;
  }

  async getCacheData(cacheType: string, cacheKey: string, userId?: string): Promise<any | null> {
    let query = supabase
      .from('mobile_cache_data')
      .select('data, expires_at')
      .eq('cache_type', cacheType)
      .eq('cache_key', cacheKey);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) return null;

    // Check expiration
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      await this.deleteCacheData(cacheType, cacheKey, userId);
      return null;
    }

    return data.data;
  }

  async deleteCacheData(cacheType: string, cacheKey: string, userId?: string): Promise<void> {
    let query = supabase
      .from('mobile_cache_data')
      .delete()
      .eq('cache_type', cacheType)
      .eq('cache_key', cacheKey);

    if (userId) {
      query = query.eq('user_id', userId);
    } else {
      query = query.is('user_id', null);
    }

    const { error } = await query;
    if (error) throw error;
  }

  /**
   * Sync Queue Operations
   */
  async addToSyncQueue(item: Omit<MobileSyncQueue, 'id' | 'created_at' | 'processed_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('mobile_sync_queue')
      .insert(item)
      .select('id')
      .single();

    if (error) throw error;
    return data.id;
  }

  async getPendingSyncItems(userId: string): Promise<MobileSyncQueue[]> {
    const { data, error } = await supabase
      .from('mobile_sync_queue')
      .select('*')
      .eq('user_id', userId)
      .eq('processed', false)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async markSyncItemProcessed(id: string, serverId?: string, errorMessage?: string): Promise<void> {
    const updates: any = {
      processed: !errorMessage,
      processed_at: new Date().toISOString()
    };

    if (serverId) updates.server_id = serverId;
    if (errorMessage) {
      updates.error_message = errorMessage;
      updates.retry_count = supabase.rpc('increment', { field: 'retry_count' });
    }

    const { error } = await supabase
      .from('mobile_sync_queue')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  }

  /**
   * Cleanup Operations
   */
  async cleanupExpiredCache(): Promise<void> {
    const { error } = await supabase
      .from('mobile_cache_data')
      .delete()
      .not('expires_at', 'is', null)
      .lt('expires_at', new Date().toISOString());

    if (error) throw error;
  }

  async cleanupOldSyncItems(olderThanDays: number = 30): Promise<void> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);

    const { error } = await supabase
      .from('mobile_sync_queue')
      .delete()
      .eq('processed', true)
      .lt('processed_at', cutoff.toISOString());

    if (error) throw error;
  }
}

export const mobileDbService = new MobileDbService();
