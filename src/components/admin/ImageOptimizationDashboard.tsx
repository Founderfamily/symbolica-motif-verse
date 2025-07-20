
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Zap, 
  TrendingUp, 
  HardDrive, 
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  autoOptimizeImages, 
  autoFixBrokenImages,
  runMaintenanceTask,
  type OptimizationReport 
} from '@/utils/symbolImageSync';
import { imageOptimizationService } from '@/services/imageOptimizationService';

interface OptimizationStats {
  cacheSize: number;
  totalSavings: number;
  optimizedCount: number;
  compressionRate: number;
}

const ImageOptimizationDashboard: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [isRunningMaintenance, setIsRunningMaintenance] = useState(false);
  const [optimizationReport, setOptimizationReport] = useState<OptimizationReport | null>(null);
  const [stats, setStats] = useState<OptimizationStats>({
    cacheSize: 0,
    totalSavings: 0,
    optimizedCount: 0,
    compressionRate: 0
  });
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Charger les statistiques au démarrage
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const cacheStats = imageOptimizationService.getCacheStats();
    setStats(prev => ({
      ...prev,
      cacheSize: cacheStats.size
    }));
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setProgress(0);
    
    try {
      // Simuler le progrès pendant l'optimisation
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const report = await autoOptimizeImages();
      clearInterval(progressInterval);
      setProgress(100);
      
      setOptimizationReport(report);
      setStats(prev => ({
        ...prev,
        totalSavings: prev.totalSavings + report.totalSavings,
        optimizedCount: prev.optimizedCount + report.optimized,
        compressionRate: report.averageCompression
      }));
      
      toast({
        title: "Optimisation terminée",
        description: `${report.optimized} images optimisées, ${formatBytes(report.totalSavings)} économisés`,
      });
    } catch (error) {
      console.error('Erreur d\'optimisation:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'optimisation des images",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
      setProgress(0);
    }
  };

  const runAutoFix = async () => {
    setIsFixing(true);
    
    try {
      const result = await autoFixBrokenImages();
      
      toast({
        title: "Correction automatique terminée",
        description: `${result.fixed} images corrigées, ${result.failed} échecs`,
        variant: result.failed > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Erreur de correction:', error);
      toast({
        title: "Erreur",
        description: "Échec de la correction automatique",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const runFullMaintenance = async () => {
    setIsRunningMaintenance(true);
    
    try {
      const result = await runMaintenanceTask();
      
      setOptimizationReport(result.optimization);
      loadStats();
      
      toast({
        title: "Maintenance terminée",
        description: `Images vérifiées, ${result.autoFix.fixed} corrigées, ${result.optimization.optimized} optimisées`,
      });
    } catch (error) {
      console.error('Erreur de maintenance:', error);
      toast({
        title: "Erreur",
        description: "Échec de la tâche de maintenance",
        variant: "destructive",
      });
    } finally {
      setIsRunningMaintenance(false);
    }
  };

  const clearCache = () => {
    imageOptimizationService.clearCache();
    loadStats();
    toast({
      title: "Cache nettoyé",
      description: "Le cache d'optimisation a été vidé",
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadReport = () => {
    if (!optimizationReport) return;
    
    const report = {
      timestamp: new Date().toISOString(),
      ...optimizationReport,
      stats
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-optimization-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Tableau de Bord d'Optimisation d'Images</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCache} size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Nettoyer le cache
          </Button>
          {optimizationReport && (
            <Button variant="outline" onClick={downloadReport} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Télécharger le rapport
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.cacheSize}</div>
              <div className="text-sm text-gray-600">Images en cache</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-2xl font-bold text-green-600">{formatBytes(stats.totalSavings)}</div>
              <div className="text-sm text-gray-600">Espace économisé</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.optimizedCount}</div>
              <div className="text-sm text-gray-600">Images optimisées</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-600" />
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.compressionRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Taux de compression</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-2">Optimisation d'Images</h4>
          <p className="text-sm text-gray-600 mb-4">
            Optimise automatiquement toutes les images qui dépassent les seuils de taille
          </p>
          <Button 
            onClick={runOptimization} 
            disabled={isOptimizing}
            className="w-full"
          >
            <Zap className={`w-4 h-4 mr-2 ${isOptimizing ? 'animate-spin' : ''}`} />
            {isOptimizing ? 'Optimisation...' : 'Lancer l\'optimisation'}
          </Button>
          {isOptimizing && (
            <div className="mt-2">
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 mt-1">{progress}% terminé</p>
            </div>
          )}
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Correction Automatique</h4>
          <p className="text-sm text-gray-600 mb-4">
            Répare les liens d'images cassés en utilisant des images locales de fallback
          </p>
          <Button 
            onClick={runAutoFix} 
            disabled={isFixing}
            variant="outline"
            className="w-full"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFixing ? 'animate-spin' : ''}`} />
            {isFixing ? 'Correction...' : 'Corriger automatiquement'}
          </Button>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-2">Maintenance Complète</h4>
          <p className="text-sm text-gray-600 mb-4">
            Lance une tâche de maintenance complète incluant vérification, correction et optimisation
          </p>
          <Button 
            onClick={runFullMaintenance} 
            disabled={isRunningMaintenance}
            variant="secondary"
            className="w-full"
          >
            <Play className={`w-4 h-4 mr-2 ${isRunningMaintenance ? 'animate-spin' : ''}`} />
            {isRunningMaintenance ? 'Maintenance...' : 'Maintenance complète'}
          </Button>
        </Card>
      </div>

      {/* Rapport d'optimisation */}
      {optimizationReport && (
        <Card className="p-4">
          <h4 className="font-medium mb-4">Dernier Rapport d'Optimisation</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{optimizationReport.totalImages}</div>
              <div className="text-sm text-gray-600">Images traitées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{optimizationReport.optimized}</div>
              <div className="text-sm text-gray-600">Optimisées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{optimizationReport.failed}</div>
              <div className="text-sm text-gray-600">Échecs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatBytes(optimizationReport.totalSavings)}</div>
              <div className="text-sm text-gray-600">Économies</div>
            </div>
          </div>
          
          {optimizationReport.optimized > 0 && (
            <div className="mt-4">
              <div className="text-sm text-gray-600 mb-2">Taux de réussite</div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(optimizationReport.optimized / optimizationReport.totalImages) * 100} 
                  className="flex-1" 
                />
                <span className="text-sm font-medium">
                  {((optimizationReport.optimized / optimizationReport.totalImages) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">
              Compression moyenne: {optimizationReport.averageCompression.toFixed(1)}%
            </Badge>
            <Badge variant="outline">
              Généré le {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ImageOptimizationDashboard;
