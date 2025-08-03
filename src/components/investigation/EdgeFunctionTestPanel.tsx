import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEdgeFunctionDiagnostics } from '@/hooks/useEdgeFunctionDiagnostics';
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  XCircle,
  Play,
  Wifi,
  Database,
  Zap,
  Target
} from 'lucide-react';

interface EdgeFunctionTestPanelProps {
  questId: string;
}

const EdgeFunctionTestPanel: React.FC<EdgeFunctionTestPanelProps> = ({ questId }) => {
  const { 
    diagnostics, 
    isRunning, 
    runFullDiagnostics,
    testSupabaseConnection,
    testDirectCall,
    testEdgeFunctionPing
  } = useEdgeFunctionDiagnostics();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-50 text-green-700 border-green-200';
      case 'error': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'pending': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          🔧 Test Connectivité Edge Function
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Boutons de test */}
        <div className="flex flex-wrap gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => runFullDiagnostics(questId)}
            disabled={isRunning}
          >
            <Play className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Test en cours...' : 'Test Complet'}
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={testSupabaseConnection}
            disabled={isRunning}
          >
            <Database className="h-4 w-4 mr-2" />
            Test DB
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={testDirectCall}
            disabled={isRunning}
          >
            <Wifi className="h-4 w-4 mr-2" />
            Test Direct
          </Button>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={testEdgeFunctionPing}
            disabled={isRunning}
          >
            <Target className="h-4 w-4 mr-2" />
            Test Ping
          </Button>
        </div>

        {/* Résultats de diagnostic */}
        {diagnostics.length === 0 && !isRunning && (
          <div className="text-center py-6 text-muted-foreground">
            <Zap className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun test effectué</p>
            <p className="text-sm">Cliquez sur "Test Complet" pour diagnostiquer</p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-6">
            <Activity className="h-8 w-8 mx-auto mb-2 animate-pulse text-blue-500" />
            <p className="text-sm text-muted-foreground">Diagnostic en cours...</p>
          </div>
        )}

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            {diagnostics.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium text-sm">{result.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.duration && (
                      <Badge variant="outline" className="text-xs">
                        {result.duration}ms
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(result.status)}`}
                    >
                      {result.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-muted-foreground hover:text-foreground">
                      Détails techniques
                    </summary>
                    <pre className="text-xs mt-1 p-2 bg-muted/50 rounded overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EdgeFunctionTestPanel;