
import { useState } from 'react';
import { MCPSearchResponse } from '@/types/mcp';
import { MCPService } from '@/services/mcpService';

export const useMCPSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<MCPSearchResponse | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      setError('Query cannot be empty');
      return;
    }

    if (query.length > 500) {
      setError('Query too long (max 500 characters)');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MCPService.search(query);
      setLastResponse(response);
      return response;
    } catch (err) {
      // Log for debugging but show generic error to user
      console.error('MCP Search error:', err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Service temporarily unavailable';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);
  const clearResponse = () => setLastResponse(null);

  return {
    search,
    isLoading,
    error,
    lastResponse,
    clearError,
    clearResponse
  };
};
