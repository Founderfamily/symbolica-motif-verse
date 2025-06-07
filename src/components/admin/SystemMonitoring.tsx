
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Activity, AlertTriangle, CheckCircle, Database, Shield, Server, RefreshCw } from 'lucide-react';
import { monitoringService, SystemHealth, PerformanceMetrics, Alert } from '@/services/admin/monitoringService';
import { useAuth } from '@/hooks/useAuth';

const SystemMonitoring: React.FC = () => {
  const { isAdmin } = useAuth();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadSystemData();
      const interval = setInterval(loadSystemData, 30000); // Actualiser toutes les 30s
      return () => clearInterval(interval);
    }
  }, [isAdmin]);

  const loadSystemData = async () => {
    try {
      const [systemHealth, performanceMetrics, activeAlerts] = await Promise.all([
        monitoringService.checkSystemHealth(),
        monitoringService.collectMetrics(),
        monitoringService.getActiveAlerts()
      ]);
      
      setHealth(systemHealth);
      setMetrics(performanceMetrics);
      setAlerts(activeAlerts);
    } catch (error) {
      console.error('Erreur chargement données système:', error);
      toast.error('Erreur lors du chargement des données système');
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const success = await monitoringService.resolveAlert(alertId);
      if (success) {
        toast.success('Alerte résolue');
        await loadSystemData();
      } else {
        toast.error('Erreur lors de la résolution de l\'alerte');
      }
    } catch (error) {
      console.error('Erreur résolution alerte:', error);
      toast.error('Erreur lors de la résolution de l\'alerte');
    }
  };

  const runThresholdCheck = async () => {
    try {
      await monitoringService.checkThresholds();
      toast.success('Vérification des seuils effectuée');
      await loadSystemData();
    } catch (error) {
      console.error('Erreur vérification seuils:', error);
      toast.error('Erreur lors de la vérification des seuils');
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accès refusé</CardTitle>
          <CardDescription>Vous devez être administrateur pour accéder à cette fonctionnalité.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin" />
            <span className="ml-2">Chargement des données système...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* État général du système */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Santé du système
              </CardTitle>
              <CardDescription>
                État global de l'infrastructure et des services
              </CardDescription>
            </div>
            <Button variant="outline" onClick={loadSystemData} size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {health && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg ${getHealthColor(health.overall)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getHealthIcon(health.overall)}
                  <span className="font-medium">État général</span>
                </div>
                <div className="text-sm capitalize">{health.overall}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${getHealthColor(health.database)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Database className="h-5 w-5" />
                  <span className="font-medium">Base de données</span>
                </div>
                <div className="text-sm capitalize">{health.database}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${getHealthColor(health.storage)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-5 w-5" />
                  <span className="font-medium">Stockage</span>
                </div>
                <div className="text-sm capitalize">{health.storage}</div>
              </div>
              
              <div className={`p-4 rounded-lg ${getHealthColor(health.auth)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Authentification</span>
                </div>
                <div className="text-sm capitalize">{health.auth}</div>
              </div>
            </div>
          )}
          
          {health && health.issues.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="font-medium text-red-800 mb-2">Problèmes détectés:</div>
              <ul className="text-sm text-red-700 space-y-1">
                {health.issues.map((issue, index) => (
                  <li key={index}>• {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métriques de performance */}
      <Card>
        <CardHeader>
          <CardTitle>Métriques de performance</CardTitle>
          <CardDescription>
            Indicateurs temps réel de performance du système
          </CardDescription>
        </CardHeader>
        <CardContent>
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Temps de réponse</div>
                <div className="text-2xl font-bold">{metrics.responseTime}ms</div>
                <Progress value={Math.min(metrics.responseTime / 50, 100)} className="mt-2" />
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Taux d'erreur</div>
                <div className="text-2xl font-bold">{metrics.errorRate}%</div>
                <Progress value={metrics.errorRate} className="mt-2" />
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Utilisateurs actifs</div>
                <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Connexions DB</div>
                <div className="text-2xl font-bold">{metrics.dbConnections}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Stockage utilisé</div>
                <div className="text-2xl font-bold">{metrics.storageUsage}%</div>
                <Progress value={metrics.storageUsage} className="mt-2" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alertes actives */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes actives ({alerts.length})
              </CardTitle>
              <CardDescription>
                Notifications système nécessitant une attention
              </CardDescription>
            </div>
            <Button variant="outline" onClick={runThresholdCheck} size="sm">
              Vérifier les seuils
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune alerte active</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getAlertTypeColor(alert.type)}>
                        {alert.type}
                      </Badge>
                      <span className="font-medium">{alert.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {new Date(alert.timestamp).toLocaleString('fr-FR')}
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => resolveAlert(alert.id)}
                      >
                        Résoudre
                      </Button>
                    </div>
                  </div>
                  <p className="text-gray-700">{alert.message}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Source: {alert.source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMonitoring;
