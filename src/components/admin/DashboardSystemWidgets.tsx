
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Activity, Database, AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { monitoringService, SystemHealth, PerformanceMetrics } from '@/services/admin/monitoringService';
import { backupService, BackupResult } from '@/services/admin/backupService';
import { Link } from 'react-router-dom';

const DashboardSystemWidgets: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [lastBackup, setLastBackup] = useState<BackupResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemOverview();
  }, []);

  const loadSystemOverview = async () => {
    try {
      const [systemHealth, performanceMetrics, backupList] = await Promise.all([
        monitoringService.checkSystemHealth(),
        monitoringService.collectMetrics(),
        backupService.listBackups()
      ]);
      
      setHealth(systemHealth);
      setMetrics(performanceMetrics);
      setLastBackup(backupList[0] || null);
    } catch (error) {
      console.error('Erreur chargement aperçu système:', error);
    } finally {
      setLoading(false);
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5" />;
      case 'warning': return <AlertTriangle className="h-5 w-5" />;
      case 'critical': return <AlertTriangle className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Widgets d'état système */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* État général */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État système</CardTitle>
            {health && getHealthIcon(health.overall)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {health?.overall || 'Inconnu'}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernière vérification: {health ? new Date(health.lastCheck).toLocaleTimeString('fr-FR') : 'N/A'}
            </p>
            {health && health.issues.length > 0 && (
              <Badge variant="destructive" className="mt-2">
                {health.issues.length} problème(s)
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.responseTime || 0}ms
            </div>
            <p className="text-xs text-muted-foreground">
              Temps de réponse moyen
            </p>
            {metrics && metrics.responseTime > 2000 && (
              <Badge variant="destructive" className="mt-2">
                Lent
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Utilisateurs actifs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics?.activeUsers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Dernières 24h
            </p>
          </CardContent>
        </Card>

        {/* Dernière sauvegarde */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dernière sauvegarde</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lastBackup ? (
                <Badge className={
                  lastBackup.status === 'success' ? 'bg-green-500' :
                  lastBackup.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                }>
                  {lastBackup.status}
                </Badge>
              ) : (
                <span className="text-gray-500">Aucune</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastBackup ? new Date(lastBackup.timestamp).toLocaleDateString('fr-FR') : 'Jamais'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerte si problèmes critiques */}
      {health && health.overall === 'critical' && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Problèmes critiques détectés
            </CardTitle>
            <CardDescription className="text-red-700">
              Le système présente des problèmes nécessitant une attention immédiate.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-sm text-red-700 space-y-1 mb-4">
              {health.issues.map((issue, index) => (
                <li key={index}>{issue}</li>
              ))}
            </ul>
            <Link to="/admin/settings">
              <Button variant="destructive" size="sm">
                Aller au monitoring système
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Actions rapides */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>
            Accès rapide aux fonctions de maintenance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Link to="/admin/settings">
              <Button variant="outline" size="sm">
                <Activity className="h-4 w-4 mr-2" />
                Monitoring complet
              </Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Gestion sauvegardes
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadSystemOverview}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSystemWidgets;
