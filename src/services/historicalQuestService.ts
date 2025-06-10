
import { supabase } from '@/integrations/supabase/client';
import { historicalQuests } from '@/data/historicalQuests';

interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const historicalQuestService = {
  async populateHistoricalQuests(): Promise<ServiceResponse> {
    try {
      console.log('Starting to populate historical quests...');
      
      // Check if quests already exist
      const { data: existingQuests, error: checkError } = await supabase
        .from('treasure_quests')
        .select('title')
        .in('title', historicalQuests.map(q => q.title));
      
      if (checkError) {
        console.error('Error checking existing quests:', checkError);
        return {
          success: false,
          message: 'Erreur lors de la vérification des quêtes existantes',
          error: checkError.message
        };
      }
      
      const existingTitles = existingQuests?.map(q => q.title) || [];
      const newQuests = historicalQuests.filter(q => !existingTitles.includes(q.title));
      
      if (newQuests.length === 0) {
        console.log('All historical quests already exist');
        return { 
          success: true, 
          message: `Toutes les quêtes (${existingQuests?.length || 0}) sont déjà présentes`,
          data: existingQuests
        };
      }
      
      // Convert quests to database format, excluding created_by to avoid foreign key issues
      const questsForDb = newQuests.map(quest => ({
        title: quest.title,
        description: quest.description,
        story_background: quest.story_background,
        quest_type: quest.quest_type,
        difficulty_level: quest.difficulty_level,
        max_participants: quest.max_participants,
        min_participants: quest.min_participants,
        status: quest.status,
        start_date: quest.start_date,
        end_date: quest.end_date,
        reward_points: quest.reward_points,
        special_rewards: quest.special_rewards as any,
        clues: quest.clues as any,
        target_symbols: quest.target_symbols,
        translations: quest.translations as any
        // Note: created_by is intentionally excluded to avoid foreign key constraint violations
      }));
      
      console.log(`Attempting to insert ${questsForDb.length} new quests`);
      
      // Insert new quests
      const { data, error } = await supabase
        .from('treasure_quests')
        .insert(questsForDb)
        .select();
      
      if (error) {
        console.error('Error inserting quests:', error);
        return {
          success: false,
          message: 'Erreur lors de l\'insertion des quêtes',
          error: error.message
        };
      }
      
      console.log(`Successfully inserted ${newQuests.length} historical quests`);
      return { 
        success: true, 
        message: `${newQuests.length} nouvelle(s) quête(s) historique(s) ajoutée(s) avec succès`,
        data: data
      };
      
    } catch (error) {
      console.error('Unexpected error populating historical quests:', error);
      return { 
        success: false, 
        message: 'Erreur inattendue lors du chargement des quêtes',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async getHistoricalQuestByType(questType: string): Promise<ServiceResponse> {
    try {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('quest_type', questType)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) {
        return {
          success: false,
          message: 'Erreur lors de la récupération de la quête',
          error: error.message
        };
      }

      return { 
        success: true, 
        message: 'Quête récupérée avec succès',
        data: data
      };
      
    } catch (error) {
      return { 
        success: false, 
        message: 'Erreur inattendue lors de la récupération',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  },

  async updateQuestProgress(questId: string, userId: string, clueIndex: number, discoveryData: any): Promise<ServiceResponse> {
    try {
      const { data, error } = await supabase
        .from('quest_progress')
        .insert({
          quest_id: questId,
          user_id: userId,
          clue_index: clueIndex,
          discovery_data: discoveryData,
          validated: false,
          points_earned: 0
        })
        .select()
        .single();
      
      if (error) {
        return {
          success: false,
          message: 'Erreur lors de la mise à jour de la progression',
          error: error.message
        };
      }

      return { 
        success: true, 
        message: 'Progression mise à jour avec succès',
        data: data
      };
      
    } catch (error) {
      return { 
        success: false, 
        message: 'Erreur inattendue lors de la mise à jour',
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
};
