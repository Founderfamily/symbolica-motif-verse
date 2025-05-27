
import { supabase } from '@/integrations/supabase/client';

export interface SymbolAnalysisResult {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string;
  similarities: string[];
  cultural_significance: string;
  geographic_distribution: {
    regions: string[];
    coordinates: { lat: number; lng: number }[];
  };
  temporal_analysis: {
    earliest_occurrence: string;
    peak_usage: string;
    evolution_notes: string;
  };
  pattern_characteristics: {
    geometric_complexity: 'simple' | 'moderate' | 'complex';
    color_palette: string[];
    symbolic_elements: string[];
  };
}

export interface ComparisonResult {
  symbol1: SymbolAnalysisResult;
  symbol2: SymbolAnalysisResult;
  similarities: {
    cultural: string[];
    geometric: string[];
    temporal: string[];
    functional: string[];
  };
  differences: {
    cultural: string[];
    geometric: string[];
    temporal: string[];
    functional: string[];
  };
  relationship_type: 'derivative' | 'parallel_evolution' | 'cultural_exchange' | 'unrelated';
  confidence_score: number;
}

export interface TemporalAnalysis {
  timeline: {
    period: string;
    events: {
      type: 'emergence' | 'evolution' | 'peak' | 'decline' | 'revival';
      description: string;
      cultural_context: string;
    }[];
  }[];
  trends: {
    pattern: string;
    direction: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
    factors: string[];
  }[];
}

export const analyzeSymbol = async (symbolId: string): Promise<SymbolAnalysisResult | null> => {
  try {
    const { data: symbol, error } = await supabase
      .from('symbols')
      .select(`
        *,
        symbol_locations(latitude, longitude, name, culture),
        symbol_connections(relationship_type, description)
      `)
      .eq('id', symbolId)
      .single();

    if (error) throw error;

    // Get related symbols for similarity analysis
    const { data: connections } = await supabase
      .from('symbol_connections')
      .select('symbol_id_1, symbol_id_2, relationship_type')
      .or(`symbol_id_1.eq.${symbolId},symbol_id_2.eq.${symbolId}`);

    const similarities = connections?.map(conn => conn.relationship_type) || [];

    // Analyze geographic distribution
    const coordinates = symbol.symbol_locations?.map((loc: any) => ({
      lat: parseFloat(loc.latitude),
      lng: parseFloat(loc.longitude)
    })) || [];

    const regions = [...new Set(symbol.symbol_locations?.map((loc: any) => loc.culture) || [])];

    return {
      id: symbol.id,
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      description: symbol.description || '',
      similarities,
      cultural_significance: symbol.description || '',
      geographic_distribution: {
        regions,
        coordinates
      },
      temporal_analysis: {
        earliest_occurrence: symbol.period || 'Unknown',
        peak_usage: symbol.period || 'Unknown',
        evolution_notes: 'Analysis based on available data'
      },
      pattern_characteristics: {
        geometric_complexity: symbol.technique?.length > 3 ? 'complex' : 
                             symbol.technique?.length > 1 ? 'moderate' : 'simple',
        color_palette: ['Traditional colors'],
        symbolic_elements: symbol.function || []
      }
    };
  } catch (error) {
    console.error('Error analyzing symbol:', error);
    return null;
  }
};

export const compareSymbols = async (symbolId1: string, symbolId2: string): Promise<ComparisonResult | null> => {
  try {
    const [analysis1, analysis2] = await Promise.all([
      analyzeSymbol(symbolId1),
      analyzeSymbol(symbolId2)
    ]);

    if (!analysis1 || !analysis2) return null;

    // Calculate similarities and differences
    const culturalSimilarities = analysis1.culture === analysis2.culture ? 
      ['Same cultural origin'] : [];
    
    const temporalSimilarities = analysis1.period === analysis2.period ? 
      ['Same time period'] : [];

    const culturalDifferences = analysis1.culture !== analysis2.culture ? 
      [`Different cultures: ${analysis1.culture} vs ${analysis2.culture}`] : [];

    const temporalDifferences = analysis1.period !== analysis2.period ? 
      [`Different periods: ${analysis1.period} vs ${analysis2.period}`] : [];

    // Determine relationship type
    let relationshipType: ComparisonResult['relationship_type'] = 'unrelated';
    let confidenceScore = 0.3;

    if (analysis1.culture === analysis2.culture) {
      relationshipType = 'derivative';
      confidenceScore = 0.8;
    } else if (analysis1.period === analysis2.period) {
      relationshipType = 'parallel_evolution';
      confidenceScore = 0.6;
    } else if (analysis1.similarities.some(s => analysis2.similarities.includes(s))) {
      relationshipType = 'cultural_exchange';
      confidenceScore = 0.7;
    }

    return {
      symbol1: analysis1,
      symbol2: analysis2,
      similarities: {
        cultural: culturalSimilarities,
        geometric: [],
        temporal: temporalSimilarities,
        functional: []
      },
      differences: {
        cultural: culturalDifferences,
        geometric: [],
        temporal: temporalDifferences,
        functional: []
      },
      relationship_type: relationshipType,
      confidence_score: confidenceScore
    };
  } catch (error) {
    console.error('Error comparing symbols:', error);
    return null;
  }
};

export const getTemporalAnalysis = async (cultureFilter?: string): Promise<TemporalAnalysis> => {
  try {
    let query = supabase.from('symbols').select('culture, period');
    
    if (cultureFilter) {
      query = query.eq('culture', cultureFilter);
    }

    const { data: symbols } = await query;

    // Group by periods and analyze trends
    const periodGroups = symbols?.reduce((acc, symbol) => {
      const period = symbol.period || 'Unknown';
      if (!acc[period]) acc[period] = [];
      acc[period].push(symbol);
      return acc;
    }, {} as Record<string, any[]>) || {};

    const timeline = Object.entries(periodGroups).map(([period, symbolsInPeriod]) => ({
      period,
      events: [{
        type: 'emergence' as const,
        description: `${symbolsInPeriod.length} symbols from this period`,
        cultural_context: `Cultural diversity: ${new Set(symbolsInPeriod.map(s => s.culture)).size} cultures`
      }]
    }));

    const trends = [{
      pattern: 'Cultural diversity over time',
      direction: 'increasing' as const,
      factors: ['Cultural exchange', 'Trade routes', 'Migration patterns']
    }];

    return { timeline, trends };
  } catch (error) {
    console.error('Error getting temporal analysis:', error);
    return { timeline: [], trends: [] };
  }
};

export const exportAnalysisData = async (analysisResults: any[], format: 'json' | 'csv' | 'pdf') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `symbol-analysis-${timestamp}`;

  switch (format) {
    case 'json':
      const jsonBlob = new Blob([JSON.stringify(analysisResults, null, 2)], 
        { type: 'application/json' });
      downloadFile(jsonBlob, `${filename}.json`);
      break;

    case 'csv':
      const csv = convertToCSV(analysisResults);
      const csvBlob = new Blob([csv], { type: 'text/csv' });
      downloadFile(csvBlob, `${filename}.csv`);
      break;

    case 'pdf':
      // For PDF export, we'd typically use a library like jsPDF
      console.log('PDF export not yet implemented');
      break;
  }
};

const convertToCSV = (data: any[]): string => {
  if (!data.length) return '';
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'object' ? JSON.stringify(value) : value;
      }).join(',')
    )
  ].join('\n');
  
  return csvContent;
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
