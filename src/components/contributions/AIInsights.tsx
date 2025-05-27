
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Lightbulb, TrendingUp, Search, Star, AlertTriangle } from 'lucide-react';
import { CompleteContribution } from '@/types/contributions';

interface AIInsight {
  id: string;
  type: 'quality' | 'similarity' | 'trend' | 'suggestion' | 'warning';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  data?: any;
}

interface AIInsightsProps {
  contributions: CompleteContribution[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ contributions }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI analysis
    const generateInsights = () => {
      setLoading(true);
      
      // Simulate processing time
      setTimeout(() => {
        const mockInsights: AIInsight[] = [
          {
            id: '1',
            type: 'quality',
            title: 'Score de qualité moyen élevé',
            description: 'Vos contributions récentes montrent une qualité exceptionnelle avec des descriptions détaillées et des sources fiables.',
            confidence: 92,
            actionable: false,
            data: { averageScore: 4.2, improvement: '+15%' }
          },
          {
            id: '2',
            type: 'similarity',
            title: 'Symboles similaires détectés',
            description: '3 de vos contributions présentent des motifs similaires. Considérez les regrouper dans une collection thématique.',
            confidence: 87,
            actionable: true,
            data: { similarContributions: ['sym1', 'sym2', 'sym3'] }
          },
          {
            id: '3',
            type: 'trend',
            title: 'Tendance culturelle émergente',
            description: 'Les symboles de la culture nordique gagnent en popularité (+45% ce mois). Vos contributions dans ce domaine sont bien positionnées.',
            confidence: 78,
            actionable: true,
            data: { trendGrowth: 45, category: 'Nordic symbols' }
          },
          {
            id: '4',
            type: 'suggestion',
            title: 'Opportunité de diversification',
            description: 'Explorez les cultures d\'Asie du Sud-Est - un domaine sous-représenté avec un fort potentiel d\'impact.',
            confidence: 83,
            actionable: true,
            data: { suggestedCategories: ['Thai symbols', 'Vietnamese patterns'] }
          },
          {
            id: '5',
            type: 'warning',
            title: 'Attention aux doublons',
            description: 'Votre dernière soumission ressemble fortement à une contribution existante. Vérifiez les similarités.',
            confidence: 91,
            actionable: true,
            data: { similarContribution: 'existing-symbol-123' }
          }
        ];

        setInsights(mockInsights);
        setLoading(false);
      }, 2000);
    };

    if (contributions.length > 0) {
      generateInsights();
    } else {
      setLoading(false);
    }
  }, [contributions]);

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'quality':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'similarity':
        return <Search className="h-5 w-5 text-blue-600" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'suggestion':
        return <Lightbulb className="h-5 w-5 text-purple-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'quality':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'similarity':
        return 'border-l-blue-500 bg-blue-50';
      case 'trend':
        return 'border-l-green-500 bg-green-50';
      case 'suggestion':
        return 'border-l-purple-500 bg-purple-50';
      case 'warning':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Analyse IA en cours...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={75} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Analyse des patterns, tendances et opportunités d'amélioration...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (contributions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">Aucune donnée à analyser</h3>
            <p className="text-muted-foreground">
              Soumettez des contributions pour obtenir des insights personnalisés
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Insights IA personnalisés
            <Badge variant="secondary" className="ml-2">
              {insights.length} insights
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Analyse basée sur {contributions.length} contributions et les tendances de la plateforme
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Performance globale</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">Excellente</p>
              <p className="text-xs text-gray-600">+23% par rapport au mois dernier</p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Taux d'approbation</span>
              </div>
              <p className="text-2xl font-bold text-green-600">94%</p>
              <p className="text-xs text-gray-600">Au-dessus de la moyenne</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {insights.map(insight => (
          <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{insight.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      <span className={getConfidenceColor(insight.confidence)}>
                        {insight.confidence}% confiance
                      </span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">
                    {insight.description}
                  </p>

                  {insight.data && (
                    <div className="text-xs text-gray-600 mb-3">
                      {insight.type === 'quality' && (
                        <span>Score moyen: {insight.data.averageScore}/5 ({insight.data.improvement})</span>
                      )}
                      {insight.type === 'trend' && (
                        <span>Croissance: +{insight.data.trendGrowth}% dans la catégorie {insight.data.category}</span>
                      )}
                    </div>
                  )}

                  {insight.actionable && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        {insight.type === 'similarity' && 'Voir les similitudes'}
                        {insight.type === 'trend' && 'Explorer la tendance'}
                        {insight.type === 'suggestion' && 'Voir les suggestions'}
                        {insight.type === 'warning' && 'Vérifier maintenant'}
                      </Button>
                      <Button size="sm" variant="ghost">
                        Ignorer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour améliorer vos contributions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Ajoutez plus de contexte historique à vos descriptions</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Incluez des références bibliographiques pour augmenter la crédibilité</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Lightbulb className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Utilisez des tags plus spécifiques pour améliorer la découvrabilité</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
