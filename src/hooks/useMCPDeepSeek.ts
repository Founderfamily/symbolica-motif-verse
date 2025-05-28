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
  mode?: string;
}

export interface MCPToolResult {
  toolName: string;
  result: any;
  error?: string;
  callId: string;
}

// Timeouts réduits et sécurisés
const FUNCTION_TIMEOUT = 8000; // 8 secondes client
const SAFETY_TIMEOUT = 12000; // 12 secondes pour reset automatique

export const useMCPDeepSeek = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<MCPSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset de sécurité amélioré
  const safetyReset = useCallback(() => {
    console.log('🔄 SAFETY: Force reset all states');
    setIsLoading(false);
    setError(null);
    setLastResponse(null);
  }, []);

  // Wrapper de sécurité optimisé
  const withSafetyWrapper = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    console.log(`🛡️ SAFETY: Starting ${operationName}`);
    
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
          setTimeout(() => reject(new Error(`${operationName} timeout`)), FUNCTION_TIMEOUT)
        )
      ]);

      clearTimeout(safetyTimeoutId);
      console.log(`✅ SAFETY: ${operationName} completed`);
      return result;
    } catch (err) {
      clearTimeout(safetyTimeoutId);
      const errorMessage = err instanceof Error ? err.message : `${operationName} error`;
      console.error(`❌ SAFETY: ${operationName} failed:`, errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [safetyReset]);

  // TEST 1: Edge Function simple (reste identique)
  const testSimpleFunction = useCallback(async (): Promise<any> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 TEST 1: Testing basic Edge Function');
      
      const { data, error: functionError } = await supabase.functions.invoke('test-simple', {
        body: { test: true, timestamp: new Date().toISOString() }
      });

      if (functionError) {
        throw new Error(`Edge Function error: ${functionError.message}`);
      }

      console.log('✅ TEST 1: Basic Edge Function works');
      return data;
    }, 'Simple Function Test');
  }, [withSafetyWrapper]);

  // TEST 2: Debug simple (NOUVEAU - sans appel externe)
  const testSimpleDebug = useCallback(async (): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 TEST 2: Testing simple debug (no external calls)');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: { debug: true } // Sans query, juste debug config
      });

      if (functionError) {
        throw new Error(`Simple debug error: ${functionError.message}`);
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ TEST 2: Simple debug successful');
      setLastResponse(response);
      return response;
    }, 'Simple Debug Test');
  }, [withSafetyWrapper]);

  // TEST 3: Test connectivité API
  const testApiConnectivity = useCallback(async (): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 TEST 3: Testing API connectivity');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: { testConnectivity: true }
      });

      if (functionError) {
        throw new Error(`Connectivity test error: ${functionError.message}`);
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ TEST 3: API connectivity test successful');
      setLastResponse(response);
      return response;
    }, 'API Connectivity Test');
  }, [withSafetyWrapper]);

  // TEST 4: Requête normale (simplifiée)
  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    return withSafetyWrapper(async () => {
      console.log('🧪 TEST 4: Normal MCP search');
      
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request
      });

      if (functionError) {
        throw new Error(`Search error: ${functionError.message}`);
      }

      const response = {
        ...data,
        timestamp: new Date().toISOString()
      };

      console.log('✅ TEST 4: Normal search successful');
      setLastResponse(response);
      return response;
    }, 'MCP Search');
  }, [withSafetyWrapper]);

  // Fonctions spécialisées simplifiées (gardées pour compatibilité)
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

  // ... keep existing code (detectPatterns, compareSymbols, synthesizeResearch, getCachedResult functions)

  return {
    // Core functions (dans l'ordre de test)
    testSimpleFunction,      // TEST 1
    testSimpleDebug,         // TEST 2 (NOUVEAU)
    testApiConnectivity,     // TEST 3 (NOUVEAU)
    searchWithMCP,           // TEST 4
    
    // Specialized functions
    analyzeSymbol,
    getCulturalContext,
    // detectPatterns,
    // compareSymbols,
    // synthesizeResearch,
    // getCachedResult,
    
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
