
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

      const { data, error } = await supabase.functions.invoke('mcp-search', {
        body: {
          query: sanitizedQuery,
          provider,
        },
      });

      if (error) {
        throw new Error(error.message || 'Search service temporarily unavailable');
      }

      // 'data' is expected to be the edge func response object
      if (!data) {
        throw new Error('No response from MCP service');
      }

      // Defensive: sometimes data may not be parsed
      let result: MCPSearchResponse;
      if (typeof data === 'string') {
        try {
          result = JSON.parse(data);
        } catch {
          // fallback: treat as raw content
          result = {
            success: true,
            content: data,
            provider,
            timestamp: new Date().toISOString(),
            processingTime: 0,
          };
        }
      } else {
        result = data as MCPSearchResponse;
      }

      return result;
    } catch (error: any) {
      console.error('MCP Search error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Search service temporarily unavailable',
        timestamp: new Date().toISOString(),
        processingTime: 0,
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

