
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCw, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Search,
  Download
} from 'lucide-react';
import { 
  checkAllSymbolsImageHealth, 
  generateImageHealthReport,
  debugSymbolImages,
  type ImageHealthStatus 
} from '@/utils/symbolImageSync';

const SymbolImageDiagnostic: React.FC = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [healthStatuses, setHealthStatuses] = useState<ImageHealthStatus[]>([]);
  const [report, setReport] = useState<any>(null);
  const { toast } = useToast();

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const statuses = await checkAllSymbolsImageHealth();
      const newReport = generateImageHealthReport(statuses);
      
      setHealthStatuses(statuses);
      setReport(newReport);
      
      toast({
        title: "Vérification terminée",
        description: `${newReport.total} symboles analysés. ${newReport.healthy} en bonne santé, ${newReport.needsAttention + newReport.critical} nécessitent une attention.`,
      });
    } catch (error) {
      console.error('Error during health check:', error);
      toast({
        title: "Erreur",
        description: "Impossible de vérifier l'état des images",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getStatusIcon = (status: ImageHealthStatus) => {
    switch (status.recommendedAction) {
      case 'none':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'add_local_mapping':
      case 'fix_supabase_image':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'both':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (action: string) => {
    const variants = {
      none: 'bg-green-100 text-green-800',
      add_local_mapping: 'bg-yellow-100 text-yellow-800',
      fix_supabase_image: 'bg-orange-100 text-orange-800',
      both: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      none: 'OK',
      add_local_mapping: 'Mapping local manquant',
      fix_supabase_image: 'Image Supabase cassée',
      both: 'Problème critique'
    };
    
    return (
      <Badge className={variants[action as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {labels[action as keyof typeof labels] || action}
      </Badge>
    );
  };

  const downloadReport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      summary: report,
      details: healthStatuses
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symbol-image-health-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Diagnostic des Images de Symboles</h3>
        <div className="flex gap-2">
          <Button 
            onClick={runHealthCheck} 
            disabled={isChecking}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Vérification...' : 'Lancer la vérification'}
          </Button>
          {report && (
            <Button variant="outline" onClick={downloadReport} className="gap-2">
              <Download className="w-4 h-4" />
              Télécharger le rapport
            </Button>
          )}
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{report.healthy}</div>
                <div className="text-sm text-gray-600">En bonne santé</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{report.needsAttention}</div>
                <div className="text-sm text-gray-600">Attention requise</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">{report.critical}</div>
                <div className="text-sm text-gray-600">Critique</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{report.total}</div>
                <div className="text-sm text-gray-600">Total analysé</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {healthStatuses.length > 0 && (
        <Card>
          <div className="p-4 border-b">
            <h4 className="font-medium">Détails des symboles</h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {healthStatuses
              .filter(status => status.recommendedAction !== 'none') // Afficher d'abord les problématiques
              .concat(healthStatuses.filter(status => status.recommendedAction === 'none'))
              .map((status, index) => (
                <div key={status.symbolId} className="p-4 border-b last:border-b-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <div className="font-medium">{status.symbolName}</div>
                      <div className="text-sm text-gray-600">
                        Supabase: {status.hasSupabaseImage ? (status.supabaseImageValid ? '✓' : '✗') : 'Non'} | 
                        Local: {status.hasLocalFallback ? '✓' : '✗'}
                      </div>
                      {status.error && (
                        <div className="text-xs text-red-600 mt-1">{status.error}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(status.recommendedAction)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => debugSymbolImages(status.symbolId)}
                      title="Debug dans la console"
                    >
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default SymbolImageDiagnostic;
