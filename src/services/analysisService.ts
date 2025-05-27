
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';

export interface AnalysisResult {
  id: string;
  type: 'comparison' | 'temporal' | 'pattern';
  data: any;
  created_at: string;
  user_id: string;
}

export const analysisService = {
  /**
   * Save analysis result to database
   */
  saveAnalysis: async (
    type: string,
    data: any,
    userId: string
  ): Promise<AnalysisResult | null> => {
    try {
      const { data: result, error } = await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: 'analysis',
          points_earned: 20,
          details: {
            analysis_type: type,
            data: data
          }
        })
        .select()
        .single();

      if (error) throw error;
      return result;
    } catch (error) {
      console.error('Error saving analysis:', error);
      return null;
    }
  },

  /**
   * Get user's analysis history
   */
  getUserAnalyses: async (userId: string): Promise<AnalysisResult[]> => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .eq('activity_type', 'analysis')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user analyses:', error);
      return [];
    }
  },

  /**
   * Compare symbols and find similarities
   */
  compareSymbols: async (symbolIds: string[]): Promise<any> => {
    try {
      const { data: symbols, error } = await supabase
        .from('symbols')
        .select('*')
        .in('id', symbolIds);

      if (error) throw error;

      // Calculate similarity based on multiple factors
      const comparison = {
        symbols: symbols,
        similarity_score: calculateSimilarity(symbols || []),
        shared_attributes: findSharedAttributes(symbols || []),
        cultural_connections: findCulturalConnections(symbols || []),
        temporal_relationships: analyzeTemporalRelationships(symbols || [])
      };

      return comparison;
    } catch (error) {
      console.error('Error comparing symbols:', error);
      throw error;
    }
  },

  /**
   * Analyze temporal evolution of symbols
   */
  analyzeTemporalEvolution: async (culture: string): Promise<any> => {
    try {
      const { data: symbols, error } = await supabase
        .from('symbols')
        .select('*')
        .eq('culture', culture)
        .order('period');

      if (error) throw error;

      const evolution = analyzeEvolutionPatterns(symbols || []);
      return evolution;
    } catch (error) {
      console.error('Error analyzing temporal evolution:', error);
      throw error;
    }
  },

  /**
   * Get analysis statistics
   */
  getAnalysisStats: async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('details, created_at')
        .eq('activity_type', 'analysis');

      if (error) throw error;

      const stats = {
        total_analyses: data?.length || 0,
        comparisons: data?.filter(a => a.details?.analysis_type === 'comparison').length || 0,
        temporal_analyses: data?.filter(a => a.details?.analysis_type === 'temporal').length || 0,
        recent_activity: data?.slice(0, 10) || []
      };

      return stats;
    } catch (error) {
      console.error('Error fetching analysis stats:', error);
      return {
        total_analyses: 0,
        comparisons: 0,
        temporal_analyses: 0,
        recent_activity: []
      };
    }
  }
};

// Helper functions for analysis calculations
function calculateSimilarity(symbols: SymbolData[]): number {
  if (symbols.length < 2) return 0;
  
  let totalSimilarity = 0;
  let comparisons = 0;
  
  for (let i = 0; i < symbols.length; i++) {
    for (let j = i + 1; j < symbols.length; j++) {
      const s1 = symbols[i];
      const s2 = symbols[j];
      
      let similarity = 0;
      
      // Culture similarity
      if (s1.culture === s2.culture) similarity += 30;
      
      // Period similarity
      if (s1.period === s2.period) similarity += 20;
      
      // Function similarity
      const commonFunctions = (s1.function || []).filter(f => 
        (s2.function || []).includes(f)
      ).length;
      similarity += commonFunctions * 10;
      
      // Medium similarity
      const commonMediums = (s1.medium || []).filter(m => 
        (s2.medium || []).includes(m)
      ).length;
      similarity += commonMediums * 10;
      
      totalSimilarity += Math.min(similarity, 100);
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalSimilarity / comparisons : 0;
}

function findSharedAttributes(symbols: SymbolData[]): any {
  const allFunctions = symbols.flatMap(s => s.function || []);
  const allMediums = symbols.flatMap(s => s.medium || []);
  const allTechniques = symbols.flatMap(s => s.technique || []);
  
  return {
    functions: [...new Set(allFunctions)],
    mediums: [...new Set(allMediums)],
    techniques: [...new Set(allTechniques)],
    cultures: [...new Set(symbols.map(s => s.culture))],
    periods: [...new Set(symbols.map(s => s.period))]
  };
}

function findCulturalConnections(symbols: SymbolData[]): any {
  const cultures = [...new Set(symbols.map(s => s.culture))];
  const connections = [];
  
  for (let i = 0; i < cultures.length; i++) {
    for (let j = i + 1; j < cultures.length; j++) {
      const culture1Symbols = symbols.filter(s => s.culture === cultures[i]);
      const culture2Symbols = symbols.filter(s => s.culture === cultures[j]);
      
      // Find shared functions, mediums, etc.
      const sharedFunctions = culture1Symbols
        .flatMap(s => s.function || [])
        .filter(f => culture2Symbols.some(s => (s.function || []).includes(f)));
      
      if (sharedFunctions.length > 0) {
        connections.push({
          cultures: [cultures[i], cultures[j]],
          shared_elements: [...new Set(sharedFunctions)],
          strength: sharedFunctions.length
        });
      }
    }
  }
  
  return connections;
}

function analyzeTemporalRelationships(symbols: SymbolData[]): any {
  const periodOrder = ['Ancient', 'Classical', 'Medieval', 'Renaissance', 'Modern', 'Contemporary'];
  const relationships = [];
  
  symbols.sort((a, b) => {
    const aIndex = periodOrder.indexOf(a.period);
    const bIndex = periodOrder.indexOf(b.period);
    return aIndex - bIndex;
  });
  
  for (let i = 0; i < symbols.length - 1; i++) {
    const current = symbols[i];
    const next = symbols[i + 1];
    
    if (current.culture === next.culture) {
      relationships.push({
        from: current.period,
        to: next.period,
        culture: current.culture,
        evolution_type: 'continuation'
      });
    }
  }
  
  return relationships;
}

function analyzeEvolutionPatterns(symbols: SymbolData[]): any {
  const periodGroups = symbols.reduce((acc, symbol) => {
    if (!acc[symbol.period]) {
      acc[symbol.period] = [];
    }
    acc[symbol.period].push(symbol);
    return acc;
  }, {} as Record<string, SymbolData[]>);
  
  return {
    periods: Object.keys(periodGroups),
    period_data: Object.entries(periodGroups).map(([period, symbols]) => ({
      period,
      symbol_count: symbols.length,
      dominant_functions: getMostCommon(symbols.flatMap(s => s.function || [])),
      dominant_mediums: getMostCommon(symbols.flatMap(s => s.medium || [])),
      symbols: symbols.map(s => ({ id: s.id, name: s.name }))
    })),
    evolution_trends: calculateEvolutionTrends(periodGroups)
  };
}

function getMostCommon(arr: string[]): string[] {
  const frequency = arr.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([item]) => item);
}

function calculateEvolutionTrends(periodGroups: Record<string, SymbolData[]>): any {
  const periods = Object.keys(periodGroups);
  const trends = [];
  
  for (let i = 0; i < periods.length - 1; i++) {
    const currentPeriod = periods[i];
    const nextPeriod = periods[i + 1];
    
    const currentSymbols = periodGroups[currentPeriod];
    const nextSymbols = periodGroups[nextPeriod];
    
    trends.push({
      from_period: currentPeriod,
      to_period: nextPeriod,
      change_in_count: nextSymbols.length - currentSymbols.length,
      new_functions: getNewElements(
        currentSymbols.flatMap(s => s.function || []),
        nextSymbols.flatMap(s => s.function || [])
      ),
      discontinued_functions: getNewElements(
        nextSymbols.flatMap(s => s.function || []),
        currentSymbols.flatMap(s => s.function || [])
      )
    });
  }
  
  return trends;
}

function getNewElements(oldArray: string[], newArray: string[]): string[] {
  return [...new Set(newArray.filter(item => !oldArray.includes(item)))];
}
