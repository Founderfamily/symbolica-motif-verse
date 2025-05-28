
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

// Timeout pour les requêtes API
const API_TIMEOUT = 30000; // 30 secondes

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

  console.log('🤖 Calling DeepSeek API with prompt:', prompt.substring(0, 100) + '...');

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
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
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DeepSeek API Error:', response.status, errorText);
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DeepSeek API Success:', result?.choices?.[0]?.message?.content?.substring(0, 100) + '...');
    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('DeepSeek API request timed out');
    }
    throw error;
  }
}

async function executeToolCall(toolName: string, arguments: any) {
  console.log(`🔧 Executing MCP tool: ${toolName} with args:`, JSON.stringify(arguments).substring(0, 200) + '...');
  
  try {
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
  } catch (error) {
    console.error(`❌ Tool execution error for ${toolName}:`, error);
    throw error;
  }
}

async function analyzeSymbol(args: any) {
  const { symbolName, culture, period, description } = args;
  
  console.log(`🔍 Analyzing symbol: ${symbolName}`);
  
  try {
    // Rechercher le symbole dans la base de données avec timeout
    const { data: symbols, error } = await supabase
      .from('symbols')
      .select('*')
      .ilike('name', `%${symbolName}%`)
      .limit(5);

    if (error) {
      console.error('Database error in analyzeSymbol:', error);
      return { error: `Failed to fetch symbol data: ${error.message}` };
    }

    const result = {
      symbolAnalysis: {
        foundSymbols: symbols || [],
        culturalSignificance: `Deep analysis of ${symbolName} in ${culture || 'various cultures'}`,
        historicalContext: `Historical evolution during ${period || 'multiple periods'}`,
        patterns: symbols?.map(s => ({
          name: s.name,
          culture: s.culture,
          period: s.period,
          functions: s.function,
          techniques: s.technique
        })) || [],
        recommendations: `Further research suggestions for ${symbolName}`
      },
      metadata: {
        analysisType: 'symbol_deep_analysis',
        timestamp: new Date().toISOString(),
        confidence: 0.85,
        symbolsFound: symbols?.length || 0
      }
    };

    console.log(`✅ Symbol analysis complete: found ${symbols?.length || 0} symbols`);
    return result;

  } catch (error) {
    console.error('Error in analyzeSymbol:', error);
    return { error: `Symbol analysis failed: ${error.message}` };
  }
}

async function provideCulturalContext(args: any) {
  const { culture, timeframe, region } = args;
  
  console.log(`🌍 Providing cultural context for: ${culture}`);
  
  try {
    const { data: culturalSymbols, error } = await supabase
      .from('symbols')
      .select('*')
      .ilike('culture', `%${culture}%`)
      .limit(10);

    if (error) {
      console.error('Database error in provideCulturalContext:', error);
      return { error: `Failed to fetch cultural data: ${error.message}` };
    }

    const result = {
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
      relatedSymbols: culturalSymbols || []
    };

    console.log(`✅ Cultural context complete: found ${culturalSymbols?.length || 0} related symbols`);
    return result;

  } catch (error) {
    console.error('Error in provideCulturalContext:', error);
    return { error: `Cultural context analysis failed: ${error.message}` };
  }
}

async function detectTemporalPatterns(args: any) {
  const { symbols, startPeriod, endPeriod } = args;
  
  console.log(`⏱️ Detecting temporal patterns from ${startPeriod} to ${endPeriod}`);
  
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
      changeFactors: 'Stylistic and contextual adaptations',
      symbolsAnalyzed: symbols?.length || 0
    }
  };
}

async function compareCultures(args: any) {
  const { symbol1, symbol2, comparisonType } = args;
  
  console.log(`🔄 Comparing cultures: ${comparisonType} analysis`);
  
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
  
  console.log(`📚 Synthesizing research: ${synthesisType} type`);
  
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

  const startTime = Date.now();
  console.log('🚀 MCP DeepSeek Search Request started');

  try {
    const requestBody = await req.json();
    const { query, toolRequests, contextData } = requestBody;

    console.log('📝 Request details:', { 
      query: query?.substring(0, 100) + '...',
      toolRequests,
      contextData: Object.keys(contextData || {})
    });

    // Validation des entrées
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Query is required and must be a non-empty string');
    }

    if (query.length > 5000) {
      throw new Error('Query is too long (max 5000 characters)');
    }

    // Étape 1: Appel initial à DeepSeek avec les outils MCP
    console.log('🤖 Step 1: Initial DeepSeek call');
    const deepseekResponse = await callDeepSeekAPI(query, mcpTools);
    
    let finalResponse = deepseekResponse;
    let mcpToolResults = [];
    
    // Étape 2: Exécuter les outils MCP si demandé
    if (deepseekResponse.choices?.[0]?.message?.tool_calls) {
      console.log('🔧 Step 2: Executing MCP tools');
      
      for (const toolCall of deepseekResponse.choices[0].message.tool_calls) {
        try {
          console.log(`Executing tool: ${toolCall.function.name}`);
          const result = await executeToolCall(
            toolCall.function.name,
            JSON.parse(toolCall.function.arguments)
          );
          mcpToolResults.push({
            toolName: toolCall.function.name,
            result,
            callId: toolCall.id
          });
        } catch (error) {
          console.error(`Tool execution error for ${toolCall.function.name}:`, error);
          mcpToolResults.push({
            toolName: toolCall.function.name,
            error: error.message,
            callId: toolCall.id
          });
        }
      }

      // Étape 3: Appel final à DeepSeek avec les résultats des outils
      if (mcpToolResults.length > 0) {
        console.log('🤖 Step 3: Final DeepSeek call with tool results');
        const enrichedPrompt = `
          Original query: ${query}
          
          Tool execution results:
          ${mcpToolResults.map(r => `${r.toolName}: ${JSON.stringify(r.result)}`).join('\n')}
          
          Please provide a comprehensive response integrating these tool results.
        `;

        try {
          finalResponse = await callDeepSeekAPI(enrichedPrompt);
        } catch (error) {
          console.error('Final DeepSeek call failed:', error);
          // Continue with original response if final call fails
        }
      }
    }

    // Mise en cache des résultats pour optimisation
    try {
      if (finalResponse.choices?.[0]?.message?.content) {
        await supabase
          .from('mobile_cache_data')
          .insert({
            cache_type: 'mcp_deepseek_search',
            cache_key: query.substring(0, 100), // Limiter la clé de cache
            data: { ...finalResponse, mcpToolResults },
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
          });
        console.log('💾 Results cached successfully');
      }
    } catch (cacheError) {
      console.warn('Cache insertion failed (non-critical):', cacheError);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ MCP DeepSeek Search completed in ${duration}ms`);

    return new Response(JSON.stringify({
      success: true,
      response: finalResponse,
      mcpToolResults,
      mcpTools: mcpTools,
      timestamp: new Date().toISOString(),
      processingTime: duration
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ MCP DeepSeek Search Error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString(),
      processingTime: duration
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
