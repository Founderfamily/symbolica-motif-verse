
import { MCPService } from '@/services/mcpService';
import { supabase } from '@/integrations/supabase/client';
import { TreasureQuest, QuestClue } from '@/types/quests';

export interface QuestEnrichmentRequest {
  questId: string;
  field: 'story_background' | 'description' | 'clues' | 'target_symbols';
  currentValue: any;
  questContext: Partial<TreasureQuest>;
}

export interface QuestEnrichmentResponse {
  enrichedValue: any;
  suggestions: string[];
  confidence: number;
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
        
        Réponds en français, style narratif captivant mais historiquement précis.`;

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
        Réponds uniquement avec le JSON enrichi.`;

      case 'target_symbols':
        return `Suggère des symboles pertinents pour cette quête "${title}" (${questType}).
        
        Symboles actuels : ${Array.isArray(currentValue) ? currentValue.join(', ') : currentValue}
        Contexte : ${questContext.story_background || 'Non défini'}
        
        Suggère 3-5 symboles historiquement appropriés :
        - Croix templières, sceaux, emblèmes
        - Symboles de l'époque concernée
        - Éléments architecturaux typiques
        - Marques de guildes ou ordres
        
        Réponds avec une liste de noms de symboles séparés par des virgules.`;

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
      console.log('Enrichissement avec prompt:', prompt);

      const response = await MCPService.search(prompt);
      
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'enrichissement');
      }

      let enrichedValue = response.content;
      let confidence = 85;

      // Post-traitement selon le type de champ
      if (request.field === 'clues') {
        try {
          // Essayer de parser comme JSON si c'est des indices
          enrichedValue = JSON.parse(response.content);
        } catch {
          // Si ce n'est pas du JSON valide, garder le texte
          confidence = 70;
        }
      } else if (request.field === 'target_symbols') {
        // Nettoyer la liste de symboles et retourner un array
        enrichedValue = response.content
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);
      }

      return {
        enrichedValue,
        suggestions: [
          'Contenu enrichi avec succès',
          'Vérifiez la cohérence historique',
          'Adaptez selon vos besoins'
        ],
        confidence
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      throw error;
    }
  }

  async saveEnrichedQuest(questId: string, updates: Partial<TreasureQuest>): Promise<void> {
    try {
      // Préparer les données pour Supabase en convertissant les types complexes
      const supabaseUpdates: any = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // Convertir les clues en JSON si nécessaire
      if (updates.clues) {
        supabaseUpdates.clues = JSON.stringify(updates.clues);
      }

      // Convertir target_symbols en array de strings pour Supabase
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
