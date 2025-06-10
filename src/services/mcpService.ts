
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
    const sanitizedQuery = this.sanitizeInput(query);
    
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }
    
    if (sanitizedQuery.length > 2000) {
      throw new Error('Query too long');
    }

    console.log('Appel MCP avec:', {
      provider,
      queryLength: sanitizedQuery.length,
      queryPreview: sanitizedQuery.substring(0, 100) + '...'
    });

    try {
      const { data, error } = await supabase.functions.invoke('mcp-search', {
        body: { query: sanitizedQuery, provider }
      });

      if (error) {
        console.error('Erreur Supabase lors de l\'appel MCP:', {
          error,
          provider,
          message: error.message
        });
        throw new Error(`Erreur de service: ${error.message || 'Service temporairement indisponible'}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du service MCP');
      }

      console.log('Réponse MCP brute:', {
        success: data.success,
        hasContent: !!data.content,
        provider: data.provider,
        error: data.error
      });

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'appel MCP:', {
        error: error.message,
        provider,
        originalError: error
      });
      
      // Distinguer les types d'erreurs
      if (error.message?.includes('Function not found')) {
        throw new Error('Service d\'enrichissement non disponible. Veuillez contacter l\'administrateur.');
      }
      
      if (error.message?.includes('network') || error.message?.includes('timeout')) {
        throw new Error('Problème de connexion. Veuillez réessayer dans quelques instants.');
      }
      
      throw new Error(`Erreur du service d'enrichissement: ${error.message}`);
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
