import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MCPService } from '@/services/mcpService';

interface TreasureProbabilityWidgetProps {
  questId: string;
  sources: Array<{
    type: 'documentary' | 'field' | 'community';
    content: string;
    confidence: number;
    verified: boolean;
  }>;
  clues: Array<{
    id: string;
    content: string;
    votes: { true: number; false: number };
    validation_score: number;
  }>;
  onProbabilityChange?: (probability: number) => void;
}

const TreasureProbabilityWidget: React.FC<TreasureProbabilityWidgetProps> = ({
  questId,
  sources,
  clues,
  onProbabilityChange
}) => {
  const [probability, setProbability] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [aiInsight, setAiInsight] = useState<string>('');

  const calculateProbability = async () => {
    setLoading(true);
    try {
      // Calcul basé sur les sources
      const documentaryWeight = sources.filter(s => s.type === 'documentary' && s.verified).length * 15;
      const fieldWeight = sources.filter(s => s.type === 'field' && s.verified).length * 20;
      const communityWeight = sources.filter(s => s.type === 'community' && s.verified).length * 10;
      
      // Calcul basé sur les votes des indices
      const clueValidationScore = clues.reduce((acc, clue) => {
        const totalVotes = clue.votes.true + clue.votes.false;
        if (totalVotes === 0) return acc;
        const confidence = (clue.votes.true / totalVotes) * 100;
        return acc + (confidence * 0.3); // Chaque indice validé contribue jusqu'à 30%
      }, 0);

      let baseProbability = Math.min(documentaryWeight + fieldWeight + communityWeight + clueValidationScore, 100);

      // Demander à l'IA d'analyser le contexte global
      const questContext = `Sources: ${sources.length}, Indices validés: ${clues.filter(c => c.validation_score > 70).length}`;
      const aiResponse = await MCPService.search(
        `Analyse la probabilité de découverte d'un trésor avec ces données: ${questContext}. Probabilité calculée: ${baseProbability}%`,
        'deepseek'
      );

      if (aiResponse.success && aiResponse.content) {
        // Extraire un ajustement de probabilité de la réponse IA
        const adjustmentMatch = aiResponse.content.match(/(\+|\-)?(\d{1,2})%/);
        if (adjustmentMatch) {
          const adjustment = parseInt(adjustmentMatch[2]) * (adjustmentMatch[1] === '-' ? -1 : 1);
          baseProbability = Math.max(0, Math.min(100, baseProbability + adjustment));
        }
        setAiInsight(aiResponse.content.slice(0, 200) + '...');
      }

      setProbability(baseProbability);
      setLastUpdate(new Date());
      onProbabilityChange?.(baseProbability);
    } catch (error) {
      console.error('Erreur calcul probabilité:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateProbability();
  }, [sources, clues]);

  const getProbabilityColor = () => {
    if (probability < 20) return 'text-red-600 bg-red-50 border-red-200';
    if (probability < 50) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (probability < 80) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProbabilityIcon = () => {
    if (probability < 20) return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (probability < 80) return <TrendingUp className="w-5 h-5 text-orange-500" />;
    return <CheckCircle className="w-5 h-5 text-green-500" />;
  };

  const getStatusText = () => {
    if (probability < 20) return 'Risque de faux trésor';
    if (probability < 50) return 'Probabilité faible';
    if (probability < 80) return 'Probabilité modérée';
    return 'Probabilité élevée';
  };

  return (
    <Card className={`border-2 ${getProbabilityColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="w-5 h-5" />
            Probabilité de Découverte
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={calculateProbability}
            disabled={loading}
            className="h-8 w-8 p-0"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            {getProbabilityIcon()}
            <span className="text-3xl font-bold">{probability}%</span>
          </div>
          <Badge variant="outline" className={getProbabilityColor()}>
            {getStatusText()}
          </Badge>
        </div>

        <Progress value={probability} className="h-3" />

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="font-semibold text-blue-600">
              {sources.filter(s => s.type === 'documentary').length}
            </div>
            <div className="text-xs text-muted-foreground">📚 Sources doc.</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-green-600">
              {sources.filter(s => s.type === 'field').length}
            </div>
            <div className="text-xs text-muted-foreground">📍 Terrain</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-purple-600">
              {sources.filter(s => s.type === 'community').length}
            </div>
            <div className="text-xs text-muted-foreground">🤝 Communauté</div>
          </div>
        </div>

        {aiInsight && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs font-medium text-blue-600 mb-1">Analyse IA</div>
                <p className="text-xs text-muted-foreground">{aiInsight}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          Dernière MAJ: {lastUpdate.toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default TreasureProbabilityWidget;