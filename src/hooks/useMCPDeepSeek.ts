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
  debug?: any;
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

  // Fonction de test debug séparée
  const testDebugMode = useCallback(async (): Promise<MCPSearchResponse> => {
    console.log('🧪 Starting DEBUG MODE test...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      console.log('📡 Calling MCP DeepSeek Debug endpoint...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: {},
        headers: {
          'X-Debug-Mode': 'true'
        }
      });

      if (functionError) {
        console.error('❌ Debug Function error:', functionError);
        throw new Error(`Erreur de la fonction debug: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur en mode debug');
      }

      const processingTime = Date.now() - startTime;
      console.log('✅ Debug test completed:', { 
        success: data.success, 
        hasApiTest: !!data.apiTest,
        environment: data.environment,
        processingTime 
      });

      const response = {
        ...data,
        processingTime
      };

      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test debug inconnue';
      console.error('❌ Debug Mode Error:', err);
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage,
        processingTime: Date.now() - startTime,
        debug: { testMode: true, failed: true }
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    console.log('🚀 Starting MCP search with request:', request);
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();
    
    // Timeout réduit à 10 secondes
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError('Timeout: La recherche a pris trop de temps (10s)');
    }, 10000);

    try {
      // Validation côté client renforcée
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('La requête ne peut pas être vide');
      }

      if (request.query.length > 1000) {
        throw new Error('La requête est trop longue (maximum 1000 caractères en mode debug)');
      }

      console.log('📡 Calling MCP DeepSeek Search function (simplified mode)...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request
      });

      clearTimeout(timeoutId);

      if (functionError) {
        console.error('❌ Function error:', functionError);
        throw new Error(`Erreur de la fonction: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      const processingTime = Date.now() - startTime;
      console.log('✅ MCP search completed:', { 
        success: data.success, 
        hasResponse: !!data.response,
        debug: data.debug,
        processingTime 
      });

      const response = {
        ...data,
        processingTime
      };

      setLastResponse(response);
      return response;

    } catch (err) {
      clearTimeout(timeoutId);
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('❌ MCP DeepSeek Search Error:', err);
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage,
        processingTime: Date.now() - startTime
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

  // Fonction de test simple modifiée
  const testConnection = useCallback(async () => {
    console.log('🔍 Testing MCP connection (simple mode)...');
    return searchWithMCP({
      query: 'Test simple: que signifie le symbole du lotus?',
      toolRequests: [],
      contextData: { test: true, simplified: true }
    });
  }, [searchWithMCP]);

  return {
    // Core functions
    searchWithMCP,
    testConnection,
    testDebugMode, // Nouvelle fonction de debug
    
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
