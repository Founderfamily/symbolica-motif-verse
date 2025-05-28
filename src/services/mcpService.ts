
import { supabase } from '@/integrations/supabase/client';
import { MCPSearchRequest, MCPSearchResponse } from '@/types/mcp';

export class MCPService {
  static async search(query: string): Promise<MCPSearchResponse> {
    const { data, error } = await supabase.functions.invoke('mcp-search', {
      body: { query }
    });

    if (error) {
      throw new Error(`MCP Search error: ${error.message}`);
    }

    return data;
  }
}
