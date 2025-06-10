
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest } from '@/types/quests';

export class QuestSavingService {
  async saveEnrichedQuest(questId: string, updates: Partial<TreasureQuest>): Promise<void> {
    try {
      const supabaseUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      if (updates.clues) {
        supabaseUpdates.clues = JSON.stringify(updates.clues);
      }

      if (updates.target_symbols) {
        supabaseUpdates.target_symbols = Array.isArray(updates.target_symbols) 
          ? updates.target_symbols 
          : [updates.target_symbols];
      }

      const { error } = await supabase
        .from('treasure_quests')
        .update(supabaseUpdates)
        .eq('id', questId);

      if (error) {
        throw error;
      }

      console.log('Quête enrichie sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      throw error;
    }
  }
}

export const questSavingService = new QuestSavingService();
