
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
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }
    
    if (query.length > 2000) {
      throw new Error('Query too long');
    }

    console.log('Appel MCP:', { provider, queryLength: query.length });

    try {
      const { data, error } = await supabase.functions.invoke('mcp-search', {
        body: { query: query.trim(), provider }
      });

      if (error) {
        console.error('Erreur Supabase MCP:', error);
        throw new Error(`Erreur de service: ${error.message || 'Service indisponible'}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du service MCP');
      }

      return data;
    } catch (error) {
      console.error('Erreur appel MCP:', error);
      
      if (error.message?.includes('Function not found')) {
        throw new Error('Service d\'enrichissement non disponible');
      }
      
      throw new Error(`Erreur du service: ${error.message}`);
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
}
