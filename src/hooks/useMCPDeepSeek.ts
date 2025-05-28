
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MCPSearchRequest {
  query: string;
  toolRequests?: string[];
  contextData?: Record<string, any>;
}

export interface MCPSearchResponse {
  success: boolean;
  response: any;
  mcpTools: any[];
  mcpToolResults?: any[];
  timestamp: string;
  processingTime?: number;
  error?: string;
}

export interface MCPToolResult {
  toolName: string;
  result: any;
  error?: string;
  callId: string;
}

export const useMCPDeepSeek = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<MCPSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    console.log('🚀 Starting MCP search with request:', request);
    setIsLoading(true);
    setError(null);

    try {
      // Validation côté client
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('La requête ne peut pas être vide');
      }

      if (request.query.length > 5000) {
        throw new Error('La requête est trop longue (maximum 5000 caractères)');
      }

      console.log('📡 Calling MCP DeepSeek Search function...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request
      });

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw new Error(`Erreur de la fonction: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      console.log('✅ MCP search completed:', { 
        success: data.success, 
        hasResponse: !!data.response,
        toolResults: data.mcpToolResults?.length || 0,
        processingTime: data.processingTime 
      });

      setLastResponse(data);
      return data;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ MCP DeepSeek Search Error:', err);
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const analyzeSymbol = useCallback(async (symbolName: string, culture?: string, period?: string) => {
    return searchWithMCP({
      query: `Analyze the symbol "${symbolName}" ${culture ? `from ${culture} culture` : ''} ${period ? `during ${period}` : ''}. Provide deep cultural analysis, historical context, and symbolic significance.`,
      toolRequests: ['symbol_analyzer'],
      contextData: { symbolName, culture, period }
    });
  }, [searchWithMCP]);

  const getCulturalContext = useCallback(async (culture: string, timeframe?: string, region?: string) => {
    return searchWithMCP({
      query: `Provide rich cultural context for ${culture} ${timeframe ? `during ${timeframe}` : ''} ${region ? `in ${region}` : ''}. Include historical background, cultural characteristics, and symbolic traditions.`,
      toolRequests: ['cultural_context_provider'],
      contextData: { culture, timeframe, region }
    });
  }, [searchWithMCP]);

  const detectPatterns = useCallback(async (symbols: any[], startPeriod?: string, endPeriod?: string) => {
    return searchWithMCP({
      query: `Detect temporal patterns and evolutionary changes in the following symbols: ${symbols.map(s => s.name).join(', ')} ${startPeriod && endPeriod ? `from ${startPeriod} to ${endPeriod}` : ''}`,
      toolRequests: ['temporal_pattern_detector'],
      contextData: { symbols, startPeriod, endPeriod }
    });
  }, [searchWithMCP]);

  const compareSymbols = useCallback(async (symbol1: any, symbol2: any, comparisonType: 'semantic' | 'visual' | 'functional' | 'historical' = 'semantic') => {
    return searchWithMCP({
      query: `Compare ${symbol1.name} and ${symbol2.name} using ${comparisonType} analysis. Identify similarities, differences, and cross-cultural influences.`,
      toolRequests: ['cross_cultural_comparator'],
      contextData: { symbol1, symbol2, comparisonType }
    });
  }, [searchWithMCP]);

  const synthesizeResearch = useCallback(async (query: string, sources?: any[], synthesisType: 'comparative' | 'evolutionary' | 'thematic' = 'thematic') => {
    return searchWithMCP({
      query: `Synthesize research findings for: ${query}. Provide academic insights, key findings, and research recommendations.`,
      toolRequests: ['research_synthesizer'],
      contextData: { query, sources, synthesisType }
    });
  }, [searchWithMCP]);

  const getCachedResult = useCallback(async (cacheKey: string) => {
    try {
      const { data, error } = await supabase
        .from('mobile_cache_data')
        .select('data, expires_at')
        .eq('cache_type', 'mcp_deepseek_search')
        .eq('cache_key', cacheKey)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        return null;
      }

      return data.data;
    } catch (err) {
      console.error('Cache lookup error:', err);
      return null;
    }
  }, []);

  return {
    // Core functions
    searchWithMCP,
    
    // Specialized functions
    analyzeSymbol,
    getCulturalContext,
    detectPatterns,
    compareSymbols,
    synthesizeResearch,
    
    // Utility functions
    getCachedResult,
    
    // State
    isLoading,
    lastResponse,
    error,
    
    // Clear functions
    clearError: () => setError(null),
    clearLastResponse: () => setLastResponse(null)
  };
};

export default useMCPDeepSeek;
