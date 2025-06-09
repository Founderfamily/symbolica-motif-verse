
import { supabase } from '@/integrations/supabase/client';
import { historicalQuests } from '@/data/historicalQuests';

export const historicalQuestService = {
  async populateHistoricalQuests() {
    try {
      console.log('Starting to populate historical quests...');
      
      // Check if quests already exist
      const { data: existingQuests } = await supabase
        .from('treasure_quests')
        .select('title')
        .in('title', historicalQuests.map(q => q.title));
      
      const existingTitles = existingQuests?.map(q => q.title) || [];
      const newQuests = historicalQuests.filter(q => !existingTitles.includes(q.title));
      
      if (newQuests.length === 0) {
        console.log('All historical quests already exist');
        return { success: true, message: 'All quests already exist' };
      }
      
      // Insert new quests
      const { data, error } = await supabase
        .from('treasure_quests')
        .insert(newQuests)
        .select();
      
      if (error) {
        throw error;
      }
      
      console.log(`Successfully inserted ${newQuests.length} historical quests`);
      return { 
        success: true, 
        message: `Inserted ${newQuests.length} new historical quests`,
        data 
      };
      
    } catch (error) {
      console.error('Error populating historical quests:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async getHistoricalQuestByType(questType: string) {
    try {
      const { data, error } = await supabase
        .from('treasure_quests')
        .select('*')
        .eq('quest_type', questType)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
      
    } catch (error) {
      console.error('Error fetching historical quest:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  },

  async updateQuestProgress(questId: string, userId: string, clueIndex: number, discoveryData: any) {
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
      
      if (error) throw error;
      return { success: true, data };
      
    } catch (error) {
      console.error('Error updating quest progress:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
};
