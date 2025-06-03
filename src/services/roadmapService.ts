
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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getRoadmapItems = async (maxRetries: number = 3): Promise<RoadmapItem[]> => {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 [RoadmapService] Attempt ${attempt}/${maxRetries} - Fetching roadmap items...`);
      
      const startTime = Date.now();
      
      // Simplified query first - just get the basic data
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('display_order');
      
      const endTime = Date.now();
      console.log(`⏱️ [RoadmapService] Query completed in ${endTime - startTime}ms`);
      
      if (error) {
        console.error(`❌ [RoadmapService] Database error on attempt ${attempt}:`, error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log(`✅ [RoadmapService] Raw data received:`, data?.length || 0, 'items');
      
      if (!data) {
        console.warn(`⚠️ [RoadmapService] No data returned on attempt ${attempt}`);
        if (attempt === maxRetries) {
          return [];
        }
        await delay(1000 * attempt); // Progressive delay
        continue;
      }
      
      // Transform the data safely
      const transformedData = data.map(item => {
        try {
          return {
            ...item,
            title: (item.title as Record<string, string>) || { fr: 'Titre non disponible', en: 'Title not available' },
            description: (item.description as Record<string, string>) || { fr: 'Description non disponible', en: 'Description not available' }
          };
        } catch (transformError) {
          console.error(`❌ [RoadmapService] Transform error for item ${item.id}:`, transformError);
          return {
            ...item,
            title: { fr: 'Titre non disponible', en: 'Title not available' },
            description: { fr: 'Description non disponible', en: 'Description not available' }
          };
        }
      });
      
      console.log(`✅ [RoadmapService] Successfully transformed ${transformedData.length} items`);
      return transformedData;
      
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`❌ [RoadmapService] Attempt ${attempt} failed:`, lastError.message);
      
      if (attempt === maxRetries) {
        console.error(`💥 [RoadmapService] All ${maxRetries} attempts failed. Last error:`, lastError);
        throw lastError;
      }
      
      // Progressive delay between retries
      const delayMs = 1000 * attempt;
      console.log(`⏳ [RoadmapService] Waiting ${delayMs}ms before retry...`);
      await delay(delayMs);
    }
  }
  
  throw lastError || new Error('Unknown error occurred');
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
