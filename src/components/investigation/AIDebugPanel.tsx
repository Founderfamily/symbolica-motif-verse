import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { 
  Bug, 
  TestTube, 
  Wifi, 
  Database, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Loader2,
  Network
} from 'lucide-react';

interface DebugTest {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'success' | 'error';
  result?: string;
  duration?: number;
}

const AIDebugPanel: React.FC = () => {
  const { toast } = useToast();
  const [tests, setTests] = useState<DebugTest[]>([
    { id: 'auth', name: 'Authentification', status: 'idle' },
    { id: 'supabase', name: 'Connexion Supabase', status: 'idle' },
    { id: 'edge-ping', name: 'Edge Function Ping', status: 'idle' },
    { id: 'edge-openai', name: 'Edge Function OpenAI', status: 'idle' },
    { id: 'full-request', name: 'Requête Investigation Complète', status: 'idle' }
  ]);
  
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [manualTest, setManualTest] = useState('');
  const [manualResult, setManualResult] = useState('');

  const updateTestStatus = (id: string, status: 'running' | 'success' | 'error', result?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.id === id ? { ...test, status, result, duration } : test
    ));
  };

  const runTest = async (testId: string) => {
    const startTime = Date.now();
    updateTestStatus(testId, 'running');

    try {
      switch (testId) {
        case 'auth':
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) throw error;
          updateTestStatus(testId, 'success', 
            user ? `Utilisateur connecté: ${user.email}` : 'Utilisateur anonyme', 
            Date.now() - startTime
          );
          break;

        case 'supabase':
          const { data, error: dbError } = await supabase
            .from('treasure_quests')
            .select('id')
            .limit(1);
          if (dbError) throw dbError;
          updateTestStatus(testId, 'success', 
            `Base de données accessible. ${data?.length || 0} résultats`, 
            Date.now() - startTime
          );
          break;

        case 'edge-ping':
          const { data: pingData, error: pingError } = await supabase.functions.invoke('ai-investigation-v2', {
            body: { action: 'ping', timestamp: new Date().toISOString() }
          });
          if (pingError) throw pingError;
          updateTestStatus(testId, 'success', 
            `Ping réussi: ${pingData?.message || 'OK'}`, 
            Date.now() - startTime
          );
          break;

        case 'edge-openai':
          const { data: openaiData, error: openaiError } = await supabase.functions.invoke('ai-investigation-v2', {
            body: { action: 'test_openai', timestamp: new Date().toISOString() }
          });
          if (openaiError) throw openaiError;
          updateTestStatus(testId, openaiData?.status === 'success' ? 'success' : 'error', 
            openaiData?.message || openaiData?.error || 'Test OpenAI', 
            Date.now() - startTime
          );
          break;

        case 'full-request':
          const mockQuest = {
            id: 'debug-test',
            title: 'Test Debug Investigation',
            description: 'Quête de test pour le debug',
            clues: [{ title: 'Indice test', description: 'Test description' }]
          };

          const { data: fullData, error: fullError } = await supabase.functions.invoke('ai-investigation-v2', {
            body: { 
              action: 'full_investigation',
              questId: 'debug-test',
              questData: mockQuest,
              userId: 'debug-user',
              timestamp: new Date().toISOString()
            }
          });
          
          if (fullError) throw fullError;
          updateTestStatus(testId, fullData?.status === 'success' ? 'success' : 'error', 
            fullData?.investigation ? 'Investigation générée avec succès' : fullData?.message || 'Erreur inconnue', 
            Date.now() - startTime
          );
          break;

        default:
          throw new Error('Test inconnu');
      }
    } catch (error: any) {
      console.error(`Erreur test ${testId}:`, error);
      updateTestStatus(testId, 'error', error.message || 'Erreur inconnue', Date.now() - startTime);
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id);
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const checkNetworkInfo = () => {
    const info = {
      userAgent: navigator.userAgent,
      online: navigator.onLine,
      connection: (navigator as any).connection?.effectiveType || 'inconnue',
      timestamp: new Date().toISOString()
    };
    setNetworkInfo(info);
  };

  const runManualTest = async () => {
    if (!manualTest.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer une requête de test",
        variant: "destructive"
      });
      return;
    }

    try {
      const testData = JSON.parse(manualTest);
      const { data, error } = await supabase.functions.invoke('ai-investigation-v2', {
        body: testData
      });

      if (error) throw error;
      setManualResult(JSON.stringify(data, null, 2));
    } catch (error: any) {
      setManualResult(`Erreur: ${error.message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-green-100 text-green-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bug className="h-6 w-6 text-amber-600" />
            <div>
              <CardTitle className="text-xl font-bold text-amber-800">
                Panneau de Diagnostic IA
              </CardTitle>
              <p className="text-sm text-amber-600 mt-1">
                Outils de debug et tests avancés pour l'investigation IA
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button onClick={runAllTests} variant="outline" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Lancer tous les tests
            </Button>
            <Button onClick={checkNetworkInfo} variant="outline" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Info Réseau
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tests automatiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Tests Automatiques
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tests.map(test => (
            <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <span className="font-medium">{test.name}</span>
                <Badge className={getStatusColor(test.status)}>
                  {test.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {test.duration && (
                  <span className="text-sm text-muted-foreground">
                    {test.duration}ms
                  </span>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => runTest(test.id)}
                  disabled={test.status === 'running'}
                >
                  Tester
                </Button>
              </div>
            </div>
          ))}
          
          {tests.some(t => t.result) && (
            <div className="mt-4 space-y-2">
              <h4 className="font-medium">Résultats des tests :</h4>
              {tests.filter(t => t.result).map(test => (
                <div key={test.id} className="p-2 bg-muted rounded text-sm">
                  <strong>{test.name}:</strong> {test.result}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informations réseau */}
      {networkInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Informations Réseau
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><strong>Statut:</strong> {networkInfo.online ? 'En ligne' : 'Hors ligne'}</div>
              <div><strong>Type de connexion:</strong> {networkInfo.connection}</div>
              <div><strong>User Agent:</strong> {networkInfo.userAgent}</div>
              <div><strong>Timestamp:</strong> {networkInfo.timestamp}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test manuel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Test Manuel Edge Function
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Requête JSON (body de la requête):
            </label>
            <Textarea
              placeholder='{"action": "ping", "timestamp": "2024-01-01T00:00:00.000Z"}'
              value={manualTest}
              onChange={(e) => setManualTest(e.target.value)}
              className="min-h-[100px] font-mono text-sm"
            />
          </div>
          
          <Button onClick={runManualTest} className="w-full">
            Exécuter Test Manuel
          </Button>
          
          {manualResult && (
            <div>
              <label className="text-sm font-medium mb-2 block">Résultat:</label>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto max-h-[300px]">
                {manualResult}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDebugPanel;