
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

// Timeout de sécurité pour éviter les blocages
const FUNCTION_TIMEOUT = 15000; // 15 secondes
const SAFETY_TIMEOUT = 20000; // 20 secondes pour reset automatique

export const useMCPDeepSeek = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<MCPSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset automatique de sécurité
  const safetyReset = useCallback(() => {
    console.log('🔄 SAFETY: Force reset loading state');
    setIsLoading(false);
    setError(null);
  }, []);

  // Wrapper avec protection anti-blocage
  const withSafetyWrapper = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    console.log(`🛡️ SAFETY: Starting ${operationName} with protection`);
    
    // Timeout de sécurité automatique
    const safetyTimeoutId = setTimeout(() => {
      console.error(`⏰ SAFETY: ${operationName} exceeded safety timeout, forcing reset`);
      safetyReset();
    }, SAFETY_TIMEOUT);

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`${operationName} timeout after ${FUNCTION_TIMEOUT}ms`)), FUNCTION_TIMEOUT)
        )
      ]);

      clearTimeout(safetyTimeoutId);
      console.log(`✅ SAFETY: ${operationName} completed successfully`);
      return result;
    } catch (err) {
      clearTimeout(safetyTimeoutId);
      const errorMessage = err instanceof Error ? err.message : `Unknown ${operationName} error`;
      console.error(`❌ SAFETY: ${operationName} failed:`, errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [safetyReset]);

  // Test Edge Function simple - VERSION SIMPLIFIÉE
  const testSimpleFunction = useCallback(async (): Promise<any> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 SIMPLE: Testing basic Edge Function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('test-simple', {
        body: { test: true, timestamp: new Date().toISOString() }
      });

      if (functionError) {
        throw new Error(`Edge Function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from Edge Function');
      }

      console.log('✅ SIMPLE: Edge Function test successful');
      return data;
    }, 'Simple Function Test');
  }, [withSafetyWrapper]);

  // Test debug MCP - VERSION SIMPLIFIÉE
  const testDebugMode = useCallback(async (): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 DEBUG: Testing MCP debug mode...');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: { debug: true }
      });

      if (functionError) {
        throw new Error(`MCP debug error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from MCP debug');
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ DEBUG: MCP debug test successful');
      setLastResponse(response);
      return response;
    }, 'Debug Mode Test');
  }, [withSafetyWrapper]);

  // Test connexion MCP normale - VERSION SIMPLIFIÉE
  const testConnection = useCallback(async (): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 CONNECTION: Testing normal MCP connection...');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: {
          query: 'Test simple: que signifie le lotus?',
          toolRequests: [],
          contextData: { test: true }
        }
      });

      if (functionError) {
        throw new Error(`MCP connection error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from MCP');
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ CONNECTION: MCP connection test successful');
      setLastResponse(response);
      return response;
    }, 'Connection Test');
  }, [withSafetyWrapper]);

  // Recherche MCP principale - VERSION SIMPLIFIÉE
  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🚀 SEARCH: MCP search starting...');
      
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request
      });

      if (functionError) {
        throw new Error(`Search error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from search');
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ SEARCH: MCP search successful');
      setLastResponse(response);
      return response;
    }, 'MCP Search');
  }, [withSafetyWrapper]);

  // Fonctions spécialisées simplifiées
  const analyzeSymbol = useCallback(async (symbolName: string, culture?: string, period?: string) => {
    return searchWithMCP({
      query: `Analyze the symbol "${symbolName}" ${culture ? `from ${culture} culture` : ''} ${period ? `during ${period}` : ''}`,
      toolRequests: ['symbol_analyzer'],
      contextData: { symbolName, culture, period }
    });
  }, [searchWithMCP]);

  const getCulturalContext = useCallback(async (culture: string, timeframe?: string, region?: string) => {
    return searchWithMCP({
      query: `Cultural context for ${culture} ${timeframe ? `during ${timeframe}` : ''} ${region ? `in ${region}` : ''}`,
      toolRequests: ['cultural_context_provider'],
      contextData: { culture, timeframe, region }
    });
  }, [searchWithMCP]);

  const detectPatterns = useCallback(async (symbols: any[], startPeriod?: string, endPeriod?: string) => {
    return searchWithMCP({
      query: `Detect patterns in symbols: ${symbols.map(s => s.name).join(', ')}`,
      toolRequests: ['temporal_pattern_detector'],
      contextData: { symbols, startPeriod, endPeriod }
    });
  }, [searchWithMCP]);

  const compareSymbols = useCallback(async (symbol1: any, symbol2: any, comparisonType: 'semantic' | 'visual' | 'functional' | 'historical' = 'semantic') => {
    return searchWithMCP({
      query: `Compare ${symbol1.name} and ${symbol2.name} using ${comparisonType} analysis`,
      toolRequests: ['cross_cultural_comparator'],
      contextData: { symbol1, symbol2, comparisonType }
    });
  }, [searchWithMCP]);

  const synthesizeResearch = useCallback(async (query: string, sources?: any[], synthesisType: 'comparative' | 'evolutionary' | 'thematic' = 'thematic') => {
    return searchWithMCP({
      query: `Synthesize research for: ${query}`,
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
    testConnection,
    testDebugMode,
    testSimpleFunction,
    
    // Specialized functions
    analyzeSymbol,
    getCulturalContext,
    detectPatterns,
    compareSymbols,
    synthesizeResearch,
    getCachedResult,
    
    // State
    isLoading,
    lastResponse,
    error,
    
    // Control functions
    clearError: () => setError(null),
    clearLastResponse: () => setLastResponse(null),
    forceReset: safetyReset
  };
};

export default useMCPDeepSeek;
