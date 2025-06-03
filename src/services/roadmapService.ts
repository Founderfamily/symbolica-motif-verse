
import { supabase } from '@/integrations/supabase/client';

export interface RoadmapItem {
  id: string;
  phase: string;
  title: any; // Using any to match database Json type
  description: any; // Using any to match database Json type
  is_current: boolean;
  is_completed: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const getRoadmapItems = async (): Promise<RoadmapItem[]> => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .order('display_order');
  
  if (error) {
    throw error;
  }
  
  return data || [];
};

export const createRoadmapItem = async (item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>): Promise<RoadmapItem> => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .insert(item)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const updateRoadmapItem = async (item: RoadmapItem): Promise<RoadmapItem> => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .update(item)
    .eq('id', item.id)
    .select()
    .single();
  
  if (error) {
    throw error;
  }
  
  return data;
};

export const deleteRoadmapItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('roadmap_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw error;
  }
};
