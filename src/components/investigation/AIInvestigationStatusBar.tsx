import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Search, 
  Brain, 
  Archive, 
  Lightbulb, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface AIInvestigationStatusBarProps {
  isInvestigating: boolean;
  isSearchingSources: boolean;
  isGeneratingTheories: boolean;
  lastInvestigationTime?: string;
  investigationProgress?: number;
}

export const AIInvestigationStatusBar: React.FC<AIInvestigationStatusBarProps> = ({
  isInvestigating,
  isSearchingSources,
  isGeneratingTheories,
  lastInvestigationTime,
  investigationProgress = 0
}) => {
  const getStatusIcon = () => {
    if (isInvestigating) return <Bot className="h-4 w-4 animate-pulse text-primary" />;
    if (isSearchingSources) return <Archive className="h-4 w-4 animate-spin text-blue-500" />;
    if (isGeneratingTheories) return <Brain className="h-4 w-4 animate-pulse text-purple-500" />;
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (isInvestigating) return "Investigation IA en cours...";
    if (isSearchingSources) return "Fouille dans les archives historiques...";
    if (isGeneratingTheories) return "Génération de nouvelles théories...";
    return "IA en veille - Prête à investiguer";
  };

  const getStatusBadge = () => {
    if (isInvestigating || isSearchingSources || isGeneratingTheories) {
      return <Badge variant="default" className="animate-pulse">🔍 Actif</Badge>;
    }
    return <Badge variant="secondary">💤 En veille</Badge>;
  };

  const isActive = isInvestigating || isSearchingSources || isGeneratingTheories;

  return (
    <Card className="p-4 border-l-4 border-l-primary">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <p className="font-medium text-sm">{getStatusText()}</p>
            {lastInvestigationTime && !isActive && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Dernière investigation: {lastInvestigationTime}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
        </div>
      </div>
      
      {isActive && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progression</span>
            <span>{investigationProgress}%</span>
          </div>
          <Progress value={investigationProgress} className="h-2" />
        </div>
      )}
      
      {isInvestigating && (
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3 w-3" />
            Recherche dans 156 sources historiques...
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Brain className="h-3 w-3" />
            Analyse des patterns temporels et géographiques...
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lightbulb className="h-3 w-3" />
            Génération de nouvelles hypothèses...
          </div>
        </div>
      )}
    </Card>
  );
};