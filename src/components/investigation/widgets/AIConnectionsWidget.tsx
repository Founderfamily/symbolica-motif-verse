import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, ArrowRight, TrendingUp, Zap } from 'lucide-react';
import { aiDataExtractionService, AIConnection } from '@/services/AIDataExtractionService';

interface AIConnectionsWidgetProps {
  questId: string;
  compact?: boolean;
}

const AIConnectionsWidget: React.FC<AIConnectionsWidgetProps> = ({ 
  questId, 
  compact = false 
}) => {
  const [connections, setConnections] = useState<AIConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAIConnections();
  }, [questId]);

  const loadAIConnections = async () => {
    try {
      setLoading(true);
      const data = await aiDataExtractionService.getAIConnections(questId);
      setConnections(data.slice(0, compact ? 3 : 6));
    } catch (error) {
      console.error('Erreur lors du chargement des connexions IA:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 0.8) return 'text-green-600 bg-green-50';
    if (strength >= 0.6) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getConnectionTypeIcon = (type: string) => {
    const typeKey = type.toLowerCase();
    if (typeKey.includes('lié') || typeKey.includes('connecté')) return Network;
    if (typeKey.includes('évoque') || typeKey.includes('rappelle')) return Zap;
    return ArrowRight;
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connexions Détectées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (connections.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="h-5 w-5" />
            Connexions Détectées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune connexion détectée</p>
            <p className="text-sm">L'IA analysera les relations entre éléments</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Network className="h-5 w-5" />
          Connexions Détectées
          <Badge variant="secondary" className="ml-auto">
            {connections.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {connections.map((connection) => {
          const ConnectionIcon = getConnectionTypeIcon(connection.relationshipType);
          
          return (
            <div key={connection.id} className="p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStrengthColor(connection.strength)}`}
                >
                  {Math.round(connection.strength * 100)}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {connection.relationshipType}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-primary truncate flex-1">
                  {connection.fromEntity}
                </span>
                <ConnectionIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-secondary truncate flex-1">
                  {connection.toEntity}
                </span>
              </div>
              
              {!compact && connection.description && (
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {connection.description}
                </p>
              )}
              
              {!compact && (
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Force de la connexion: {Math.round(connection.strength * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
        
        {compact && connections.length > 3 && (
          <div className="text-center pt-2">
            <Badge variant="outline" className="text-xs">
              +{connections.length - 3} autres connexions
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIConnectionsWidget;