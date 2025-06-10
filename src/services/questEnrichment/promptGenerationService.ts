
import { QuestEnrichmentRequest } from './types';

export class PromptGenerationService {
  generatePrompt(request: QuestEnrichmentRequest): string {
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
}

export const promptGenerationService = new PromptGenerationService();
