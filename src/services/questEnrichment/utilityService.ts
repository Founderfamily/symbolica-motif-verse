
import { MCPService, AIProvider } from '@/services/mcpService';

export class UtilityService {
  calculateConfidence(provider: AIProvider, field: string): number {
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

    return Math.min(95, baseConfidence[provider] + (fieldModifier[field as keyof typeof fieldModifier] || 0));
  }

  generateSuggestions(provider: string, field: string): string[] {
    const providerName = MCPService.getProviderDisplayName(provider as AIProvider);
    
    return [
      `Contenu enrichi avec ${providerName}`,
      'Vérifiez la cohérence historique',
      'Adaptez selon vos besoins spécifiques',
      field === 'clues' ? 'Validez la structure JSON' : 'Révisez le style narratif'
    ];
  }
}

export const utilityService = new UtilityService();
