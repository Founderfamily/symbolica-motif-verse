import { supabase } from '@/integrations/supabase/client';

export interface HistoricalArchive {
  id: string;
  title: string;
  description?: string;
  author?: string;
  date?: string;
  source?: string;
  type?: string;
  document_url?: string;
  archive_link?: string;
  physical_location?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export const historicalArchiveService = {
  async getArchives(): Promise<HistoricalArchive[]> {
    const { data, error } = await supabase
      .from('historical_archives')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching archives:', error);
      throw error;
    }

    return data || [];
  },

  async updateArchive(id: string, updates: Partial<HistoricalArchive>): Promise<HistoricalArchive> {
    const { data, error } = await supabase
      .from('historical_archives')
      .update({
        ...updates,
        updated_by: (await supabase.auth.getUser()).data.user?.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating archive:', error);
      throw error;
    }

    return data;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('historical-archives')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('historical-archives')
      .getPublicUrl(data.path);

    return publicUrl;
  }
};