
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
const API_TIMEOUT = 8000; // 8 secondes

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

// Configuration check without external calls
async function configurationCheck() {
  console.log('🔧 CONFIG: Checking environment configuration');
  
  const config = {
    hasSupabaseUrl: !!supabaseUrl,
    hasSupabaseKey: !!supabaseKey,
    hasDeepSeekKey: !!deepseekApiKey,
    deepSeekKeyLength: deepseekApiKey?.length || 0,
    timestamp: new Date().toISOString(),
    environment: Deno.env.get('DENO_DEPLOYMENT_ID') ? 'production' : 'development'
  };

  console.log('✅ CONFIG: Environment check completed');
  
  return {
    success: true,
    mode: 'configuration_check',
    message: 'Configuration vérifiée avec succès',
    environment: config,
    availableTools: mcpTools.map(tool => tool.name),
    configurationStatus: {
      supabase: config.hasSupabaseUrl && config.hasSupabaseKey ? 'OK' : 'MISSING',
      deepseek: config.hasDeepSeekKey ? 'OK' : 'MISSING'
    }
  };
}

// API connectivity test
async function testApiConnectivity() {
  console.log('🌐 CONNECTIVITY: Testing DeepSeek API connection');
  
  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch('https://api.deepseek.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${deepseekApiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('📡 CONNECTIVITY: Response status:', response.status);
    
    if (response.ok) {
      const models = await response.json();
      console.log('✅ CONNECTIVITY: Success, models available:', models.data?.length || 0);
      return {
        success: true,
        status: response.status,
        modelsCount: models.data?.length || 0,
        availableModels: models.data?.slice(0, 3).map((m: any) => m.id) || []
      };
    } else {
      const errorText = await response.text();
      console.log('❌ CONNECTIVITY: Error:', response.status, errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('⏰ CONNECTIVITY: Timeout after 5s');
      throw new Error('API connectivity timeout');
    }
    console.error('💥 CONNECTIVITY: Failed:', error);
    throw error;
  }
}

// DeepSeek API call
async function callDeepSeekAPI(prompt: string) {
  console.log('🤖 DEEPSEEK: Starting API call');
  console.log('📝 DEEPSEEK: Prompt length:', prompt.length);

  if (!deepseekApiKey) {
    throw new Error('DEEPSEEK_API_KEY not configured');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log('⏰ DEEPSEEK: API call timeout after 8s');
    controller.abort();
  }, API_TIMEOUT);

  try {
    const requestBody = {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: 'You are a cultural symbols and patterns expert. Provide detailed, educational responses about symbols, their meanings, cultural contexts, and historical significance. Keep responses informative but concise.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    };

    console.log('📤 DEEPSEEK: Sending request');

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
    console.log('📡 DEEPSEEK: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ DEEPSEEK: API Error:', response.status, errorText);
      throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ DEEPSEEK: API Success');
    console.log('📊 DEEPSEEK: Response length:', result.choices?.[0]?.message?.content?.length || 0);

    return result;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('⏰ DEEPSEEK: API timeout');
      throw new Error('DeepSeek API request timed out after 8 seconds');
    }
    console.error('💥 DEEPSEEK: API call failed:', error);
    throw error;
  }
}

// Cache result helper
async function cacheResult(query: string, response: any, mode: string) {
  try {
    await supabase
      .from('mobile_cache_data')
      .insert({
        cache_type: 'mcp_deepseek_search',
        cache_key: `${mode}_${query.substring(0, 50)}_${Date.now()}`,
        data: { response, mode, query: query.substring(0, 100) },
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour
      });
    console.log('✅ CACHE: Results cached successfully');
  } catch (cacheError) {
    console.warn('⚠️ CACHE: Cache insertion failed (non-critical):', cacheError);
  }
}

serve(async (req) => {
  console.log('🚀 MCP: Edge Function called');
  console.log('🌐 MCP: Request method:', req.method);

  if (req.method === 'OPTIONS') {
    console.log('✅ MCP: Handling CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('📋 MCP: Request parsed successfully');
    } catch (error) {
      console.error('❌ MCP: Failed to parse request body:', error);
      throw new Error('Invalid JSON in request body');
    }

    // MODE 1: Configuration check (no external calls)
    if (requestBody.debug === true && !requestBody.query) {
      console.log('🔧 MCP: Configuration check mode');
      
      const configResult = await configurationCheck();
      console.log('✅ MCP: Configuration check completed');
      
      return new Response(JSON.stringify({
        ...configResult,
        timestamp: new Date().toISOString(),
        processingTime: Date.now() - startTime
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // MODE 2: API connectivity test
    if (requestBody.testConnectivity === true) {
      console.log('🌐 MCP: API connectivity test mode');
      
      try {
        const connectivityResult = await testApiConnectivity();
        console.log('✅ MCP: Connectivity test passed');
        
        return new Response(JSON.stringify({
          success: true,
          mode: 'connectivity_test',
          message: 'API connectivity verified successfully',
          connectivity: connectivityResult,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('❌ MCP: Connectivity test failed:', error);
        return new Response(JSON.stringify({
          success: false,
          mode: 'connectivity_test',
          error: error.message,
          timestamp: new Date().toISOString(),
          processingTime: Date.now() - startTime
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // MODE 3: Normal search request
    const { query } = requestBody;

    console.log('🔍 MCP: Normal search mode');

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      console.error('❌ MCP: Invalid query provided');
      throw new Error('Query is required and must be a non-empty string');
    }

    if (query.length > 1000) {
      console.error('❌ MCP: Query too long:', query.length);
      throw new Error('Query is too long (max 1000 characters)');
    }

    console.log('🤖 MCP: Starting DeepSeek search');
    
    const deepseekResponse = await callDeepSeekAPI(query);
    
    console.log('✅ MCP: DeepSeek response received successfully');

    // Cache the result
    await cacheResult(query, deepseekResponse, 'search');

    const duration = Date.now() - startTime;
    console.log(`✅ MCP: Request completed in ${duration}ms`);

    return new Response(JSON.stringify({
      success: true,
      response: deepseekResponse,
      mcpToolResults: [],
      mcpTools: mcpTools,
      timestamp: new Date().toISOString(),
      processingTime: duration,
      mode: 'search',
      debug: {
        queryLength: query.length,
        responseType: typeof deepseekResponse,
        hasContent: !!deepseekResponse.choices?.[0]?.message?.content
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('💥 MCP: Error in Edge Function:', error);
    
    let errorMessage = error.message || 'Unknown error occurred';
    let errorType = 'UNKNOWN_ERROR';
    
    if (errorMessage.includes('DEEPSEEK_API_KEY')) {
      errorType = 'CONFIG_ERROR';
    } else if (errorMessage.includes('timeout') || error.name === 'AbortError') {
      errorType = 'TIMEOUT_ERROR';
    } else if (errorMessage.includes('JSON')) {
      errorType = 'PARSE_ERROR';
    } else if (errorMessage.includes('API Error')) {
      errorType = 'API_ERROR';
    }
    
    return new Response(JSON.stringify({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      processingTime: duration,
      debug: {
        errorType,
        originalError: error.message,
        hasApiKey: !!deepseekApiKey,
        stack: error.stack?.split('\n').slice(0, 3)
      }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
