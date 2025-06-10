
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestClue } from '@/types/quests';

export interface QuestEnrichmentRequest {
  questId: string;
  field: 'story_background' | 'description' | 'clues' | 'target_symbols';
  currentValue: any;
  questContext: Partial<TreasureQuest>;
  provider?: 'deepseek' | 'openai' | 'anthropic';
}

export interface QuestEnrichmentResponse {
  enrichedValue: any;
  suggestions: string[];
  confidence: number;
  provider: string;
  success: boolean;
  error?: string;
}

class QuestEnrichmentService {
  async enrichField(request: QuestEnrichmentRequest): Promise<QuestEnrichmentResponse> {
    try {
      const provider = request.provider || 'deepseek';
      
      console.log(`Enrichissement de ${request.field} avec ${provider} pour la quête ${request.questId}`);

      // Appeler la edge function d'enrichissement
      const { data, error } = await supabase.functions.invoke('quest-enrichment', {
        body: {
          field: request.field,
          currentValue: request.currentValue,
          questContext: request.questContext,
          provider: provider,
          questType: request.questContext.quest_type || 'templar',
          title: request.questContext.title || 'Quête inconnue'
        }
      });

      if (error) {
        console.error('Erreur de la edge function:', error);
        throw new Error(`Erreur d'enrichissement: ${error.message}`);
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Erreur inconnue lors de l\'enrichissement');
      }

      return {
        enrichedValue: data.enrichedValue,
        suggestions: data.suggestions || [],
        confidence: data.confidence || 80,
        provider: data.provider || provider,
        success: true
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      
      // Fallback vers des réponses par défaut améliorées
      return this.generateFallbackResponse(request, error.message);
    }
  }

  private generateFallbackResponse(request: QuestEnrichmentRequest, errorMessage: string): QuestEnrichmentResponse {
    const { field, currentValue, questContext } = request;
    
    let fallbackValue: any;
    
    switch (field) {
      case 'story_background':
        fallbackValue = currentValue || `Au cœur de l'Europe médiévale, une quête mystérieuse attend d'être révélée. Les secrets du passé résonnent encore dans les pierres anciennes, et seuls les plus courageux découvriront la vérité cachée derrière cette histoire légendaire.`;
        break;
        
      case 'description':
        fallbackValue = currentValue || `Une quête fascinante vous attend, pleine de mystères et de découvertes historiques. Partez à la recherche d'indices cachés et percez les secrets de l'histoire.`;
        break;
        
      case 'clues':
        if (!currentValue || !Array.isArray(currentValue)) {
          fallbackValue = [
            {
              id: 1,
              description: "Un symbole ancien gravé dans la pierre",
              hint: "Cherchez les marques laissées par ceux qui vous ont précédés",
              location: "Entrée principale"
            }
          ];
        } else {
          fallbackValue = currentValue;
        }
        break;
        
      case 'target_symbols':
        fallbackValue = Array.isArray(currentValue) && currentValue.length > 0 
          ? currentValue 
          : ['Croix templière', 'Sceau royal', 'Rose mystique'];
        break;
        
      default:
        fallbackValue = currentValue || 'Contenu enrichi par défaut';
    }

    return {
      enrichedValue: fallbackValue,
      suggestions: [
        'Mode hors ligne - contenu par défaut',
        `Erreur: ${errorMessage}`,
        'Reconnectez-vous pour un enrichissement IA'
      ],
      confidence: 50,
      provider: 'fallback',
      success: false,
      error: `Service IA indisponible: ${errorMessage}`
    };
  }

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

export const questEnrichmentService = new QuestEnrichmentService();
