
import { MCPService } from '@/services/mcpService';
import { TreasureQuest } from '@/types/quests';
import { promptGenerationService } from './promptGenerationService';
import { contentCleaningService } from './contentCleaningService';
import { questSavingService } from './questSavingService';
import { utilityService } from './utilityService';
import { QuestEnrichmentRequest, QuestEnrichmentResponse } from './types';

class QuestEnrichmentService {
  async enrichField(request: QuestEnrichmentRequest): Promise<QuestEnrichmentResponse> {
    try {
      const prompt = promptGenerationService.generatePrompt(request);
      const provider = request.provider || 'deepseek';
      
      console.log(`Enrichissement avec ${provider}:`, {
        field: request.field,
        provider,
        promptLength: prompt.length,
        questId: request.questId
      });

      const response = await MCPService.search(prompt, provider);
      
      console.log('Réponse MCP reçue:', {
        success: response.success,
        provider: response.provider,
        contentLength: response.content?.length,
        error: response.error,
        processingTime: response.processingTime
      });

      if (!response.success) {
        const errorDetails = {
          provider,
          error: response.error,
          field: request.field,
          questId: request.questId
        };
        console.error('Erreur MCP détaillée:', errorDetails);
        throw new Error(`Erreur ${provider}: ${response.error || 'Réponse invalide'}`);
      }

      if (!response.content) {
        throw new Error(`Aucun contenu reçu de ${provider}`);
      }

      console.log('Contenu brut reçu:', {
        field: request.field,
        contentPreview: response.content.substring(0, 200) + '...',
        isJSON: request.field === 'clues'
      });

      const enrichedValue = contentCleaningService.processFieldContent(
        request.field, 
        response.content, 
        request
      );

      console.log('Contenu traité:', {
        field: request.field,
        originalType: typeof response.content,
        processedType: typeof enrichedValue,
        success: enrichedValue !== request.currentValue
      });

      let confidence = utilityService.calculateConfidence(provider, request.field);

      // Ajuster la confiance si il y a eu une erreur de parsing
      if (request.field === 'clues' && enrichedValue === request.currentValue) {
        confidence = Math.max(30, confidence - 30);
        console.warn('Échec du parsing JSON pour les indices, confiance réduite à:', confidence);
      }

      return {
        enrichedValue,
        suggestions: utilityService.generateSuggestions(provider, request.field),
        confidence,
        provider: response.provider || provider
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', {
        error: error.message,
        stack: error.stack,
        field: request.field,
        provider: request.provider,
        questId: request.questId
      });
      
      // Relancer l'erreur avec plus de contexte
      throw new Error(`Impossible d'enrichir le champ "${request.field}": ${error.message}`);
    }
  }

  async saveEnrichedQuest(questId: string, updates: Partial<TreasureQuest>): Promise<void> {
    return questSavingService.saveEnrichedQuest(questId, updates);
  }
}

export const questEnrichmentService = new QuestEnrichmentService();
export * from './types';
