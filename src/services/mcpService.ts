
import { supabase } from '@/integrations/supabase/client';
import { MCPSearchRequest, MCPSearchResponse } from '@/types/mcp';

export class MCPService {
  static async search(query: string): Promise<MCPSearchResponse> {
    const { data, error } = await supabase.functions.invoke('mcp-search', {
      body: { query },
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqY3pncG1ocmJpcmJxcnljb2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxNDc0MDMsImV4cCI6MjA2MjcyMzQwM30.hFrbeO7mmXXYdAkzoVT88O8enMOMqd8C94EfermuCas`
      }
    });

    if (error) {
      throw new Error(`MCP Search error: ${error.message}`);
    }

    return data;
  }
}
