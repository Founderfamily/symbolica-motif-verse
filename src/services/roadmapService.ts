
import { supabase } from '@/integrations/supabase/client';

export interface RoadmapItem {
  id: string;
  phase: string;
  title: any;
  description: any;
  is_current: boolean;
  is_completed: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export const getRoadmapItems = async (): Promise<RoadmapItem[]> => {
  try {
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('Error fetching roadmap items:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch roadmap items:', error);
    throw error;
  }
};

export const createRoadmapItem = async (item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>): Promise<RoadmapItem> => {
  try {
    const { data, error } = await supabase
      .from('roadmap_items')
      .insert([item])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating roadmap item:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to create roadmap item:', error);
    throw error;
  }
};

export const updateRoadmapItem = async (item: RoadmapItem): Promise<RoadmapItem> => {
  try {
    const { data, error } = await supabase
      .from('roadmap_items')
      .update(item)
      .eq('id', item.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating roadmap item:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to update roadmap item:', error);
    throw error;
  }
};

export const deleteRoadmapItem = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('roadmap_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting roadmap item:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to delete roadmap item:', error);
    throw error;
  }
};
