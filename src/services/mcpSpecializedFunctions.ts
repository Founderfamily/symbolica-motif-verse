
import { MCPSearchRequest } from '@/types/mcp';
import { MCPService } from './mcpService';

// Fonctions spécialisées pour différents types d'analyse
export class MCPSpecializedFunctions {
  static async analyzeSymbol(symbolName: string, culture?: string, period?: string) {
    return MCPService.searchWithMCP({
      query: `Analyze the symbol "${symbolName}" ${culture ? `from ${culture} culture` : ''} ${period ? `during ${period}` : ''}`,
      toolRequests: ['symbol_analyzer'],
      contextData: { symbolName, culture, period }
    });
  }

  static async getCulturalContext(culture: string, timeframe?: string, region?: string) {
    return MCPService.searchWithMCP({
      query: `Cultural context for ${culture} ${timeframe ? `during ${timeframe}` : ''} ${region ? `in ${region}` : ''}`,
      toolRequests: ['cultural_context_provider'],
      contextData: { culture, timeframe, region }
    });
  }

  static async detectPatterns(imageData: string, analysisType?: string) {
    return MCPService.searchWithMCP({
      query: `Detect patterns in this image ${analysisType ? `focusing on ${analysisType}` : ''}`,
      toolRequests: ['pattern_detector'],
      contextData: { imageData, analysisType }
    });
  }

  static async compareSymbols(symbol1: string, symbol2: string, comparisonType?: string) {
    return MCPService.searchWithMCP({
      query: `Compare symbols "${symbol1}" and "${symbol2}" ${comparisonType ? `in terms of ${comparisonType}` : ''}`,
      toolRequests: ['symbol_comparator'],
      contextData: { symbol1, symbol2, comparisonType }
    });
  }

  static async synthesizeResearch(topic: string, sources?: string[], perspective?: string) {
    return MCPService.searchWithMCP({
      query: `Synthesize research on "${topic}" ${perspective ? `from ${perspective} perspective` : ''}`,
      toolRequests: ['research_synthesizer'],
      contextData: { topic, sources, perspective }
    });
  }

  static async getCachedResult(cacheKey: string) {
    return MCPService.searchWithMCP({
      query: `Retrieve cached analysis for key: ${cacheKey}`,
      toolRequests: ['cache_retriever'],
      contextData: { cacheKey }
    });
  }
}
