import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Brain, 
  MapPin, 
  Users, 
  FileText, 
  Clock,
  TrendingUp,
  Sparkles,
  MessageCircle,
  Camera,
  Search,
  Target,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AIInsightsWidget from './AIInsightsWidget';

interface ActivityItem {
  id: string;
  type: 'ai_analysis' | 'user_discovery' | 'new_clue' | 'location_added' | 'discussion' | 'evidence';
  title: string;
  description: string;
  user_name?: string;
  timestamp: string;
  metadata?: any;
}

interface NextStep {
  id: string;
  type: 'investigate_location' | 'analyze_connection' | 'verify_evidence' | 'contact_expert';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
}

interface EnhancedLiveActivityFeedProps {
  questId: string;
}

const EnhancedLiveActivityFeed: React.FC<EnhancedLiveActivityFeedProps> = ({ questId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [nextSteps, setNextSteps] = useState<NextStep[]>([]);
  const [aiConnections, setAiConnections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnhancedActivityData();
  }, [questId]);

  const loadEnhancedActivityData = async () => {
    try {
      // Charger les analyses IA récentes
      const { data: aiData } = await supabase
        .from('ai_investigations')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(5);

      // Simuler des activités enrichies avec les données IA
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'ai_analysis',
          title: 'Nouvelles connexions détectées',
          description: 'L\'IA a identifié des liens entre François Ier et les symboles de la quête',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
          metadata: { confidence: 87, connections: 3 }
        },
        {
          id: '2',
          type: 'location_added',
          title: 'Lieu d\'intérêt ajouté',
          description: 'Château de Fontainebleau identifié comme point clé',
          user_name: 'Expert Historique',
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          metadata: { verified: true }
        },
        {
          id: '3',
          type: 'user_discovery',
          title: 'Preuve photographique',
          description: 'Nouveau symbole découvert dans les archives nationales',
          user_name: 'Chercheur_Paris',
          timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
          metadata: { evidence_type: 'photo' }
        }
      ];

      // Ajouter les vraies analyses IA
      if (aiData) {
        aiData.forEach((investigation, index) => {
          const result = investigation.result_content as any;
          mockActivities.unshift({
            id: `ai_${investigation.id}`,
            type: 'ai_analysis',
            title: 'Analyse IA complète',
            description: result?.investigation?.summary || 'Nouvelle analyse terminée',
            timestamp: investigation.created_at,
            metadata: { 
              investigation_id: investigation.id,
              connections: result?.investigation?.historical_connections?.length || 0
            }
          });
        });
      }

      setActivities(mockActivities);

      // Générer des prochaines étapes basées sur l'analyse IA
      const mockNextSteps: NextStep[] = [
        {
          id: '1',
          type: 'investigate_location',
          title: 'Explorer Fontainebleau',
          description: 'Rechercher des symboles dans les appartements de François Ier',
          priority: 'high',
          estimated_time: '2-3 heures'
        },
        {
          id: '2',
          type: 'analyze_connection',
          title: 'Approfondir la piste Napoléon',
          description: 'Analyser les liens entre les époques François Ier et Napoléon',
          priority: 'medium',
          estimated_time: '1 heure'
        },
        {
          id: '3',
          type: 'verify_evidence',
          title: 'Vérifier les sources',
          description: 'Confirmer l\'authenticité des documents découverts',
          priority: 'medium',
          estimated_time: '30 minutes'
        }
      ];

      setNextSteps(mockNextSteps);

      // Simuler des connexions IA
      setAiConnections([
        {
          id: '1',
          from: 'François Ier',
          to: 'Salamandre Royale',
          strength: 0.92,
          type: 'symbole_personnel'
        },
        {
          id: '2',
          from: 'Château de Fontainebleau',
          to: 'Bureau de Napoléon',
          strength: 0.78,
          type: 'lieu_historique'
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement données enrichies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'ai_analysis': return <Brain className="w-4 h-4 text-indigo-600" />;
      case 'user_discovery': return <Search className="w-4 h-4 text-green-600" />;
      case 'new_clue': return <Lightbulb className="w-4 h-4 text-amber-600" />;
      case 'location_added': return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'discussion': return <MessageCircle className="w-4 h-4 text-purple-600" />;
      case 'evidence': return <Camera className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: NextStep['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}j`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Chargement du feed d'activité...</p>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardContent className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Feed d'activité principal */}
      <div className="lg:col-span-2 space-y-6">
        {/* Activité récente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Activité en Temps Réel
              <Badge variant="secondary" className="ml-auto">
                {activities.length} événements
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="p-2 rounded-lg bg-slate-100">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-sm text-slate-800">
                        {activity.title}
                      </h4>
                      {activity.metadata?.confidence && (
                        <Badge variant="outline" className="text-xs">
                          {activity.metadata.confidence}% fiable
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                      {activity.user_name && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.user_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Connexions IA détectées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Connexions Détectées par l'IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {aiConnections.map((connection) => (
                <div key={connection.id} className="p-3 rounded-lg border border-indigo-100 bg-indigo-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-slate-800">
                      {connection.from} ↔ {connection.to}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(connection.strength * 100)}% conf.
                    </Badge>
                  </div>
                  <div className="text-xs text-slate-600 capitalize mb-2">
                    Type: {connection.type.replace('_', ' ')}
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5">
                    <div 
                      className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${connection.strength * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau latéral */}
      <div className="space-y-6">
        {/* Widget Insights IA */}
        <AIInsightsWidget questId={questId} compact={true} />

        {/* Prochaines étapes suggérées */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-green-600" />
              Prochaines Étapes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {nextSteps.map((step) => (
                <div key={step.id} className="p-3 rounded-lg border border-slate-100">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-sm text-slate-800">
                      {step.title}
                    </h4>
                    <Badge className={getPriorityColor(step.priority)}>
                      {step.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    {step.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      ⏱️ {step.estimated_time}
                    </span>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                      Commencer
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedLiveActivityFeed;