import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

export interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  timestamp: string;
  duration?: number;
  details?: any;
}

export const useEdgeFunctionDiagnostics = () => {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: DiagnosticResult) => {
    setDiagnostics(prev => [result, ...prev.slice(0, 9)]); // Garder 10 résultats max
  };

  const testSupabaseConnection = useCallback(async (): Promise<DiagnosticResult> => {
    const start = Date.now();
    try {
      const { data, error } = await supabase.from('treasure_quests').select('id').limit(1);
      const duration = Date.now() - start;
      
      if (error) throw error;
      
      return {
        name: 'Connexion Supabase',
        status: 'success',
        message: `Connexion OK (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration
      };
    } catch (error: any) {
      return {
        name: 'Connexion Supabase',
        status: 'error',
        message: `Erreur: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - start
      };
    }
  }, []);

  const testEdgeFunctionPing = useCallback(async (): Promise<DiagnosticResult> => {
    const start = Date.now();
    try {
      // Test avec un appel minimal
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: { test: 'ping' }
      });
      
      const duration = Date.now() - start;
      
      if (error) {
        logger.error('Edge Function Ping Error:', error);
        throw error;
      }
      
      return {
        name: 'Edge Function Ping',
        status: 'success',
        message: `Fonction accessible (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration,
        details: data
      };
    } catch (error: any) {
      logger.error('Edge Function Ping Failed:', error);
      return {
        name: 'Edge Function Ping',
        status: 'error',
        message: `Fonction inaccessible: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - start,
        details: error
      };
    }
  }, []);

  const testFullInvestigation = useCallback(async (questId: string): Promise<DiagnosticResult> => {
    const start = Date.now();
    try {
      logger.log('🔍 Test investigation complète pour quest:', questId);
      
      const { data, error } = await supabase.functions.invoke('proactive-investigation', {
        body: {
          questId,
          investigationType: 'full_investigation',
          context: {
            location: 'Test',
            period: '2024',
            coordinates: { latitude: 46.2, longitude: 2.3 }
          }
        }
      });
      
      const duration = Date.now() - start;
      
      if (error) {
        logger.error('Investigation Error:', error);
        throw error;
      }
      
      logger.log('✅ Investigation terminée:', data);
      
      return {
        name: 'Investigation Complète',
        status: 'success',
        message: `Investigation OK (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration,
        details: data
      };
    } catch (error: any) {
      logger.error('Investigation Failed:', error);
      return {
        name: 'Investigation Complète',
        status: 'error',
        message: `Investigation échouée: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - start,
        details: error
      };
    }
  }, []);

  const runFullDiagnostics = useCallback(async (questId: string) => {
    setIsRunning(true);
    setDiagnostics([]);
    
    try {
      // Test 1: Connexion Supabase
      const supabaseResult = await testSupabaseConnection();
      addResult(supabaseResult);
      
      // Test 2: Edge Function Ping
      const pingResult = await testEdgeFunctionPing();
      addResult(pingResult);
      
      // Test 3: Investigation complète seulement si ping OK
      if (pingResult.status === 'success') {
        const investigationResult = await testFullInvestigation(questId);
        addResult(investigationResult);
      } else {
        addResult({
          name: 'Investigation Complète',
          status: 'warning',
          message: 'Non testée - ping failed',
          timestamp: new Date().toISOString()
        });
      }
      
    } catch (error: any) {
      logger.error('Diagnostics failed:', error);
      addResult({
        name: 'Diagnostic Global',
        status: 'error',
        message: `Échec du diagnostic: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  }, [testSupabaseConnection, testEdgeFunctionPing, testFullInvestigation]);

  return {
    diagnostics,
    isRunning,
    runFullDiagnostics,
    testSupabaseConnection,
    testEdgeFunctionPing,
    testFullInvestigation
  };
};