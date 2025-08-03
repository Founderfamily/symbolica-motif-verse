import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Zap, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TestResult {
  status: 'success' | 'error' | 'loading';
  message: string;
  timestamp?: string;
  details?: any;
}

interface SimpleAITestProps {
  questId: string;
}

export const SimpleAITest: React.FC<SimpleAITestProps> = ({ questId }) => {
  const [pingResult, setPingResult] = useState<TestResult | null>(null);
  const [openaiResult, setOpenaiResult] = useState<TestResult | null>(null);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);

  const testPing = async () => {
    console.log('🏓 [CLIENT] Début test ping...');
    setIsTestingPing(true);
    setPingResult({ status: 'loading', message: 'Test de connectivité en cours...' });

    try {
      console.log('📡 [CLIENT] Appel Edge Function ai-investigation-v2...');
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'ping',
          questId: questId,
          clientTimestamp: new Date().toISOString()
        }
      });

      console.log('📊 [CLIENT] Réponse reçue - error:', error, 'data:', data);

      if (error) {
        console.error('❌ [CLIENT] Erreur Supabase:', error);
        setPingResult({
          status: 'error',
          message: `Erreur Supabase: ${error.message}`,
          details: error
        });
        return;
      }

      if (data?.status === 'success') {
        console.log('✅ [CLIENT] Ping réussi!');
        setPingResult({
          status: 'success',
          message: `Connectivité OK - ${data.message}`,
          timestamp: data.timestamp,
          details: data
        });
      } else {
        console.log('⚠️ [CLIENT] Ping avec problème:', data);
        setPingResult({
          status: 'error',
          message: data?.message || 'Réponse inattendue',
          details: data
        });
      }

    } catch (error: any) {
      console.error('💥 [CLIENT] Exception ping:', error);
      setPingResult({
        status: 'error',
        message: `Exception: ${error.message}`,
        details: { error: error.message, stack: error.stack }
      });
    } finally {
      setIsTestingPing(false);
    }
  };

  const testOpenAI = async () => {
    console.log('🤖 [CLIENT] Début test OpenAI...');
    setIsTestingOpenAI(true);
    setOpenaiResult({ status: 'loading', message: 'Test OpenAI en cours...' });

    try {
      console.log('📡 [CLIENT] Appel OpenAI via Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { 
          action: 'test_openai',
          questId: questId,
          clientTimestamp: new Date().toISOString()
        }
      });

      console.log('📊 [CLIENT] Réponse OpenAI - error:', error, 'data:', data);

      if (error) {
        console.error('❌ [CLIENT] Erreur Supabase OpenAI:', error);
        setOpenaiResult({
          status: 'error',
          message: `Erreur Supabase: ${error.message}`,
          details: error
        });
        return;
      }

      if (data?.status === 'success') {
        console.log('✅ [CLIENT] OpenAI réussi!');
        setOpenaiResult({
          status: 'success',
          message: `OpenAI OK: ${data.aiResponse}`,
          timestamp: data.timestamp,
          details: data
        });
      } else {
        console.log('⚠️ [CLIENT] OpenAI avec problème:', data);
        setOpenaiResult({
          status: 'error',
          message: data?.message || 'Erreur OpenAI',
          details: data
        });
      }

    } catch (error: any) {
      console.error('💥 [CLIENT] Exception OpenAI:', error);
      setOpenaiResult({
        status: 'error',
        message: `Exception: ${error.message}`,
        details: { error: error.message, stack: error.stack }
      });
    } finally {
      setIsTestingOpenAI(false);
    }
  };

  const getStatusIcon = (result: TestResult | null, isLoading: boolean) => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    if (!result) return <AlertCircle className="h-4 w-4 text-gray-400" />;
    if (result.status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (result.status === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
  };

  const getStatusColor = (result: TestResult | null, isLoading: boolean) => {
    if (isLoading) return 'text-blue-600';
    if (!result) return 'text-gray-500';
    if (result.status === 'success') return 'text-green-600';
    if (result.status === 'error') return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Test IA Simplifié
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Ping */}
        <div className="space-y-2">
          <Button
            onClick={testPing}
            disabled={isTestingPing}
            variant="outline"
            className="w-full"
          >
            {isTestingPing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test Connectivité...
              </>
            ) : (
              '🏓 Test Connectivité Edge Function'
            )}
          </Button>
          
          {pingResult && (
            <div className={`flex items-start gap-2 p-3 rounded-lg border ${
              pingResult.status === 'success' ? 'bg-green-50 border-green-200' :
              pingResult.status === 'error' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              {getStatusIcon(pingResult, isTestingPing)}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getStatusColor(pingResult, isTestingPing)}`}>
                  {pingResult.message}
                </p>
                {pingResult.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(pingResult.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Test OpenAI */}
        <div className="space-y-2">
          <Button
            onClick={testOpenAI}
            disabled={isTestingOpenAI || !pingResult || pingResult.status !== 'success'}
            variant="outline"
            className="w-full"
          >
            {isTestingOpenAI ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Test OpenAI...
              </>
            ) : (
              '🤖 Test OpenAI'
            )}
          </Button>
          
          {openaiResult && (
            <div className={`flex items-start gap-2 p-3 rounded-lg border ${
              openaiResult.status === 'success' ? 'bg-green-50 border-green-200' :
              openaiResult.status === 'error' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              {getStatusIcon(openaiResult, isTestingOpenAI)}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${getStatusColor(openaiResult, isTestingOpenAI)}`}>
                  {openaiResult.message}
                </p>
                {openaiResult.timestamp && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(openaiResult.timestamp).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Instructions:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Commencez par tester la connectivité de base</li>
            <li>Si le ping fonctionne, testez OpenAI</li>
            <li>Consultez la console pour les logs détaillés</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};