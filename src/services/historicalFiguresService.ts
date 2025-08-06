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
    try {
      // Données réalistes pour la quête témoin Fontainebleau
      if (questId && questId.includes('fontainebleau')) {
        return [
          {
            id: '1',
            quest_id: questId,
            figure_name: 'François Ier',
            figure_role: 'Roi de France',
            figure_period: '1515-1547',
            wikipedia_url: 'https://fr.wikipedia.org/wiki/François_Ier_(roi_de_France)',
            description: 'Roi bâtisseur de Fontainebleau, passionné d\'art et de culture Renaissance. Créateur de la première École de Fontainebleau.',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Francis_I_of_France.jpg/300px-Francis_I_of_France.jpg',
            status: 'verified' as const,
            suggested_by: 'marie-dubois',
            verified_by: 'marie-dubois',
            verified_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            quest_id: questId,
            figure_name: 'Diane de Poitiers',
            figure_role: 'Duchesse de Valentinois',
            figure_period: '1499-1566',
            wikipedia_url: 'https://fr.wikipedia.org/wiki/Diane_de_Poitiers',
            description: 'Maîtresse d\'Henri II, figure influente de la cour de Fontainebleau. Mécène des arts et protectrice des jardins du château.',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Diane_de_Poitiers.jpg/300px-Diane_de_Poitiers.jpg',
            status: 'verified' as const,
            suggested_by: 'jean-moreau',
            verified_by: 'marie-dubois',
            verified_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            quest_id: questId,
            figure_name: 'Napoléon Bonaparte',
            figure_role: 'Empereur des Français',
            figure_period: '1804-1814',
            wikipedia_url: 'https://fr.wikipedia.org/wiki/Napoléon_Ier',
            description: 'Rénovateur de Fontainebleau, y vécut ses derniers moments de pouvoir avant l\'abdication de 1814. Fit du château sa résidence favorite.',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg/300px-Jacques-Louis_David_-_The_Emperor_Napoleon_in_His_Study_at_the_Tuileries_-_Google_Art_Project.jpg',
            status: 'verified' as const,
            suggested_by: 'pierre-fontaine',
            verified_by: 'marie-dubois',
            verified_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            quest_id: questId,
            figure_name: 'Rosso Fiorentino',
            figure_role: 'Peintre de l\'École de Fontainebleau',
            figure_period: '1494-1540',
            wikipedia_url: 'https://fr.wikipedia.org/wiki/Rosso_Fiorentino',
            description: 'Peintre italien de la première École de Fontainebleau, créateur des fresques de la Galerie François Ier.',
            image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Rosso_Fiorentino_-_Self-Portrait_-_WGA20122.jpg/300px-Rosso_Fiorentino_-_Self-Portrait_-_WGA20122.jpg',
            status: 'verified' as const,
            suggested_by: 'anna-rousseau',
            verified_by: 'marie-dubois',
            verified_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }

      // Pour les autres quêtes, interroger la base de données
      const { data, error } = await supabase
        .from('historical_figures_metadata')
        .select('*')
        .eq('quest_id', questId)
        .eq('status', 'verified')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des métadonnées des personnages:', error);
        return [];
      }

      return (data || []) as HistoricalFigureMetadata[];
    } catch (error) {
      console.error('Error in getHistoricalFiguresMetadata:', error);
      return [];
    }
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