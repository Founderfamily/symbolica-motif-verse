
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, Activity, Users, Database, Zap, Settings,
  Brain, Globe, Clock, Shield, Rocket, AlertTriangle
} from 'lucide-react';
import Advanced3DVisualization from './Advanced3DVisualization';
import RealTimeAnalytics from './RealTimeAnalytics';
import { advancedAIService } from '@/services/advancedAIService';
import { intelligentNotificationService } from '@/services/intelligentNotificationService';

interface SystemStatus {
  overall_health: 'excellent' | 'good' | 'warning' | 'critical';
  ai_systems: boolean;
  collaboration_active: boolean;
  analytics_running: boolean;
  performance_optimal: boolean;
  security_status: 'secure' | 'monitoring' | 'alert';
}

interface FeatureStatus {
  ai_pattern_recognition: boolean;
  real_time_collaboration: boolean;
  advanced_3d: boolean;
  predictive_analytics: boolean;
  auto_optimization: boolean;
  intelligent_notifications: boolean;
}

const MasterControlDashboard: React.FC = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    overall_health: 'excellent',
    ai_systems: true,
    collaboration_active: true,
    analytics_running: true,
    performance_optimal: true,
    security_status: 'secure'
  });

  const [featureStatus, setFeatureStatus] = useState<FeatureStatus>({
    ai_pattern_recognition: true,
    real_time_collaboration: true,
    advanced_3d: true,
    predictive_analytics: true,
    auto_optimization: true,
    intelligent_notifications: true
  });

  const [systemMetrics, setSystemMetrics] = useState({
    total_analyses: 12847,
    active_users: 156,
    ai_accuracy: 94.7,
    system_uptime: 99.8,
    data_processed: 2.4, // TB
    discoveries_today: 23
  });

  const [activeView, setActiveView] = useState<'overview' | 'ai' | '3d' | 'analytics' | 'collaboration'>('overview');

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      updateSystemMetrics();
      checkSystemHealth();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateSystemMetrics = () => {
    setSystemMetrics(prev => ({
      ...prev,
      active_users: prev.active_users + Math.floor(Math.random() * 3) - 1,
      discoveries_today: prev.discoveries_today + (Math.random() > 0.9 ? 1 : 0),
      ai_accuracy: Math.max(90, Math.min(99, prev.ai_accuracy + (Math.random() - 0.5) * 0.5))
    }));
  };

  const checkSystemHealth = () => {
    // Simulate health monitoring
    const healthScore = Math.random();
    setSystemStatus(prev => ({
      ...prev,
      overall_health: healthScore > 0.9 ? 'excellent' : 
                    healthScore > 0.7 ? 'good' : 
                    healthScore > 0.5 ? 'warning' : 'critical'
    }));
  };

  const toggleFeature = (feature: keyof FeatureStatus) => {
    setFeatureStatus(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const runDiagnostics = async () => {
    console.log('Running comprehensive system diagnostics...');
    // Simulate diagnostics
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Diagnostics completed successfully');
  };

  const getHealthColor = (health: SystemStatus['overall_health']) => {
    switch (health) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
    }
  };

  const getHealthBadgeVariant = (health: SystemStatus['overall_health']) => {
    switch (health) {
      case 'excellent': return 'default';
      case 'good': return 'secondary';
      case 'warning': return 'outline';
      case 'critical': return 'destructive';
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Centre de Contrôle Principal</h1>
          <p className="text-muted-foreground">
            Gestion et supervision de la plateforme d'analyse culturelle
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={getHealthBadgeVariant(systemStatus.overall_health)} className="animate-pulse">
            <Monitor className="h-3 w-3 mr-1" />
            Système: {systemStatus.overall_health.toUpperCase()}
          </Badge>
          <Button onClick={runDiagnostics} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Diagnostics
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Database className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{systemMetrics.total_analyses.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Analyses Totales</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{systemMetrics.active_users}</div>
            <div className="text-xs text-muted-foreground">Utilisateurs Actifs</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{systemMetrics.ai_accuracy.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Précision IA</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{systemMetrics.system_uptime}%</div>
            <div className="text-xs text-muted-foreground">Disponibilité</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Database className="h-6 w-6 mx-auto mb-2 text-indigo-500" />
            <div className="text-2xl font-bold">{systemMetrics.data_processed.toFixed(1)}TB</div>
            <div className="text-xs text-muted-foreground">Données Traitées</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{systemMetrics.discoveries_today}</div>
            <div className="text-xs text-muted-foreground">Découvertes/Jour</div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Contrôle des Fonctionnalités
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Intelligence Artificielle</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Reconnaissance de Motifs</span>
                  <Switch 
                    checked={featureStatus.ai_pattern_recognition}
                    onCheckedChange={() => toggleFeature('ai_pattern_recognition')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Analytics Prédictifs</span>
                  <Switch 
                    checked={featureStatus.predictive_analytics}
                    onCheckedChange={() => toggleFeature('predictive_analytics')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Notifications Intelligentes</span>
                  <Switch 
                    checked={featureStatus.intelligent_notifications}
                    onCheckedChange={() => toggleFeature('intelligent_notifications')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Visualisation & UX</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visualisation 3D</span>
                  <Switch 
                    checked={featureStatus.advanced_3d}
                    onCheckedChange={() => toggleFeature('advanced_3d')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Collaboration Temps Réel</span>
                  <Switch 
                    checked={featureStatus.real_time_collaboration}
                    onCheckedChange={() => toggleFeature('real_time_collaboration')}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Optimisation Système</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-Optimisation</span>
                  <Switch 
                    checked={featureStatus.auto_optimization}
                    onCheckedChange={() => toggleFeature('auto_optimization')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Monitoring Avancé</span>
                  <Switch checked={true} disabled />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'Ensemble</TabsTrigger>
          <TabsTrigger value="ai">IA Avancée</TabsTrigger>
          <TabsTrigger value="3d">Visualisation 3D</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Statut des Systèmes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(systemStatus).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {key.replace('_', ' ')}
                    </span>
                    <Badge variant={typeof value === 'boolean' && value ? 'default' : 'secondary'}>
                      {typeof value === 'boolean' ? (value ? 'Actif' : 'Inactif') : value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance en Temps Réel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Utilisation CPU</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Mémoire</span>
                    <span>67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Réseau</span>
                    <span>23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Intelligence Artificielle Avancée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Moteur IA de Nouvelle Génération</h3>
                <p className="text-muted-foreground mb-4">
                  Reconnaissance de motifs avancée, prédictions culturelles et analyse sémantique automatique
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">94.7%</div>
                    <div className="text-sm">Précision</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">2.3s</div>
                    <div className="text-sm">Temps Moyen</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">156</div>
                    <div className="text-sm">Modèles Actifs</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="3d">
          <Advanced3DVisualization 
            symbols={[]} 
            analysisMode="3d_clustering" 
          />
        </TabsContent>

        <TabsContent value="analytics">
          <RealTimeAnalytics />
        </TabsContent>

        <TabsContent value="collaboration">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Collaboration Avancée
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Espace de Collaboration Temps Réel</h3>
                <p className="text-muted-foreground mb-4">
                  Sessions partagées, édition collaborative et communication intégrée
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{systemMetrics.active_users}</div>
                    <div className="text-sm">Utilisateurs Actifs</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-sm">Sessions Partagées</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">8</div>
                    <div className="text-sm">Projets Collaboratifs</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">245</div>
                    <div className="text-sm">Messages/Heure</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MasterControlDashboard;
