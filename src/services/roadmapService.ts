
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

// Données statiques de fallback
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
  },
  {
    id: '3',
    phase: 'Phase 3',
    title: { fr: 'Intelligence artificielle avancée', en: 'Advanced AI Features' },
    description: { fr: 'Reconnaissance automatique de motifs et analyse prédictive', en: 'Automatic pattern recognition and predictive analysis' },
    is_current: false,
    is_completed: false,
    display_order: 3
  }
];

export const getRoadmapItemsWithFallback = async (): Promise<{ items: RoadmapItem[], usingFallback: boolean, error?: string }> => {
  try {
    console.log('🚀 [RoadmapService] Testing Supabase connection...');
    
    // Test de connexion avec timeout de 5 secondes
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    console.log('🔗 [RoadmapService] Attempting to fetch roadmap data...');
    
    const { data, error } = await supabase
      .from('roadmap_items')
      .select('*')
      .order('display_order')
      .abortSignal(controller.signal);
    
    clearTimeout(timeoutId);
    
    if (error) {
      console.error('❌ [RoadmapService] Supabase error:', error);
      throw new Error(`Erreur Supabase: ${error.message}`);
    }
    
    console.log('✅ [RoadmapService] Data received:', data?.length || 0, 'items');
    console.log('📄 [RoadmapService] Sample data:', data?.[0]);
    
    if (data && data.length > 0) {
      return { items: data, usingFallback: false };
    } else {
      console.log('⚠️ [RoadmapService] No data returned, using fallback');
      return { items: FALLBACK_ROADMAP_ITEMS, usingFallback: true };
    }
    
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur de connexion';
    console.error('❌ [RoadmapService] Error:', errorMessage);
    
    // Utiliser les données de fallback en cas d'erreur
    console.log('🔄 [RoadmapService] Using fallback data due to error');
    return { 
      items: FALLBACK_ROADMAP_ITEMS, 
      usingFallback: true, 
      error: `Connexion base de données échouée (utilisation des données locales): ${errorMessage}` 
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
