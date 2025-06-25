
import { supabase } from '@/integrations/supabase/client';
import { historicalQuests } from '@/data/historicalQuests';

interface ServiceResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export const historicalQuestService = {
  async populateHistoricalQuests(forceReload: boolean = false): Promise<ServiceResponse> {
    try {
      console.log('🔄 Starting to populate historical quests...');
      console.log('📊 Total quests in historicalQuests.ts:', historicalQuests.length);
      
      // Check if quests already exist
      const { data: existingQuests, error: checkError } = await supabase
        .from('treasure_quests')
        .select('title')
        .order('created_at', { ascending: false });
      
      if (checkError) {
        console.error('❌ Error checking existing quests:', checkError);
        return {
          success: false,
          message: 'Erreur lors de la vérification des quêtes existantes',
          error: checkError.message
        };
      }
      
      console.log('📋 Existing quests in database:', existingQuests?.length || 0);
      console.log('📝 Existing quest titles:', existingQuests?.map(q => q.title) || []);
      
      const existingTitles = new Set(existingQuests?.map(q => q.title.trim().toLowerCase()) || []);
      console.log('🔍 Normalized existing titles:', Array.from(existingTitles));
      
      // Filter new quests more carefully
      const newQuests = historicalQuests.filter(quest => {
        const normalizedTitle = quest.title.trim().toLowerCase();
        const isNew = !existingTitles.has(normalizedTitle);
        console.log(`🔎 Checking "${quest.title}" (normalized: "${normalizedTitle}") - Is new: ${isNew}`);
        return isNew;
      });
      
      console.log('🆕 New quests to add:', newQuests.length);
      console.log('📜 New quest titles:', newQuests.map(q => q.title));
      
      if (!forceReload && newQuests.length === 0) {
        console.log('ℹ️ All historical quests already exist');
        return { 
          success: true, 
          message: `Toutes les quêtes (${existingQuests?.length || 0}) sont déjà présentes. Utilisez l'actualisation forcée si nécessaire.`,
          data: existingQuests
        };
      }
      
      const questsToProcess = forceReload ? historicalQuests : newQuests;
      console.log('⚙️ Processing quests:', questsToProcess.length);
      
      // Convert quests to database format
      const questsForDb = questsToProcess.map(quest => {
        console.log(`🔧 Converting quest: "${quest.title}"`);
        return {
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
        };
      });
      
      console.log(`💾 Attempting to insert ${questsForDb.length} quests`);
      
      // Insert new quests
      const { data, error } = await supabase
        .from('treasure_quests')
        .insert(questsForDb)
        .select();
      
      if (error) {
        console.error('❌ Error inserting quests:', error);
        return {
          success: false,
          message: 'Erreur lors de l\'insertion des quêtes',
          error: error.message
        };
      }
      
      console.log(`✅ Successfully inserted ${questsToProcess.length} historical quests`);
      return { 
        success: true, 
        message: forceReload 
          ? `${questsToProcess.length} quête(s) rechargée(s) avec succès`
          : `${questsToProcess.length} nouvelle(s) quête(s) historique(s) ajoutée(s) avec succès`,
        data: data
      };
      
    } catch (error) {
      console.error('💥 Unexpected error populating historical quests:', error);
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
