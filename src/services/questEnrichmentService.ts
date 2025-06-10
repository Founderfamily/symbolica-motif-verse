
import { MCPService, AIProvider } from '@/services/mcpService';
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestClue } from '@/types/quests';

export interface QuestEnrichmentRequest {
  questId: string;
  field: 'story_background' | 'description' | 'clues' | 'target_symbols';
  currentValue: any;
  questContext: Partial<TreasureQuest>;
  provider?: AIProvider;
}

export interface QuestEnrichmentResponse {
  enrichedValue: any;
  suggestions: string[];
  confidence: number;
  provider: string;
}

class QuestEnrichmentService {
  private cleanAIResponse(content: string): string {
    if (!content) return content;
    
    // Remove asterisks and bullet points
    let cleaned = content
      .replace(/^\s*\*\s+/gm, '') // Remove asterisks at start of lines
      .replace(/^\s*-\s+/gm, '') // Remove dashes at start of lines
      .replace(/^\s*•\s+/gm, '') // Remove bullet points at start of lines
      .replace(/\*\s+/g, '') // Remove asterisks followed by spaces
      .replace(/\s+\*/g, '') // Remove asterisks preceded by spaces
      .replace(/\*{2,}/g, '') // Remove multiple asterisks
      .replace(/^\s*[\d]+\.\s+/gm, '') // Remove numbered lists
      .trim();
    
    // Clean up extra spaces and line breaks
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove triple line breaks
      .replace(/\s{3,}/g, ' ') // Replace multiple spaces with single space
      .trim();
    
    return cleaned;
  }

  private generatePrompt(request: QuestEnrichmentRequest): string {
    const { field, currentValue, questContext } = request;
    const questType = questContext.quest_type || 'templar';
    const title = questContext.title || 'Quête inconnue';
    const period = this.getQuestPeriod(questType);

    switch (field) {
      case 'story_background':
        return `En tant qu'historien expert des ${period}, enrichis le contexte historique de cette quête intitulée "${title}".
        
        Contexte actuel : ${currentValue || 'Aucun contexte défini'}
        Type de quête : ${questType}
        
        Écris un contexte historique riche et précis en incluant les événements historiques pertinents, les personnages clés de l'époque, les enjeux sociopolitiques et les détails culturels authentiques. Rédige un texte fluide et narratif sans utiliser de listes à puces, d'astérisques ou de tirets. Le texte doit être captivant mais historiquement précis, d'environ 800 mots maximum.
        
        Réponds uniquement avec le texte enrichi, sans formatage markdown ni listes.`;

      case 'description':
        return `Améliore la description de cette quête historique intitulée "${title}".
        
        Description actuelle : ${currentValue || 'Aucune description'}
        Type : ${questType}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Crée une description engageante qui capture l'essence de la quête, motivera les participants et reste fidèle au contexte historique. La description doit faire 2 à 3 paragraphes maximum avec un ton mystérieux et captivant.
        
        Écris uniquement le texte de la description, sans utiliser de listes, d'astérisques ou de formatage spécial. Utilise un style narratif fluide en français.`;

      case 'clues':
        return `Enrichis les indices de cette quête "${title}" (${questType}).
        
        Indices actuels : ${JSON.stringify(currentValue, null, 2)}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Pour chaque indice, améliore la description en la rendant plus immersive, rends le hint plus cryptique mais résolvable, et ajoute des détails historiques authentiques. Conserve exactement la même structure JSON mais enrichis uniquement le contenu textuel.
        
        Réponds uniquement avec le JSON enrichi, sans explication supplémentaire ni formatage markdown.`;

      case 'target_symbols':
        return `Suggère des symboles pertinents pour cette quête "${title}" (${questType}).
        
        Symboles actuels : ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Suggère entre 3 et 5 symboles historiquement appropriés comme les croix templières, sceaux, emblèmes, symboles de l'époque concernée, éléments architecturaux typiques ou marques de guildes et ordres.
        
        Réponds avec une liste de noms de symboles séparés par des virgules, sans explication ni formatage spécial.`;

      default:
        return `Aide à enrichir le champ ${field} pour la quête "${title}". Réponds avec un texte fluide sans utiliser d'astérisques, de listes à puces ou de formatage markdown.`;
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

      const response = await MCPService.search(prompt, provider);
      
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'enrichissement');
      }

      let enrichedValue: any = response.content;
      let confidence = this.calculateConfidence(provider, request.field);

      // Nettoyage des astérisques et formatage indésirable
      if (typeof enrichedValue === 'string') {
        enrichedValue = this.cleanAIResponse(enrichedValue);
      }

      // Post-traitement selon le type de champ
      if (request.field === 'clues') {
        try {
          const cleanedContent = this.cleanAIResponse(response.content!);
          enrichedValue = JSON.parse(cleanedContent);
        } catch {
          confidence = Math.max(50, confidence - 20);
        }
      } else if (request.field === 'target_symbols') {
        const cleanedContent = this.cleanAIResponse(response.content!);
        enrichedValue = cleanedContent
          .split(',')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0);
      }

      return {
        enrichedValue,
        suggestions: this.generateSuggestions(provider, request.field),
        confidence,
        provider: response.provider || provider
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      throw error;
    }
  }

  private calculateConfidence(provider: AIProvider, field: string): number {
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

    return Math.min(95, baseConfidence[provider] + (fieldModifier[field] || 0));
  }

  private generateSuggestions(provider: string, field: string): string[] {
    const providerName = MCPService.getProviderDisplayName(provider as AIProvider);
    
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
