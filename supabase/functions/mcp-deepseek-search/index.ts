
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

// Timeout réduit pour les tests
const API_TIMEOUT = 10000; // 10 secondes

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
  }
];

async function debugApiTest() {
  console.log('🧪 DEBUG: Testing API connectivity');
  console.log('🔑 DEBUG: Has DEEPSEEK_API_KEY:', !!deepseekApiKey);
  console.log('🔑 DEBUG: API Key length:', deepseekApiKey?.length || 0);
  console.log('🔑 DEBUG: API Key first 8 chars:', deepseekApiKey?.substring(0, 8) || 'NONE');

  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY is not configured');
  }

  try {
    console.log('🌐 DEBUG: Testing simple HTTP request to DeepSeek API');
    const testResponse = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000)
    });

    console.log('📡 DEBUG: Models endpoint status:', testResponse.status);
    
    if (testResponse.ok) {
      const models = await testResponse.json();
      console.log('✅ DEBUG: API connectivity OK, models available:', models.data?.length || 0);
      return { success: true, models: models.data?.slice(0, 3) };
    } else {
      const errorText = await testResponse.text();
      console.log('❌ DEBUG: API error:', testResponse.status, errorText);
      throw new Error(`API Error ${testResponse.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('💥 DEBUG: API test failed:', error);
    throw error;
  }
}

async function callDeepSeekAPI(prompt: string, tools?: MCPTool[]) {
  console.log('🤖 DEBUG: Starting DeepSeek API call');
  console.log('📝 DEBUG: Prompt length:', prompt.length);
  console.log('🔧 DEBUG: Tools count:', tools?.length || 0);

  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ DEBUG: API call timeout after 10s');
    controller.abort();
  }, API_TIMEOUT);

  try {
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant specialized in cultural symbols and analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000 // Réduit pour les tests
    };

    console.log('📤 DEBUG: Sending request to DeepSeek API');
    console.log('📋 DEBUG: Request model:', requestBody.model);
    console.log('📋 DEBUG: Request messages count:', requestBody.messages.length);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('📡 DEBUG: DeepSeek response status:', response.status);
    console.log('📡 DEBUG: DeepSeek response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DEBUG: DeepSeek API Error:', response.status, errorText);
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DEBUG: DeepSeek API Success');
    console.log('📊 DEBUG: Response structure:', {
      hasChoices: !!result.choices,
      choicesCount: result.choices?.length || 0,
      hasMessage: !!result.choices?.[0]?.message,
      contentLength: result.choices?.[0]?.message?.content?.length || 0,
      usage: result.usage
    });

    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('⏰ DEBUG: DeepSeek API timeout');
      throw new Error('DeepSeek API request timed out after 10 seconds');
    }
    console.error('💥 DEBUG: DeepSeek API call failed:', error);
    throw error;
  }
}

serve(async (req) => {
  console.log('🚀 DEBUG: Edge Function called');
  console.log('🌐 DEBUG: Request method:', req.method);
  console.log('🌐 DEBUG: Request URL:', req.url);

  if (req.method === 'OPTIONS') {
    console.log('✅ DEBUG: Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  
  try {
    // Mode debug - endpoint de test simple
    if (url.pathname.includes('debug')) {
      console.log('🧪 DEBUG: Debug mode activated');
      
      try {
        const apiTest = await debugApiTest();
        console.log('✅ DEBUG: All tests passed');
        
        return new Response(JSON.stringify({
          success: true,
          debug: true,
          message: 'Debug test successful',
          apiTest,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime,
          environment: {
            hasSupabaseUrl: !!supabaseUrl,
            hasSupabaseKey: !!supabaseKey,
            hasDeepSeekKey: !!deepseekApiKey,
            nodeEnv: Deno.env.get('NODE_ENV') || 'unknown'
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('❌ DEBUG: Debug test failed:', error);
        return new Response(JSON.stringify({
          success: false,
          debug: true,
          error: error.message,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Mode normal - traitement de la requête MCP
    console.log('📥 DEBUG: Processing normal MCP request');
    
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('📋 DEBUG: Request body parsed successfully');
      console.log('📋 DEBUG: Request keys:', Object.keys(requestBody || {}));
    } catch (error) {
      console.error('❌ DEBUG: Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    const { query, toolRequests, contextData } = requestBody;

    console.log('📝 DEBUG: Request details:', { 
      hasQuery: !!query,
      queryLength: query?.length || 0,
      queryPreview: query?.substring(0, 50) + '...',
      toolRequests,
      contextDataKeys: Object.keys(contextData || {}),
      timestamp: new Date().toISOString()
    });

    // Validation stricte des entrées
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.error('❌ DEBUG: Invalid query provided');
      throw new Error('Query is required and must be a non-empty string');
    }

    if (query.length > 1000) { // Limite réduite pour les tests
      console.error('❌ DEBUG: Query too long:', query.length);
      throw new Error('Query is too long (max 1000 characters for debug)');
    }

    // Vérification de la clé API
    if (!deepseekApiKey) {
      console.error('❌ DEBUG: DEEPSEEK_API_KEY not configured');
      throw new Error('DEEPSEEK_API_KEY not configured. Please add it in Supabase secrets.');
    }

    console.log('🤖 DEBUG: Starting simplified DeepSeek call (no MCP tools for now)');
    
    // Appel simplifié sans outils MCP pour commencer
    const deepseekResponse = await callDeepSeekAPI(query);
    
    console.log('✅ DEBUG: DeepSeek response received successfully');

    // Cache simple (non-bloquant)
    try {
      console.log('💾 DEBUG: Attempting to cache results');
      await supabase
        .from('mobile_cache_data')
        .insert({
          cache_type: 'mcp_deepseek_search_debug',
          cache_key: `debug_${query.substring(0, 50)}`,
          data: { response: deepseekResponse, debug: true },
          expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 heure
        });
      console.log('✅ DEBUG: Results cached successfully');
    } catch (cacheError) {
      console.warn('⚠️ DEBUG: Cache insertion failed (non-critical):', cacheError);
    }

    const duration = Date.now() - startTime;
    console.log(`✅ DEBUG: MCP DeepSeek Search completed in ${duration}ms`);

    return new Response(JSON.stringify({
      success: true,
      response: deepseekResponse,
      mcpToolResults: [], // Vide pour les tests simplifiés
      mcpTools: mcpTools,
      timestamp: new Date().toISOString(),
      processingTime: duration,
      debug: {
        simplifiedMode: true,
        apiKeyConfigured: !!deepseekApiKey,
        queryLength: query.length,
        responseType: typeof deepseekResponse
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 DEBUG: Major error in Edge Function:', error);
    console.error('💥 DEBUG: Error stack:', error.stack);
    
    let errorMessage = error.message || 'Unknown error occurred';
    let errorType = 'UNKNOWN_ERROR';
    
    if (errorMessage.includes('DEEPSEEK_API_KEY')) {
      errorType = 'CONFIG_ERROR';
      errorMessage = 'Configuration manquante: Clé API DeepSeek non configurée';
    } else if (errorMessage.includes('timeout') || error.name === 'AbortError') {
      errorType = 'TIMEOUT_ERROR';
      errorMessage = 'Timeout: La requête a pris trop de temps à traiter';
    } else if (errorMessage.includes('JSON')) {
      errorType = 'PARSE_ERROR';
      errorMessage = 'Erreur de parsing: Format de requête invalide';
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      processingTime: duration,
      debug: {
        hasApiKey: !!deepseekApiKey,
        errorType,
        originalError: error.message,
        errorStack: error.stack?.split('\n').slice(0, 3) // Premières lignes seulement
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
