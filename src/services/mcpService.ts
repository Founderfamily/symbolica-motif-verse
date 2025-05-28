
import { supabase } from '@/integrations/supabase/client';
import { MCPSearchRequest, MCPSearchResponse, FUNCTION_TIMEOUT } from '@/types/mcp';

// Supabase anon key for authentication
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3pncG1ocmJpcmJxcnljb2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDc0MDMsImV4cCI6MjA2MjcyMzQwM30.hFrbeO7mmXXYdAkzoVT88O8enMOMqd8C94EfermuCas';

// Core MCP service functions
export class MCPService {
  // TEST 1: Edge Function simple
  static async testSimpleFunction(): Promise<any> {
    console.log('🧪 TEST 1: Testing basic Edge Function');
    
    const { data, error: functionError } = await supabase.functions.invoke('test-simple', {
      body: { test: true, timestamp: new Date().toISOString() },
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (functionError) {
      throw new Error(`Edge Function error: ${functionError.message}`);
    }

    console.log('✅ TEST 1: Basic Edge Function works');
    return data;
  }

  // TEST 2: Debug simple (sans appel externe)
  static async testSimpleDebug(): Promise<MCPSearchResponse> {
    console.log('🧪 TEST 2: Testing simple debug (no external calls)');
    
    const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
      body: { debug: true }, // Sans query, juste debug config
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (functionError) {
      throw new Error(`Simple debug error: ${functionError.message}`);
    }

    const response = {
      ...data,
      timestamp: new Date().toISOString()
    };

    console.log('✅ TEST 2: Simple debug successful');
    return response;
  }

  // TEST 3: Test connectivité API
  static async testApiConnectivity(): Promise<MCPSearchResponse> {
    console.log('🧪 TEST 3: Testing API connectivity');
    
    const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
      body: { testConnectivity: true },
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (functionError) {
      throw new Error(`Connectivity test error: ${functionError.message}`);
    }

    const response = {
      ...data,
      timestamp: new Date().toISOString()
    };

    console.log('✅ TEST 3: API connectivity test successful');
    return response;
  }

  // TEST 4: Requête normale
  static async searchWithMCP(request: MCPSearchRequest): Promise<MCPSearchResponse> {
    console.log('🧪 TEST 4: Normal MCP search');
    
    if (!request.query || request.query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    const { data, error: functionError } = await supabase.functions.invoke('mcp-deepseek-search', {
      body: request,
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      }
    });

    if (functionError) {
      throw new Error(`Search error: ${functionError.message}`);
    }

    const response = {
      ...data,
      timestamp: new Date().toISOString()
    };

    console.log('✅ TEST 4: Normal search successful');
    return response;
  }
}
