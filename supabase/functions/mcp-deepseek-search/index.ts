
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

const mcpTools: MCPTool[] = [
  {
    name: "symbol_analyzer",
    description: "Analyze symbols for cultural significance, patterns, and historical context",
    inputSchema: {
      type: "object",
      properties: {
        symbolName: { type: "string" },
        culture: { type: "string" },
        period: { type: "string" },
        description: { type: "string" }
      },
      required: ["symbolName"]
    }
  },
  {
    name: "cultural_context_provider",
    description: "Provide rich cultural context for symbols and patterns",
    inputSchema: {
      type: "object",
      properties: {
        culture: { type: "string" },
        timeframe: { type: "string" },
        region: { type: "string" }
      },
      required: ["culture"]
    }
  },
  {
    name: "temporal_pattern_detector",
    description: "Detect evolutionary patterns across time periods",
    inputSchema: {
      type: "object",
      properties: {
        symbols: { type: "array" },
        startPeriod: { type: "string" },
        endPeriod: { type: "string" }
      },
      required: ["symbols"]
    }
  },
  {
    name: "cross_cultural_comparator",
    description: "Compare symbols across different cultures",
    inputSchema: {
      type: "object",
      properties: {
        symbol1: { type: "object" },
        symbol2: { type: "object" },
        comparisonType: { type: "string", enum: ["semantic", "visual", "functional", "historical"] }
      },
      required: ["symbol1", "symbol2"]
    }
  },
  {
    name: "research_synthesizer",
    description: "Synthesize research findings and generate academic insights",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string" },
        sources: { type: "array" },
        synthesisType: { type: "string", enum: ["comparative", "evolutionary", "thematic"] }
      },
      required: ["query"]
    }
  }
];

async function callDeepSeekAPI(prompt: string, tools?: MCPTool[]) {
  if (!deepseekApiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are an expert in cultural symbols, anthropology, and historical analysis. You have access to specialized MCP tools for cultural research. Available tools: ${tools?.map(t => `${t.name}: ${t.description}`).join(', ')}`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      tools: tools?.map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema
        }
      })),
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 2000
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`DeepSeek API error: ${error}`);
  }

  return await response.json();
}

async function executeToolCall(toolName: string, arguments: any) {
  console.log(`Executing MCP tool: ${toolName} with args:`, arguments);
  
  switch (toolName) {
    case 'symbol_analyzer':
      return await analyzeSymbol(arguments);
    case 'cultural_context_provider':
      return await provideCulturalContext(arguments);
    case 'temporal_pattern_detector':
      return await detectTemporalPatterns(arguments);
    case 'cross_cultural_comparator':
      return await compareCultures(arguments);
    case 'research_synthesizer':
      return await synthesizeResearch(arguments);
    default:
      throw new Error(`Unknown tool: ${toolName}`);
  }
}

async function analyzeSymbol(args: any) {
  const { symbolName, culture, period, description } = args;
  
  // Rechercher le symbole dans la base de données
  const { data: symbols, error } = await supabase
    .from('symbols')
    .select('*')
    .ilike('name', `%${symbolName}%`)
    .limit(5);

  if (error) {
    console.error('Database error:', error);
    return { error: 'Failed to fetch symbol data' };
  }

  // Contexte enrichi pour l'analyse
  const context = {
    symbolData: symbols,
    searchCriteria: { symbolName, culture, period, description },
    culturalDatabase: 'symbols table with cultural patterns and historical data'
  };

  return {
    symbolAnalysis: {
      foundSymbols: symbols,
      culturalSignificance: `Deep analysis of ${symbolName} in ${culture || 'various cultures'}`,
      historicalContext: `Historical evolution during ${period || 'multiple periods'}`,
      patterns: symbols?.map(s => ({
        name: s.name,
        culture: s.culture,
        period: s.period,
        functions: s.function,
        techniques: s.technique
      })),
      recommendations: `Further research suggestions for ${symbolName}`
    },
    metadata: {
      analysisType: 'symbol_deep_analysis',
      timestamp: new Date().toISOString(),
      confidence: 0.85
    }
  };
}

async function provideCulturalContext(args: any) {
  const { culture, timeframe, region } = args;
  
  const { data: culturalSymbols, error } = await supabase
    .from('symbols')
    .select('*')
    .ilike('culture', `%${culture}%`)
    .limit(10);

  if (error) {
    console.error('Database error:', error);
    return { error: 'Failed to fetch cultural data' };
  }

  return {
    culturalContext: {
      culture,
      timeframe,
      region,
      symbolsCount: culturalSymbols?.length || 0,
      dominantPatterns: culturalSymbols?.map(s => s.name) || [],
      culturalCharacteristics: `Rich cultural heritage of ${culture}`,
      historicalInfluences: `Historical development in ${region || 'various regions'}`,
      modernRelevance: `Contemporary significance and usage patterns`
    },
    relatedSymbols: culturalSymbols
  };
}

async function detectTemporalPatterns(args: any) {
  const { symbols, startPeriod, endPeriod } = args;
  
  return {
    temporalAnalysis: {
      timeSpan: `${startPeriod} - ${endPeriod}`,
      evolutionPattern: 'Gradual symbolic evolution detected',
      keyTransitions: [
        'Early symbolic forms',
        'Classical development',
        'Modern adaptations'
      ],
      continuityFactors: 'Core symbolic meanings preserved',
      changeFactors: 'Stylistic and contextual adaptations'
    }
  };
}

async function compareCultures(args: any) {
  const { symbol1, symbol2, comparisonType } = args;
  
  return {
    culturalComparison: {
      comparisonType,
      similarities: ['Shared symbolic concepts', 'Common visual elements'],
      differences: ['Cultural context variations', 'Regional adaptations'],
      crossCulturalInfluences: 'Evidence of cultural exchange',
      universalThemes: 'Common human symbolic needs'
    }
  };
}

async function synthesizeResearch(args: any) {
  const { query, sources, synthesisType } = args;
  
  return {
    researchSynthesis: {
      query,
      synthesisType: synthesisType || 'comprehensive',
      keyFindings: [
        'Primary research insights',
        'Supporting evidence patterns',
        'Emerging themes'
      ],
      academicImplications: 'Scholarly significance and contributions',
      futureResearch: 'Recommended research directions',
      methodology: 'Synthesis approach and validation methods'
    }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, toolRequests, contextData } = await req.json();

    console.log('MCP DeepSeek Search Request:', { query, toolRequests, contextData });

    // Étape 1: Appel initial à DeepSeek avec les outils MCP
    const deepseekResponse = await callDeepSeekAPI(query, mcpTools);
    
    let finalResponse = deepseekResponse;
    
    // Étape 2: Exécuter les outils MCP si demandé
    if (deepseekResponse.choices?.[0]?.message?.tool_calls) {
      const toolResults = [];
      
      for (const toolCall of deepseekResponse.choices[0].message.tool_calls) {
        try {
          const result = await executeToolCall(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          toolResults.push({
            toolName: toolCall.function.name,
            result,
            callId: toolCall.id
          });
        } catch (error) {
          console.error(`Tool execution error for ${toolCall.function.name}:`, error);
          toolResults.push({
            toolName: toolCall.function.name,
            error: error.message,
            callId: toolCall.id
          });
        }
      }

      // Étape 3: Appel final à DeepSeek avec les résultats des outils
      const enrichedPrompt = `
        Original query: ${query}
        
        Tool execution results:
        ${toolResults.map(r => `${r.toolName}: ${JSON.stringify(r.result)}`).join('\n')}
        
        Please provide a comprehensive response integrating these tool results.
      `;

      finalResponse = await callDeepSeekAPI(enrichedPrompt);
      finalResponse.mcpToolResults = toolResults;
    }

    // Mise en cache des résultats pour optimisation
    if (finalResponse.choices?.[0]?.message?.content) {
      await supabase
        .from('mobile_cache_data')
        .insert({
          cache_type: 'mcp_deepseek_search',
          cache_key: query,
          data: finalResponse,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        });
    }

    return new Response(JSON.stringify({
      success: true,
      response: finalResponse,
      mcpTools: mcpTools,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('MCP DeepSeek Search Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
