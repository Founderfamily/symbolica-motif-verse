import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2, 
  Activity,
  Clock,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useEdgeFunctionDiagnostics, DiagnosticResult } from '@/hooks/useEdgeFunctionDiagnostics';

interface AIProactiveDiagnosticPanelProps {
  questId: string;
  isVisible: boolean;
}

const getStatusIcon = (status: DiagnosticResult['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'pending':
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: DiagnosticResult['status']) => {
  switch (status) {
    case 'success':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'error':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'warning':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'pending':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

export const AIProactiveDiagnosticPanel: React.FC<AIProactiveDiagnosticPanelProps> = ({
  questId,
  isVisible
}) => {
  const { diagnostics, isRunning, runFullDiagnostics } = useEdgeFunctionDiagnostics();

  if (!isVisible) return null;

  return (
    <Card className="border-orange-200 bg-orange-50/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Activity className="h-5 w-5" />
            🔧 Diagnostic Système IA
          </CardTitle>
          <Button
            size="sm"
            onClick={() => runFullDiagnostics(questId)}
            disabled={isRunning}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isRunning ? 'Test en cours...' : 'Lancer Diagnostic'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {diagnostics.length === 0 && !isRunning && (
          <div className="text-center py-4 text-orange-700">
            <Zap className="h-8 w-8 mx-auto mb-2 text-orange-500" />
            <p>Aucun diagnostic effectué</p>
            <p className="text-sm text-orange-600 mt-1">
              Cliquez sur "Lancer Diagnostic" pour tester le système
            </p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-4">
            <Loader2 className="h-8 w-8 mx-auto mb-2 text-orange-500 animate-spin" />
            <p className="text-orange-700">Diagnostic en cours...</p>
          </div>
        )}

        {diagnostics.length > 0 && (
          <div className="space-y-3">
            {diagnostics.map((diagnostic, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(diagnostic.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(diagnostic.status)}
                    <span className="font-medium text-sm">{diagnostic.name}</span>
                  </div>
                  {diagnostic.duration && (
                    <Badge variant="outline" className="text-xs">
                      {diagnostic.duration}ms
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{diagnostic.message}</p>
                {diagnostic.details && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer hover:underline">
                      Détails techniques
                    </summary>
                    <pre className="text-xs mt-1 p-2 bg-black/5 rounded border overflow-x-auto">
                      {JSON.stringify(diagnostic.details, null, 2)}
                    </pre>
                  </details>
                )}
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(diagnostic.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};