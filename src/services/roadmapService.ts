import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface RoadmapItem {
  id: string;
  phase: string;
  title: Record<string, string>;
  description: Record<string, string>;
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
    console.error("Error fetching roadmap items:", error);
    throw error;
  }
  
  return (data || []).map(item => ({
    ...item,
    title: item.title as Record<string, string>,
    description: item.description as Record<string, string>
  }));
};

export const getRoadmapItemById = async (id: string): Promise<RoadmapItem | null> => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching roadmap item with id ${id}:`, error);
    return null;
  }
  
  return data ? {
    ...data,
    title: data.title as Record<string, string>,
    description: data.description as Record<string, string>
  } : null;
};

export const updateRoadmapItem = async (item: RoadmapItem): Promise<void> => {
  const { error } = await supabase
    .from('roadmap_items')
    .update({
      phase: item.phase,
      title: item.title,
      description: item.description,
      is_current: item.is_current,
      is_completed: item.is_completed,
      display_order: item.display_order,
      updated_at: new Date().toISOString()
    })
    .eq('id', item.id);
  
  if (error) {
    console.error("Error updating roadmap item:", error);
    throw error;
  }
};

export const createRoadmapItem = async (item: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>): Promise<void> => {
  const { error } = await supabase
    .from('roadmap_items')
    .insert([{
      phase: item.phase,
      title: item.title,
      description: item.description,
      is_current: item.is_current,
      is_completed: item.is_completed,
      display_order: item.display_order
    }]);
  
  if (error) {
    console.error("Error creating roadmap item:", error);
    throw error;
  }
};

export const deleteRoadmapItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('roadmap_items')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error(`Error deleting roadmap item with id ${id}:`, error);
    throw error;
  }
};
