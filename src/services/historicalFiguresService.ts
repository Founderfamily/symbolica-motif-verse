import { supabase } from '@/integrations/supabase/client';

export interface HistoricalFigureMetadata {
  id: string;
  quest_id: string;
  figure_name: string;
  figure_role: string;
  figure_period: string;
  wikipedia_url?: string;
  wikidata_id?: string;
  description?: string;
  image_url?: string;
  verified_by?: string;
  verified_at?: string;
  status: 'pending' | 'verified' | 'rejected';
  suggested_by?: string;
  created_at: string;
  updated_at: string;
}

export interface HistoricalFigureSuggestion {
  quest_id: string;
  figure_name: string;
  figure_role: string;
  figure_period: string;
  wikipedia_url: string;
  description?: string;
}

class HistoricalFiguresService {
  /**
   * Récupère les métadonnées des personnages historiques pour une quête
   */
  async getHistoricalFiguresMetadata(questId: string): Promise<HistoricalFigureMetadata[]> {
    const { data, error } = await supabase
      .from('historical_figures_metadata')
      .select('*')
      .eq('quest_id', questId)
      .eq('status', 'verified')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des métadonnées des personnages:', error);
      throw error;
    }

    return (data || []) as HistoricalFigureMetadata[];
  }

  /**
   * Suggère un lien Wikipedia pour un personnage historique
   */
  async suggestWikipediaLink(suggestion: HistoricalFigureSuggestion): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { data, error } = await supabase
      .from('historical_figures_metadata')
      .insert({
        quest_id: suggestion.quest_id,
        figure_name: suggestion.figure_name,
        figure_role: suggestion.figure_role,
        figure_period: suggestion.figure_period,
        wikipedia_url: suggestion.wikipedia_url,
        description: suggestion.description,
        suggested_by: user.id,
        status: 'pending'
      })
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new Error('Une suggestion existe déjà pour ce personnage dans cette quête');
      }
      console.error('Erreur lors de la suggestion de lien Wikipedia:', error);
      throw error;
    }

    return data.id;
  }

  /**
   * Met à jour ses propres suggestions (admin ou utilisateur pour ses suggestions en attente)
   */
  async updateWikipediaLink(
    metadataId: string, 
    updates: Partial<HistoricalFigureMetadata>
  ): Promise<void> {
    const { error } = await supabase
      .from('historical_figures_metadata')
      .update(updates)
      .eq('id', metadataId);

    if (error) {
      console.error('Erreur lors de la mise à jour du lien Wikipedia:', error);
      throw error;
    }
  }

  /**
   * Valide ou rejette une suggestion (admin seulement)
   */
  async validateSuggestion(
    metadataId: string, 
    status: 'verified' | 'rejected'
  ): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    const { error } = await supabase
      .from('historical_figures_metadata')
      .update({
        status,
        verified_by: user.id,
        verified_at: new Date().toISOString()
      })
      .eq('id', metadataId);

    if (error) {
      console.error('Erreur lors de la validation de la suggestion:', error);
      throw error;
    }
  }

  /**
   * Récupère les suggestions en attente (admin seulement)
   */
  async getPendingSuggestions(): Promise<HistoricalFigureMetadata[]> {
    const { data, error } = await supabase
      .from('historical_figures_metadata')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des suggestions en attente:', error);
      throw error;
    }

    return (data || []) as HistoricalFigureMetadata[];
  }

  /**
   * Supprime ses propres suggestions en attente
   */
  async deleteSuggestion(metadataId: string): Promise<void> {
    const { error } = await supabase
      .from('historical_figures_metadata')
      .delete()
      .eq('id', metadataId);

    if (error) {
      console.error('Erreur lors de la suppression de la suggestion:', error);
      throw error;
    }
  }

  /**
   * Vérifie si un utilisateur est admin
   */
  async isUserAdmin(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Erreur lors de la vérification des droits admin:', error);
      return false;
    }

    return data?.is_admin || false;
  }
}

export const historicalFiguresService = new HistoricalFiguresService();