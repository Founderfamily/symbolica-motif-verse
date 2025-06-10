
import { MCPService } from '@/services/mcpService';
import { TreasureQuest } from '@/types/quests';
import { QuestEnrichmentRequest, QuestEnrichmentResponse } from './types';

class QuestEnrichmentService {
  async enrichField(request: QuestEnrichmentRequest): Promise<QuestEnrichmentResponse> {
    try {
      console.log('Début enrichissement:', {
        field: request.field,
        provider: request.provider,
        questId: request.questId
      });

      const prompt = this.generatePrompt(request);
      const provider = request.provider || 'deepseek';
      
      const response = await MCPService.search(prompt, provider);
      
      if (!response.success) {
        throw new Error(`Erreur ${provider}: ${response.error || 'Réponse invalide'}`);
      }

      if (!response.content) {
        throw new Error(`Aucun contenu reçu de ${provider}`);
      }

      const enrichedValue = this.processFieldContent(request.field, response.content, request);
      
      const confidence = this.calculateConfidence(provider, request.field);

      return {
        enrichedValue,
        suggestions: this.generateSuggestions(provider, request.field),
        confidence,
        provider: response.provider || provider
      };

    } catch (error) {
      console.error('Erreur enrichissement:', error);
      throw new Error(`Impossible d'enrichir le champ "${request.field}": ${error.message}`);
    }
  }

  private generatePrompt(request: QuestEnrichmentRequest): string {
    const { field, currentValue, questContext } = request;
    const questType = questContext.quest_type || 'templar';
    const title = questContext.title || 'Quête inconnue';

    switch (field) {
      case 'story_background':
        return `En tant qu'historien expert, enrichis le contexte historique de cette quête intitulée "${title}".
        
        Contexte actuel : ${currentValue || 'Aucun contexte défini'}
        Type de quête : ${questType}
        
        Écris un contexte historique riche en environ 800 mots maximum en français.`;

      case 'description':
        return `Améliore la description de cette quête historique intitulée "${title}".
        
        Description actuelle : ${currentValue || 'Aucune description'}
        
        Crée une description engageante de 2 à 3 paragraphes en français.`;

      case 'clues':
        return `Enrichis les indices de cette quête "${title}".
        
        Indices actuels : ${JSON.stringify(currentValue, null, 2)}
        
        Réponds UNIQUEMENT avec le JSON enrichi valide.`;

      case 'target_symbols':
        return `Suggère des symboles pertinents pour cette quête "${title}".
        
        Symboles actuels : ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
        
        Réponds avec une liste de noms de symboles séparés par des virgules.`;

      default:
        return `Aide à enrichir le champ ${field} pour la quête "${title}".`;
    }
  }

  private processFieldContent(field: string, content: string, request: QuestEnrichmentRequest): any {
    if (field === 'clues') {
      try {
        let cleanedContent = content.trim();
        
        if (cleanedContent.startsWith('```json') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(7, -3).trim();
        } else if (cleanedContent.startsWith('```') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(3, -3).trim();
        }
        
        return JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('Erreur parsing JSON:', parseError);
        return request.currentValue;
      }
    } else if (field === 'target_symbols') {
      return content.trim().split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
    } else {
      return content.trim();
    }
  }

  private calculateConfidence(provider: string, field: string): number {
    const baseConfidence = { 'deepseek': 88, 'openai': 85, 'anthropic': 90 };
    const fieldModifier = { 'story_background': 5, 'description': 0, 'clues': -5, 'target_symbols': -10 };
    
    return Math.min(95, (baseConfidence[provider as keyof typeof baseConfidence] || 80) + (fieldModifier[field as keyof typeof fieldModifier] || 0));
  }

  private generateSuggestions(provider: string, field: string): string[] {
    return [
      `Contenu enrichi avec ${provider}`,
      'Vérifiez la cohérence historique',
      'Adaptez selon vos besoins'
    ];
  }

  async saveEnrichedQuest(questId: string, updates: Partial<TreasureQuest>): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
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

      console.log('Quête sauvegardée avec succès');
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      throw error;
    }
  }
}

export const questEnrichmentService = new QuestEnrichmentService();
