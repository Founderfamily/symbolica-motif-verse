
import { MCPService } from '@/services/mcpService';
import { TreasureQuest } from '@/types/quests';
import { QuestEnrichmentRequest, QuestEnrichmentResponse } from './types';
import { supabase } from '@/integrations/supabase/client';

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
    const period = this.getQuestPeriod(questType);

    switch (field) {
      case 'story_background':
        return `En tant qu'historien expert des ${period}, enrichis le contexte historique de cette quête intitulée "${title}".
        
        Contexte actuel : ${currentValue || 'Aucun contexte défini'}
        Type de quête : ${questType}
        
        Écris un contexte historique riche et précis en incluant les événements historiques pertinents, les personnages clés de l'époque, les enjeux sociopolitiques et les détails culturels authentiques. 
        
        IMPORTANT : Réponds uniquement avec un texte narratif fluide. N'utilise AUCUN formatage markdown, astérisques, tirets, puces, listes numérotées ou titres. Écris environ 800 mots maximum en paragraphes continus.
        
        Réponds uniquement avec le texte enrichi en français.`;

      case 'description':
        return `Améliore la description de cette quête historique intitulée "${title}".
        
        Description actuelle : ${currentValue || 'Aucune description'}
        Type : ${questType}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Crée une description engageante qui capture l'essence de la quête et motivera les participants tout en restant fidèle au contexte historique. 
        
        IMPORTANT : Réponds uniquement avec un texte narratif fluide de 2 à 3 paragraphes maximum. N'utilise AUCUN formatage markdown, astérisques, tirets ou listes. Style narratif mystérieux et captivant en français.
        
        Réponds uniquement avec le texte de la description.`;

      case 'clues':
        return `Enrichis les indices de cette quête "${title}" (${questType}).
        
        Indices actuels : ${JSON.stringify(currentValue, null, 2)}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Pour chaque indice, améliore la description en la rendant plus immersive, rends le hint plus cryptique mais résolvable, et ajoute des détails historiques authentiques. Conserve exactement la même structure JSON mais enrichis uniquement le contenu textuel.
        
        IMPORTANT : Réponds UNIQUEMENT avec le JSON enrichi valide, sans texte d'explication, sans formatage markdown. Le JSON doit être directement parsable.`;

      case 'target_symbols':
        return `Suggère des symboles pertinents pour cette quête "${title}" (${questType}).
        
        Symboles actuels : ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Suggère entre 3 et 5 symboles historiquement appropriés comme les croix templières, sceaux, emblèmes, symboles de l'époque concernée, éléments architecturaux typiques ou marques de guildes et ordres.
        
        IMPORTANT : Réponds avec une liste de noms de symboles séparés par des virgules uniquement, sans explication, sans formatage.`;

      default:
        return `Aide à enrichir le champ ${field} pour la quête "${title}". Réponds avec un texte fluide sans formatage markdown.`;
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

  private processFieldContent(field: string, content: string, request: QuestEnrichmentRequest): any {
    console.log('Traitement du contenu pour le champ:', {
      field,
      contentLength: content?.length,
      contentType: typeof content,
      isJSON: field === 'clues'
    });

    if (field === 'clues') {
      try {
        let cleanedContent = content.trim();
        
        if (cleanedContent.startsWith('```json') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(7, -3).trim();
        } else if (cleanedContent.startsWith('```') && cleanedContent.endsWith('```')) {
          cleanedContent = cleanedContent.slice(3, -3).trim();
        }
        
        if (cleanedContent.startsWith('`') && cleanedContent.endsWith('`')) {
          cleanedContent = cleanedContent.slice(1, -1).trim();
        }
        
        console.log('Contenu nettoyé pour parsing JSON:', {
          original: content.substring(0, 100) + '...',
          cleaned: cleanedContent.substring(0, 100) + '...',
          startsWithBrace: cleanedContent.startsWith('{') || cleanedContent.startsWith('[')
        });
        
        const parsed = JSON.parse(cleanedContent);
        console.log('JSON parsé avec succès:', { type: typeof parsed, isArray: Array.isArray(parsed) });
        return parsed;
      } catch (parseError) {
        console.error('Erreur de parsing JSON pour les indices:', {
          error: parseError.message,
          contentPreview: content.substring(0, 200),
          contentLength: content.length
        });
        return request.currentValue;
      }
    } else if (field === 'target_symbols') {
      const cleanedContent = content.trim();
      return cleanedContent
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);
    } else {
      return this.cleanMarkdownFormatting(content);
    }
  }

  private cleanMarkdownFormatting(content: string): string {
    if (!content) return content;
    
    let cleaned = content
      .replace(/^\s*\*{2,}\s*/gm, '')
      .replace(/\*{3,}/g, '')
      .replace(/^\s*-{2,}\s+/gm, '')
      .replace(/^\s*•\s+/gm, '')
      .replace(/^\s*[\d]+\.\s+/gm, '')
      .replace(/#{1,6}\s+/g, '')
      .replace(/`{1,3}/g, '')
      .trim();
    
    cleaned = cleaned
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s{3,}/g, ' ')
      .trim();
    
    return cleaned;
  }

  private calculateConfidence(provider: string, field: string): number {
    const baseConfidence = { 'deepseek': 88, 'openai': 85, 'anthropic': 90 };
    const fieldModifier = { 'story_background': 5, 'description': 0, 'clues': -5, 'target_symbols': -10 };
    
    return Math.min(95, (baseConfidence[provider as keyof typeof baseConfidence] || 80) + (fieldModifier[field as keyof typeof fieldModifier] || 0));
  }

  private generateSuggestions(provider: string, field: string): string[] {
    const providerDisplayName = this.getProviderDisplayName(provider);
    
    return [
      `Contenu enrichi avec ${providerDisplayName}`,
      'Vérifiez la cohérence historique',
      'Adaptez selon vos besoins spécifiques',
      field === 'clues' ? 'Validez la structure JSON' : 'Révisez le style narratif'
    ];
  }

  private getProviderDisplayName(provider: string): string {
    switch (provider) {
      case 'deepseek':
        return 'DeepSeek';
      case 'openai':
        return 'OpenAI GPT-4o';
      case 'anthropic':
        return 'Claude 3 Haiku';
      default:
        return provider;
    }
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
