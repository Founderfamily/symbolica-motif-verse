
import { supabase } from '@/integrations/supabase/client';
import { MCPSearchRequest, MCPSearchResponse } from '@/types/mcp';

export class MCPService {
  static async search(query: string): Promise<MCPSearchResponse> {
    // Sanitize input to prevent XSS
    const sanitizedQuery = this.sanitizeInput(query);
    
    // Validate query length
    if (!sanitizedQuery || sanitizedQuery.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }
    
    if (sanitizedQuery.length > 500) {
      throw new Error('Query too long');
    }

    const { data, error } = await supabase.functions.invoke('mcp-search', {
      body: { query: sanitizedQuery }
    });

    if (error) {
      // Don't expose internal error details
      console.error('MCP Search internal error:', error);
      throw new Error('Search service temporarily unavailable');
    }

    return data;
  }

  private static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Basic HTML sanitization
    return input
      .replace(/[<>]/g, '') // Remove basic HTML chars
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }
}
