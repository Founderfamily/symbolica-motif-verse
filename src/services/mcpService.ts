
import { supabase } from '@/integrations/supabase/client';

export type AIProvider = 'deepseek' | 'openai' | 'anthropic';

export interface MCPSearchRequest {
  query: string;
  provider?: AIProvider;
}

export interface MCPSearchResponse {
  success: boolean;
  content?: string;
  provider?: string;
  error?: string;
  timestamp: string;
  processingTime: number;
}

export class MCPService {
  static async search(query: string, provider: AIProvider = 'deepseek'): Promise<MCPSearchResponse> {
    try {
      const sanitizedQuery = this.sanitizeInput(query);
      
      if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }
      
      if (sanitizedQuery.length > 2000) {
        throw new Error('Query too long');
      }

      // Pour le moment, retourner une réponse simulée pour éviter les erreurs
      return {
        success: true,
        content: `Réponse simulée pour: ${sanitizedQuery}`,
        provider: provider,
        timestamp: new Date().toISOString(),
        processingTime: 1000
      };

    } catch (error) {
      console.error('MCP Search error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search service temporarily unavailable',
        timestamp: new Date().toISOString(),
        processingTime: 0
      };
    }
  }

  static getAvailableProviders(): AIProvider[] {
    return ['deepseek', 'openai', 'anthropic'];
  }

  static getProviderDisplayName(provider: AIProvider): string {
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

  private static sanitizeInput(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();
  }
}
