import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  details?: any;
}

export const AIConnectivityTest: React.FC = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return null;
    }
  };

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);

    // Test 1: Ping Edge Function
    addResult({ name: 'Test de ping', status: 'pending', message: 'Test en cours...' });
    try {
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { action: 'ping' }
      });

      if (error) throw error;
      
      setResults(prev => prev.map(r => 
        r.name === 'Test de ping' 
          ? { ...r, status: 'success' as const, message: 'Edge Function accessible', details: data }
          : r
      ));
    } catch (error: any) {
      setResults(prev => prev.map(r => 
        r.name === 'Test de ping' 
          ? { ...r, status: 'error' as const, message: `Erreur: ${error.message}`, details: error }
          : r
      ));
    }

    // Test 2: OpenAI Configuration
    addResult({ name: 'Configuration OpenAI', status: 'pending', message: 'Vérification...' });
    try {
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: { action: 'test_openai' }
      });

      if (error) throw error;
      
      setResults(prev => prev.map(r => 
        r.name === 'Configuration OpenAI' 
          ? { 
              ...r, 
              status: data.status === 'success' ? 'success' as const : 'error' as const, 
              message: data.message || 'Test terminé',
              details: data 
            }
          : r
      ));
    } catch (error: any) {
      setResults(prev => prev.map(r => 
        r.name === 'Configuration OpenAI' 
          ? { ...r, status: 'error' as const, message: `Erreur: ${error.message}`, details: error }
          : r
      ));
    }

    setIsRunning(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🔧 Test de Connectivité IA</CardTitle>
        <CardDescription>
          Vérifiez que l'Edge Function IA et OpenAI sont correctement configurés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runTests} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Test en cours...
            </>
          ) : (
            'Lancer les Tests'
          )}
        </Button>

        {results.length === 0 && !isRunning && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Cliquez sur "Lancer les Tests" pour vérifier la connectivité IA
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          {results.map((result, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm text-muted-foreground">{result.message}</div>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-blue-600">
                      Détails techniques
                    </summary>
                    <pre className="mt-1 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}
        </div>

        {results.some(r => r.status === 'error') && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Certains tests ont échoué. Vérifiez la configuration de vos secrets Supabase.
            </AlertDescription>
          </Alert>
        )}

        {results.length > 0 && results.every(r => r.status === 'success') && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Tous les tests ont réussi ! L'IA devrait fonctionner correctement.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};