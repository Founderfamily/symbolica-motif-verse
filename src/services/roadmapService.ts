
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
