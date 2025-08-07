import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';

interface ProbabilityFactor {
  name: string;
  score: number;
  change: number;
}

interface TreasureProbabilityWidgetProps {
  questId: string;
  currentProbability: number;
  lastUpdate: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  factors: ProbabilityFactor[];
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

const TreasureProbabilityWidget: React.FC<TreasureProbabilityWidgetProps> = ({
  questId,
  currentProbability,
  lastUpdate,
  trend,
  factors,
  onAnalyze,
  isAnalyzing = false
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'decreasing': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getProbabilityColor = () => {
    if (currentProbability >= 80) return 'text-green-600';
    if (currentProbability >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            Probabilité de découverte
            {getTrendIcon()}
          </CardTitle>
          <Button 
            onClick={onAnalyze}
            disabled={isAnalyzing}
            size="sm"
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isAnalyzing ? 'Analyse...' : 'Analyser IA'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${getProbabilityColor()}`}>
              {currentProbability}%
            </span>
            <Badge variant="outline">{lastUpdate}</Badge>
          </div>
          
          <Progress value={currentProbability} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4">
            {factors.map((factor, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{factor.name}</span>
                  <div className="flex items-center gap-1">
                    <span>{factor.score}%</span>
                    <span className={`text-xs ${factor.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {factor.change >= 0 ? '+' : ''}{factor.change}
                    </span>
                  </div>
                </div>
                <Progress value={factor.score} className="h-1" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TreasureProbabilityWidget;