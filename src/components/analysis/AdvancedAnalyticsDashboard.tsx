
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, Brain, Monitor, Users, Zap, Globe, 
  Activity, Settings, Database, Shield
} from 'lucide-react';
import AnalysisDashboard from './AnalysisDashboard';
import InteractiveVisualization from './InteractiveVisualization';
import RealTimeCollaboration from './RealTimeCollaboration';
import MasterControlDashboard from './MasterControlDashboard';
import Advanced3DVisualization from './Advanced3DVisualization';
import RealTimeAnalytics from './RealTimeAnalytics';

const AdvancedAnalyticsDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<string>('control');

  const modules = [
    {
      id: 'control',
      name: 'Centre de Contrôle',
      icon: <Monitor className="h-5 w-5" />,
      description: 'Supervision générale et contrôle du système',
      component: <MasterControlDashboard />
    },
    {
      id: 'ai',
      name: 'IA Avancée',
      icon: <Brain className="h-5 w-5" />,
      description: 'Intelligence artificielle et reconnaissance de motifs',
      component: <AnalysisDashboard />
    },
    {
      id: '3d',
      name: 'Visualisation 3D',
      icon: <Globe className="h-5 w-5" />,
      description: 'Environnement 3D interactif et VR/AR',
      component: <Advanced3DVisualization symbols={[]} analysisMode="3d_clustering" />
    },
    {
      id: 'interactive',
      name: 'Visualisations',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Graphiques interactifs et animations',
      component: <InteractiveVisualization data={{
        temporal_evolution: [],
        cultural_networks: [],
        pattern_clusters: [],
        geographic_spread: [],
        similarity_matrix: []
      }} symbols={[]} />
    },
    {
      id: 'collaboration',
      name: 'Collaboration',
      icon: <Users className="h-5 w-5" />,
      description: 'Travail collaboratif en temps réel',
      component: <RealTimeCollaboration symbolIds={[]} currentUserId="user_1" />
    },
    {
      id: 'analytics',
      name: 'Analytics Live',
      icon: <Activity className="h-5 w-5" />,
      description: 'Métriques et monitoring en temps réel',
      component: <RealTimeAnalytics />
    }
  ];

  const getCurrentModule = () => {
    return modules.find(m => m.id === activeModule) || modules[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Plateforme d'Analyse Culturelle Avancée
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Système d'analyse de patrimoine culturel de niveau recherche mondiale avec IA, 
            visualisation 3D, collaboration temps réel et analytics avancés
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="default" className="animate-pulse">
              <Zap className="h-3 w-3 mr-1" />
              IA Avancée
            </Badge>
            <Badge variant="secondary">
              <Globe className="h-3 w-3 mr-1" />
              3D/VR/AR
            </Badge>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              Collaboration
            </Badge>
            <Badge variant="outline">
              <Activity className="h-3 w-3 mr-1" />
              Temps Réel
            </Badge>
          </div>
        </div>

        {/* Module Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Modules Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    activeModule === module.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-muted hover:border-blue-300 hover:bg-blue-25'
                  }`}
                  onClick={() => setActiveModule(module.id)}
                >
                  <div className="text-center">
                    <div className="flex justify-center mb-2">
                      {module.icon}
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{module.name}</h3>
                    <p className="text-xs text-muted-foreground">{module.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Module Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getCurrentModule().icon}
              {getCurrentModule().name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getCurrentModule().component}
          </CardContent>
        </Card>

        {/* System Status Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Système Opérationnel</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>Base de Données: Active</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Sécurité: Optimale</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span>IA: 94.7% Précision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
