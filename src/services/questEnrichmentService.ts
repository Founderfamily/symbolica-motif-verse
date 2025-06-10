
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
}

class QuestEnrichmentService {
  private generatePrompt(request: QuestEnrichmentRequest): string {
    const { field, currentValue, questContext } = request;
    const questType = questContext.quest_type || 'templar';
    const title = questContext.title || 'Quête inconnue';
    const period = this.getQuestPeriod(questType);

    switch (field) {
      case 'story_background':
        return `En tant qu'historien expert des ${period}, enrichis le contexte historique de cette quête : "${title}".
        
        Contexte actuel : ${currentValue || 'Aucun contexte défini'}
        Type de quête : ${questType}
        
        Fournis un contexte historique riche et précis avec :
        - Les événements historiques pertinents
        - Les personnages clés de l'époque
        - Les enjeux sociopolitiques
        - Les détails culturels authentiques
        
        Réponds en français, style narratif captivant mais historiquement précis (maximum 800 mots).`;

      case 'description':
        return `Améliore la description de cette quête historique : "${title}".
        
        Description actuelle : ${currentValue || 'Aucune description'}
        Type : ${questType}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Crée une description engageante qui :
        - Capture l'essence de la quête
        - Motivera les participants
        - Reste fidèle au contexte historique
        - Fait 2-3 paragraphes maximum
        
        Réponds en français, ton mystérieux et captivant.`;

      case 'clues':
        return `Enrichis les indices de cette quête "${title}" (${questType}).
        
        Indices actuels : ${JSON.stringify(currentValue, null, 2)}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Pour chaque indice, améliore :
        - La description (plus immersive)
        - Le hint (plus cryptique mais résolvable)
        - Les détails historiques authentiques
        
        Garde la même structure JSON mais enrichis le contenu.
        Réponds uniquement avec le JSON enrichi, sans explication supplémentaire.`;

      case 'target_symbols':
        return `Suggère des symboles pertinents pour cette quête "${title}" (${questType}).
        
        Symboles actuels : ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Suggère 3-5 symboles historiquement appropriés :
        - Croix templières, sceaux, emblèmes
        - Symboles de l'époque concernée
        - Éléments architecturaux typiques
        - Marques de guildes ou ordres
        
        Réponds avec une liste de noms de symboles séparés par des virgules, sans explication.`;

      default:
        return `Aide à enrichir le champ ${field} pour la quête "${title}".`;
    }
  }

  private getQuestPeriod(questType: string): string {
    switch (questType) {
      case 'templar':
        return 'Templiers (XIIe-XIVe siècles)';
      case 'grail':
        return 'quêtes du Graal (époque médiévale)';
      case 'lost_civilization':
        return 'civilisations perdues';
      default:
        return 'périodes historiques';
    }
  }

  async enrichField(request: QuestEnrichmentRequest): Promise<QuestEnrichmentResponse> {
    try {
      const prompt = this.generatePrompt(request);
      const provider = request.provider || 'deepseek';
      
      console.log(`Enrichissement avec ${provider}:`, prompt);

      // Simuler une réponse pour le moment
      const mockResponse = this.generateMockResponse(request);
      
      return {
        enrichedValue: mockResponse,
        suggestions: this.generateSuggestions(provider, request.field),
        confidence: this.calculateConfidence(provider, request.field),
        provider: provider
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      throw error;
    }
  }

  private generateMockResponse(request: QuestEnrichmentRequest): any {
    const { field, currentValue } = request;
    
    switch (field) {
      case 'story_background':
        return currentValue ? `${currentValue}\n\nContexte enrichi avec des détails historiques supplémentaires...` : 'Contexte historique enrichi...';
      
      case 'description':
        return currentValue ? `${currentValue}\n\nDescription améliorée avec plus de détails captivants...` : 'Description enrichie...';
      
      case 'clues':
        if (Array.isArray(currentValue)) {
          return currentValue.map((clue: any) => ({
            ...clue,
            description: clue.description ? `${clue.description} (enrichi)` : 'Description enrichie',
            hint: clue.hint ? `${clue.hint} (amélioré)` : 'Indice amélioré'
          }));
        }
        return [];
      
      case 'target_symbols':
        const baseSymbols = Array.isArray(currentValue) ? currentValue : [];
        return [...baseSymbols, 'Croix templière', 'Sceau royal', 'Symbole gothique'];
      
      default:
        return currentValue;
    }
  }

  private calculateConfidence(provider: string, field: string): number {
    const baseConfidence = {
      'deepseek': 88,
      'openai': 85,
      'anthropic': 90
    };

    const fieldModifier = {
      'story_background': 5,
      'description': 0,
      'clues': -5,
      'target_symbols': -10
    };

    return Math.min(95, (baseConfidence[provider as keyof typeof baseConfidence] || 85) + (fieldModifier[field as keyof typeof fieldModifier] || 0));
  }

  private generateSuggestions(provider: string, field: string): string[] {
    const providerNames = {
      'deepseek': 'DeepSeek',
      'openai': 'OpenAI GPT-4o',
      'anthropic': 'Claude 3 Haiku'
    };
    
    const providerName = providerNames[provider as keyof typeof providerNames] || provider;
    
    return [
      `Contenu enrichi avec ${providerName}`,
      'Vérifiez la cohérence historique',
      'Adaptez selon vos besoins spécifiques',
      field === 'clues' ? 'Validez la structure JSON' : 'Révisez le style narratif'
    ];
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
