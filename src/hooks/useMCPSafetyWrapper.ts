
import { useState, useCallback } from 'react';
import { SAFETY_TIMEOUT, FUNCTION_TIMEOUT } from '@/types/mcp';

export const useMCPSafetyWrapper = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset de sécurité amélioré
  const safetyReset = useCallback(() => {
    console.log('🔄 SAFETY: Force reset all states');
    setIsLoading(false);
    setError(null);
  }, []);

  // Wrapper de sécurité optimisé
  const withSafetyWrapper = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    console.log(`🛡️ SAFETY: Starting ${operationName}`);
    
    const safetyTimeoutId = setTimeout(() => {
      console.error(`⏰ SAFETY: ${operationName} exceeded safety timeout, forcing reset`);
      safetyReset();
    }, SAFETY_TIMEOUT);

    try {
      setIsLoading(true);
      setError(null);
      
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error(`${operationName} timeout`)), FUNCTION_TIMEOUT)
        )
      ]);

      clearTimeout(safetyTimeoutId);
      console.log(`✅ SAFETY: ${operationName} completed`);
      return result;
    } catch (err) {
      clearTimeout(safetyTimeoutId);
      const errorMessage = err instanceof Error ? err.message : `${operationName} error`;
      console.error(`❌ SAFETY: ${operationName} failed:`, errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [safetyReset]);

  return {
    isLoading,
    error,
    safetyReset,
    withSafetyWrapper,
    clearError: () => setError(null)
  };
};
