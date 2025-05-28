
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

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await MCPService.search(query);
      setLastResponse(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Search failed';
      setError(errorMessage);
      throw err;
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
