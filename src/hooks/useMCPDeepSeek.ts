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

  // Nouvelle fonction de test pour l'Edge Function simple
  const testSimpleFunction = useCallback(async (): Promise<any> => {
    console.log('🧪 TESTING SIMPLE FUNCTION...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      // Test de la configuration Supabase
      console.log('🔧 DEBUG: Supabase client config:', {
        url: supabase.supabaseUrl,
        hasClient: !!supabase,
        clientKeys: Object.keys(supabase)
      });

      console.log('📡 DEBUG: Calling test-simple Edge Function...');
      
      // Appel avec logging détaillé
      const { data, error: functionError } = await supabase.functions.invoke('test-simple', {
        body: { test: true, timestamp: new Date().toISOString() }
      });

      console.log('📊 DEBUG: Raw response:', { data, functionError });

      if (functionError) {
        console.error('❌ DEBUG: Function error details:', {
          message: functionError.message,
          context: functionError.context,
          details: functionError.details
        });
        throw new Error(`Test simple function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue de la fonction test simple');
      }

      const processingTime = Date.now() - startTime;
      console.log('✅ DEBUG: Test simple réussi:', { 
        success: data.success, 
        message: data.message,
        processingTime 
      });

      return {
        ...data,
        clientProcessingTime: processingTime
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test simple inconnue';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ DEBUG: Test simple error:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        processingTime
      });
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction de test debug améliorée
  const testDebugMode = useCallback(async (): Promise<MCPSearchResponse> => {
    console.log('🧪 Starting ENHANCED DEBUG MODE test...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      console.log('🔧 DEBUG: Client state before call:', {
        isLoading,
        hasError: !!error,
        supabaseUrl: supabase.supabaseUrl,
        timestamp: new Date().toISOString()
      });

      console.log('📡 DEBUG: Attempting mcp-deepseek-search debug call...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: {},
        headers: {
          'X-Debug-Mode': 'true',
          'X-Client-Test': 'enhanced-debug'
        }
      });

      console.log('📊 DEBUG: MCP Debug raw response:', { 
        hasData: !!data, 
        dataKeys: data ? Object.keys(data) : [],
        hasError: !!functionError,
        errorDetails: functionError 
      });

      if (functionError) {
        console.error('❌ DEBUG: MCP Function error:', functionError);
        throw new Error(`Erreur de la fonction MCP debug: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur MCP en mode debug');
      }

      const processingTime = Date.now() - startTime;
      console.log('✅ DEBUG: MCP Debug test completed:', { 
        success: data.success, 
        hasApiTest: !!data.apiTest,
        environment: data.environment,
        processingTime 
      });

      const response = {
        ...data,
        processingTime,
        clientDebug: {
          clientProcessingTime: processingTime,
          testType: 'enhanced-debug'
        }
      };

      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de test MCP debug inconnue';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ DEBUG: MCP Debug Mode Error:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        processingTime
      });
      
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage,
        processingTime: processingTime,
        debug: { 
          testMode: true, 
          failed: true, 
          clientError: true,
          errorType: err instanceof Error ? err.constructor.name : 'Unknown'
        }
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, error]);

  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    console.log('🚀 ENHANCED: Starting MCP search with request:', request);
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      // Validation côté client renforcée avec logs
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('La requête ne peut pas être vide');
      }

      if (request.query.length > 1000) {
        throw new Error('La requête est trop longue (maximum 1000 caractères en mode debug)');
      }

      console.log('🔧 DEBUG: Pre-call state:', {
        hasSupabaseClient: !!supabase,
        requestKeys: Object.keys(request),
        queryLength: request.query.length,
        timestamp: new Date().toISOString()
      });

      console.log('📡 ENHANCED: Calling MCP DeepSeek Search function...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request,
        headers: {
          'X-Client-Version': '2.0',
          'X-Enhanced-Debug': 'true'
        }
      });

      console.log('📊 ENHANCED: Response received:', {
        hasData: !!data,
        dataSuccess: data?.success,
        hasError: !!functionError,
        errorMessage: functionError?.message
      });

      if (functionError) {
        console.error('❌ ENHANCED: Function error:', functionError);
        throw new Error(`Erreur de la fonction: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      const processingTime = Date.now() - startTime;
      console.log('✅ ENHANCED: MCP search completed:', { 
        success: data.success, 
        hasResponse: !!data.response,
        debug: data.debug,
        processingTime 
      });

      const response = {
        ...data,
        processingTime,
        clientDebug: {
          clientProcessingTime: processingTime,
          enhanced: true
        }
      };

      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ ENHANCED: MCP DeepSeek Search Error:', {
        error: err,
        message: errorMessage,
        stack: err instanceof Error ? err.stack : undefined,
        processingTime
      });
      
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage,
        processingTime: processingTime,
        debug: {
          clientError: true,
          errorType: err instanceof Error ? err.constructor.name : 'Unknown'
        }
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
    console.log('🔍 ENHANCED: Testing MCP connection...');
    return searchWithMCP({
      query: 'Test de connexion: que signifie le symbole du lotus?',
      toolRequests: [],
      contextData: { test: true, connectionTest: true }
    });
  }, [searchWithMCP]);

  return {
    // Core functions
    searchWithMCP,
    testConnection,
    testDebugMode,
    testSimpleFunction, // Nouvelle fonction de test
    
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
