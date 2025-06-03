
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

// Données statiques de fallback (réduites)
const FALLBACK_ROADMAP_ITEMS: RoadmapItem[] = [
  {
    id: '1',
    phase: 'Phase 1',
    title: { fr: 'Lancement de la plateforme', en: 'Platform Launch' },
    description: { fr: 'Mise en ligne de la version initiale avec les fonctionnalités de base', en: 'Initial release with core features' },
    is_current: false,
    is_completed: true,
    display_order: 1
  },
  {
    id: '2',
    phase: 'Phase 2',
    title: { fr: 'Ajout des fonctionnalités communautaires', en: 'Community Features' },
    description: { fr: 'Implémentation des groupes d\'intérêt et des discussions', en: 'Implementation of interest groups and discussions' },
    is_current: true,
    is_completed: false,
    display_order: 2
  }
];

export const getRoadmapItemsWithFallback = async (): Promise<{ items: RoadmapItem[], usingFallback: boolean, error?: string }> => {
  try {
    console.log('🚀 [RoadmapService] Fetching roadmap data from database...');
    
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('display_order');
    
    if (error) {
      console.error('❌ [RoadmapService] Supabase error:', error);
      console.log('🔄 [RoadmapService] Using fallback data due to error');
      return { 
        items: FALLBACK_ROADMAP_ITEMS, 
        usingFallback: true, 
        error: `Erreur de base de données: ${error.message}` 
      };
    }
    
    console.log('✅ [RoadmapService] Data received:', data?.length || 0, 'items');
    
    if (data && data.length > 0) {
      return { items: data, usingFallback: false };
    } else {
      console.log('⚠️ [RoadmapService] No data returned, using fallback');
      return { items: FALLBACK_ROADMAP_ITEMS, usingFallback: true };
    }
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
    console.error('❌ [RoadmapService] Error:', errorMessage);
    
    return { 
      items: FALLBACK_ROADMAP_ITEMS, 
      usingFallback: true, 
      error: `Connexion échouée: ${errorMessage}` 
    };
  }
};

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
