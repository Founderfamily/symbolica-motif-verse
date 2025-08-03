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
      console.log('🏓 [DIAGNOSTIC] Test ping Edge Function AI-v2...');
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { action: 'ping' }
      });
      
      const duration = Date.now() - start;
      
      console.log('📊 [DIAGNOSTIC] Ping response:', { data, error, duration });
      
      if (error) {
        logger.error('Edge Function Ping Error:', error);
        throw error;
      }
      
      return {
        name: 'AI Edge Function Ping',
        status: 'success',
        message: `Fonction AI accessible (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration,
        details: data
      };
    } catch (error: any) {
      logger.error('AI Edge Function Ping Failed:', error);
      return {
        name: 'AI Edge Function Ping',
        status: 'error',
        message: `Fonction AI inaccessible: ${error.message}`,
        timestamp: new Date().toISOString(),
        duration: Date.now() - start,
        details: error
      };
    }
  }, []);

  const testDirectCall = useCallback(async (): Promise<DiagnosticResult> => {
    const start = Date.now();
    try {
      console.log('🔧 [DIAGNOSTIC] Test appel direct Edge Function AI...');
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'test_openai'
        }
      });
      
      const duration = Date.now() - start;
      
      console.log('📡 [DIAGNOSTIC] Direct call response:', { data, error, duration });
      
      if (error) {
        console.error('🔥 [DIAGNOSTIC] Direct call error:', error);
        throw error;
      }
      
      return {
        name: 'Test OpenAI via Edge Function',
        status: 'success',
        message: `Test OpenAI réussi (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration,
        details: data
      };
    } catch (error: any) {
      console.error('❌ [DIAGNOSTIC] Direct call failed:', error);
      return {
        name: 'Test OpenAI via Edge Function',
        status: 'error',
        message: `Échec test OpenAI: ${error.message}`,
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
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: {
          action: 'full_investigation',
          questId,
          questData: {
            title: 'Test Quest',
            description: 'Quest de test pour diagnostic',
            clues: [{ title: 'Test Clue', description: 'Test description' }]
          },
          userId: 'test-diagnostic'
        }
      });
      
      const duration = Date.now() - start;
      
      if (error) {
        logger.error('Investigation Error:', error);
        throw error;
      }
      
      logger.log('✅ Investigation terminée:', data);
      
      return {
        name: 'Investigation Complète AI',
        status: 'success',
        message: `Investigation AI OK (${duration}ms)`,
        timestamp: new Date().toISOString(),
        duration,
        details: data
      };
    } catch (error: any) {
      logger.error('Investigation Failed:', error);
      return {
        name: 'Investigation Complète AI',
        status: 'error',
        message: `Investigation AI échouée: ${error.message}`,
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
      console.log('🔍 [DIAGNOSTIC] === DÉBUT DIAGNOSTIC COMPLET ===');
      
      // Test 1: Connexion Supabase
      console.log('🔹 [DIAGNOSTIC] Test 1/4: Connexion Supabase');
      const supabaseResult = await testSupabaseConnection();
      addResult(supabaseResult);
      
      // Test 2: Appel direct
      console.log('🔹 [DIAGNOSTIC] Test 2/4: Appel direct Edge Function');
      const directResult = await testDirectCall();
      addResult(directResult);
      
      // Test 3: Edge Function Ping
      console.log('🔹 [DIAGNOSTIC] Test 3/4: Ping Edge Function');
      const pingResult = await testEdgeFunctionPing();
      addResult(pingResult);
      
      // Test 4: Investigation complète seulement si tout OK
      if (pingResult.status === 'success' || directResult.status === 'success') {
        console.log('🔹 [DIAGNOSTIC] Test 4/4: Investigation complète');
        const investigationResult = await testFullInvestigation(questId);
        addResult(investigationResult);
      } else {
        addResult({
          name: 'Investigation Complète',
          status: 'warning',
          message: 'Non testée - tests préliminaires échoués',
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('✅ [DIAGNOSTIC] === DIAGNOSTIC TERMINÉ ===');
      
    } catch (error: any) {
      logger.error('❌ [DIAGNOSTIC] Diagnostics failed:', error);
      addResult({
        name: 'Diagnostic Global',
        status: 'error',
        message: `Échec du diagnostic: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  }, [testSupabaseConnection, testDirectCall, testEdgeFunctionPing, testFullInvestigation]);

  return {
    diagnostics,
    isRunning,
    runFullDiagnostics,
    testSupabaseConnection,
    testEdgeFunctionPing,
    testDirectCall,
    testFullInvestigation
  };
};