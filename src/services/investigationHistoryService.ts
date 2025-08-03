import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export interface AIInvestigation {
  id: string;
  quest_id: string;
  investigation_type: string;
  result_content: Json;
  evidence_used: Json;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const investigationHistoryService = {
  // Récupérer toutes les investigations pour une quête
  async getQuestInvestigations(questId: string): Promise<AIInvestigation[]> {
    const { data, error } = await supabase
      .from('ai_investigations')
      .select('*')
      .eq('quest_id', questId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quest investigations:', error);
      throw error;
    }

    return data || [];
  },

  // Récupérer la dernière investigation par type
  async getLatestInvestigationByType(questId: string, type: string): Promise<AIInvestigation | null> {
    const { data, error } = await supabase
      .from('ai_investigations')
      .select('*')
      .eq('quest_id', questId)
      .eq('investigation_type', type)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Aucun résultat trouvé
        return null;
      }
      console.error('Error fetching latest investigation:', error);
      throw error;
    }

    return data;
  },

  // Marquer une investigation comme consultée
  async markInvestigationAsViewed(investigationId: string): Promise<void> {
    const { error } = await supabase
      .from('ai_investigations')
      .update({ 
        updated_at: new Date().toISOString() 
      })
      .eq('id', investigationId);

    if (error) {
      console.error('Error marking investigation as viewed:', error);
      throw error;
    }
  },

  // Obtenir le nombre d'investigations par type pour une quête
  async getInvestigationCounts(questId: string) {
    const { data, error } = await supabase
      .from('ai_investigations')
      .select('investigation_type')
      .eq('quest_id', questId);

    if (error) {
      console.error('Error fetching investigation counts:', error);
      throw error;
    }

    const counts = data.reduce((acc: any, investigation) => {
      acc[investigation.investigation_type] = (acc[investigation.investigation_type] || 0) + 1;
      return acc;
    }, {});

    return {
      full_investigation: counts.full_investigation || 0,
      search_historical_sources: counts.search_historical_sources || 0,
      generate_theories: counts.generate_theories || 0,
      analyze_connections: counts.analyze_connections || 0,
      total: data.length
    };
  }
};