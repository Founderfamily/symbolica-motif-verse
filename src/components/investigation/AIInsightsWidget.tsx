import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Clock, 
  ArrowRight,
  Sparkles,
  MapPin,
  Users,
  FileText,
  Eye,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AIInsight {
  id: string;
  type: 'connection' | 'location' | 'pattern' | 'historical' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  created_at: string;
  metadata?: any;
}

interface AIInsightsWidgetProps {
  questId: string;
  compact?: boolean;
}

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({ questId, compact = false }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAIInsights();
  }, [questId]);

  const loadAIInsights = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_investigations')
        .select('*')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(compact ? 3 : 6);

      if (error) throw error;

      // Transformer les données en insights structurés
      const transformedInsights: AIInsight[] = data?.map(investigation => {
        const result = investigation.result_content as any;
        
        // Structure if-else-if pour éviter les doublons
        if (result?.investigation) {
          // Extraire les preuves utilisées pour un titre plus informatif
          const evidenceUsed = result?.evidence_used || [];
          const evidenceCount = evidenceUsed.length;
          
          let title = 'Investigation IA';
          let description = result.investigation;
          
          if (evidenceCount > 0) {
            title = `${evidenceCount} preuve${evidenceCount > 1 ? 's' : ''} analysée${evidenceCount > 1 ? 's' : ''}`;
            const evidenceNames = evidenceUsed.slice(0, 3).map((e: any) => e.name || e.title || e).join(', ');
            description = `${evidenceNames}${evidenceCount > 3 ? '...' : ''} - ${result.investigation.substring(0, 100)}${result.investigation.length > 100 ? '...' : ''}`;
          }
          
          return {
            id: investigation.id,
            type: 'pattern',
            title,
            description,
            confidence: 90,
            created_at: investigation.created_at,
            metadata: result
          };
        } else if (result?.historical_connections?.[0]) {
          // Connexions historiques
          const connection = result.historical_connections[0];
          return {
            id: investigation.id,
            type: 'historical',
            title: `Connexion ${connection.period || 'historique'}`,
            description: `${connection.figure}: ${connection.connection}`,
            confidence: 85,
            created_at: investigation.created_at,
            metadata: result
          };
        } else {
          // Fallback
          return {
            id: investigation.id,
            type: 'suggestion',
            title: 'Analyse IA',
            description: 'Nouvelle analyse disponible',
            confidence: 75,
            created_at: investigation.created_at,
            metadata: result
          };
        }
      }) || [];

      // Déduplication par ID pour éviter les doublons
      const uniqueInsights = transformedInsights.filter((insight, index, self) => 
        index === self.findIndex(i => i.id === insight.id)
      );

      setInsights(uniqueInsights);
    } catch (error) {
      console.error('Erreur chargement insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'connection': return <Users className="w-4 h-4" />;
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'historical': return <FileText className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'connection': return 'bg-blue-100 text-blue-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'pattern': return 'bg-purple-100 text-purple-800';
      case 'historical': return 'bg-amber-100 text-amber-800';
      case 'suggestion': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}j`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Chargement des insights IA...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-indigo-600" />
          Insights IA
          {insights.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {insights.length} nouveau{insights.length > 1 ? 'x' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-6">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Aucun insight IA disponible</p>
            <p className="text-xs text-muted-foreground mt-1">
              Lancez une analyse IA pour découvrir des connexions
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-1.5 rounded-lg ${getInsightColor(insight.type)}`}>
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-slate-800 mb-1 truncate">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {insight.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-slate-500">{insight.confidence}% conf.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-500">
                            {formatTimeAgo(insight.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!compact && (
                    <Button size="sm" variant="ghost" className="p-1">
                      <Eye className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {!compact && insights.length > 3 && (
              <Button variant="outline" size="sm" className="w-full mt-3">
                Voir tous les insights
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIInsightsWidget;