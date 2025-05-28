
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

  // Test Edge Function simple - CORRIGÉ
  const testSimpleFunction = useCallback(async (): Promise<any> => {
    console.log('🧪 AUDIT: Testing simple Edge Function...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      console.log('🔧 AUDIT: Supabase client verification:', {
        hasClient: !!supabase,
        clientType: typeof supabase,
        projectUrl: 'https://djczgpmhrbirbqrycodq.supabase.co'
      });

      console.log('📡 AUDIT: Invoking test-simple function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('test-simple', {
        body: { test: true, audit: true, timestamp: new Date().toISOString() }
      });

      const processingTime = Date.now() - startTime;

      console.log('📊 AUDIT: Simple function response:', { 
        hasData: !!data, 
        hasError: !!functionError,
        processingTime,
        data: data,
        error: functionError
      });

      if (functionError) {
        console.error('❌ AUDIT: Simple function error:', functionError);
        throw new Error(`Edge Function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from simple Edge Function');
      }

      console.log('✅ AUDIT: Simple test successful');
      return {
        ...data,
        clientProcessingTime: processingTime,
        auditTest: true
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown simple test error';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ AUDIT: Simple test failed:', {
        error: err,
        message: errorMessage,
        processingTime,
        stack: err instanceof Error ? err.stack : undefined
      });
      
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test debug MCP - CORRIGÉ pour utiliser le bon endpoint
  const testDebugMode = useCallback(async (): Promise<MCPSearchResponse> => {
    console.log('🧪 AUDIT: Testing MCP debug mode...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      console.log('🔧 AUDIT: Pre-debug state verification:', {
        timestamp: new Date().toISOString(),
        projectId: 'djczgpmhrbirbqrycodq'
      });

      // CORRECTION CRITIQUE: Utiliser l'URL avec /debug
      console.log('📡 AUDIT: Calling MCP function with debug endpoint...');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: { debug: true, audit: true },
        headers: {
          'X-Debug-Mode': 'true',
          'X-Audit-Test': 'true'
        }
      });

      const processingTime = Date.now() - startTime;

      console.log('📊 AUDIT: MCP debug response:', { 
        hasData: !!data, 
        hasError: !!functionError,
        processingTime,
        dataKeys: data ? Object.keys(data) : [],
        errorDetails: functionError
      });

      if (functionError) {
        console.error('❌ AUDIT: MCP debug error:', functionError);
        throw new Error(`MCP debug error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from MCP debug');
      }

      const response = {
        ...data,
        processingTime,
        auditDebug: true
      };

      console.log('✅ AUDIT: MCP debug test successful');
      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown MCP debug error';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ AUDIT: MCP debug failed:', {
        error: err,
        message: errorMessage,
        processingTime,
        stack: err instanceof Error ? err.stack : undefined
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
          auditTest: true, 
          failed: true, 
          clientError: true
        }
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test connexion normale - CORRIGÉ
  const testConnection = useCallback(async (): Promise<MCPSearchResponse> => {
    console.log('🧪 AUDIT: Testing normal MCP connection...');
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      console.log('📡 AUDIT: Normal MCP call...');
      
      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: {
          query: 'Test de connexion: que signifie le symbole du lotus?',
          toolRequests: [],
          contextData: { audit: true, connectionTest: true }
        }
      });

      const processingTime = Date.now() - startTime;

      console.log('📊 AUDIT: Normal MCP response:', { 
        hasData: !!data, 
        hasError: !!functionError,
        processingTime,
        success: data?.success
      });

      if (functionError) {
        console.error('❌ AUDIT: Normal MCP error:', functionError);
        throw new Error(`MCP connection error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from normal MCP call');
      }

      const response = {
        ...data,
        processingTime,
        auditConnection: true
      };

      console.log('✅ AUDIT: Normal MCP test successful');
      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown MCP connection error';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ AUDIT: Normal MCP failed:', {
        error: err,
        message: errorMessage,
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
          auditConnection: true, 
          failed: true
        }
      };

      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fonction de recherche principale - SIMPLIFIÉE
  const searchWithMCP = useCallback(async (request: MCPSearchRequest): Promise<MCPSearchResponse> => {
    console.log('🚀 AUDIT: MCP search with request:', request);
    setIsLoading(true);
    setError(null);

    const startTime = Date.now();

    try {
      if (!request.query || request.query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      console.log('📡 AUDIT: MCP search call...');

      const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
        body: request
      });

      const processingTime = Date.now() - startTime;

      if (functionError) {
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (!data) {
        throw new Error('No data received from server');
      }

      const response = {
        ...data,
        processingTime
      };

      setLastResponse(response);
      return response;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      const processingTime = Date.now() - startTime;
      
      console.error('❌ AUDIT: MCP search error:', err);
      setError(errorMessage);
      
      const errorResponse: MCPSearchResponse = {
        success: false,
        response: null,
        mcpTools: [],
        mcpToolResults: [],
        timestamp: new Date().toISOString(),
        error: errorMessage,
        processingTime: processingTime
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
    
    // Clear functions
    clearError: () => setError(null),
    clearLastResponse: () => setLastResponse(null)
  };
};

export default useMCPDeepSeek;
