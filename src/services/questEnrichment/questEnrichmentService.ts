
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
      
      console.log(`Enrichissement avec ${provider}:`, prompt);

      const response = await MCPService.search(prompt, provider);
      
      if (!response.success) {
        throw new Error(response.error || 'Erreur lors de l\'enrichissement');
      }

      const enrichedValue = contentCleaningService.processFieldContent(
        request.field, 
        response.content!, 
        request
      );

      let confidence = utilityService.calculateConfidence(provider, request.field);

      // Ajuster la confiance si il y a eu une erreur de parsing
      if (request.field === 'clues' && enrichedValue === request.currentValue) {
        confidence = Math.max(30, confidence - 30);
      }

      return {
        enrichedValue,
        suggestions: utilityService.generateSuggestions(provider, request.field),
        confidence,
        provider: response.provider || provider
      };

    } catch (error) {
      console.error('Erreur lors de l\'enrichissement:', error);
      throw error;
    }
  }

  async saveEnrichedQuest(questId: string, updates: Partial<TreasureQuest>): Promise<void> {
    return questSavingService.saveEnrichedQuest(questId, updates);
  }
}

export const questEnrichmentService = new QuestEnrichmentService();
export * from './types';
