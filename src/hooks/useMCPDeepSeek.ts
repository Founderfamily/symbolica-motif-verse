
import { useState } from 'react';
import { MCPSearchResponse } from '@/types/mcp';
import { MCPService } from '@/services/mcpService';
import { MCPSpecializedFunctions } from '@/services/mcpSpecializedFunctions';
import { useMCPSafetyWrapper } from './useMCPSafetyWrapper';

export const useMCPDeepSeek = () => {
  const [lastResponse, setLastResponse] = useState<MCPSearchResponse | null>(null);
  const { isLoading, error, safetyReset, withSafetyWrapper, clearError } = useMCPSafetyWrapper();

  // Core test functions (dans l'ordre de test)
  const testSimpleFunction = async () => {
    return withSafetyWrapper(async () => {
      return MCPService.testSimpleFunction();
    }, 'Simple Function Test');
  };

  const testSimpleDebug = async () => {
    return withSafetyWrapper(async () => {
      const response = await MCPService.testSimpleDebug();
      setLastResponse(response);
      return response;
    }, 'Simple Debug Test');
  };

  const testApiConnectivity = async () => {
    return withSafetyWrapper(async () => {
      const response = await MCPService.testApiConnectivity();
      setLastResponse(response);
      return response;
    }, 'API Connectivity Test');
  };

  const searchWithMCP = async (request: Parameters<typeof MCPService.searchWithMCP>[0]) => {
    return withSafetyWrapper(async () => {
      const response = await MCPService.searchWithMCP(request);
      setLastResponse(response);
      return response;
    }, 'MCP Search');
  };

  // Specialized functions (wrapper autour des fonctions spécialisées)
  const analyzeSymbol = async (symbolName: string, culture?: string, period?: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.analyzeSymbol(symbolName, culture, period);
      setLastResponse(response);
      return response;
    }, 'Symbol Analysis');
  };

  const getCulturalContext = async (culture: string, timeframe?: string, region?: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.getCulturalContext(culture, timeframe, region);
      setLastResponse(response);
      return response;
    }, 'Cultural Context');
  };

  const detectPatterns = async (imageData: string, analysisType?: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.detectPatterns(imageData, analysisType);
      setLastResponse(response);
      return response;
    }, 'Pattern Detection');
  };

  const compareSymbols = async (symbol1: string, symbol2: string, comparisonType?: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.compareSymbols(symbol1, symbol2, comparisonType);
      setLastResponse(response);
      return response;
    }, 'Symbol Comparison');
  };

  const synthesizeResearch = async (topic: string, sources?: string[], perspective?: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.synthesizeResearch(topic, sources, perspective);
      setLastResponse(response);
      return response;
    }, 'Research Synthesis');
  };

  const getCachedResult = async (cacheKey: string) => {
    return withSafetyWrapper(async () => {
      const response = await MCPSpecializedFunctions.getCachedResult(cacheKey);
      setLastResponse(response);
      return response;
    }, 'Cache Retrieval');
  };

  return {
    // Core functions (dans l'ordre de test)
    testSimpleFunction,
    testSimpleDebug,
    testApiConnectivity,
    searchWithMCP,
    
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
    clearError,
    clearLastResponse: () => setLastResponse(null),
    forceReset: safetyReset
  };
};

export default useMCPDeepSeek;
