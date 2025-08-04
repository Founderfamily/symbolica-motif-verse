import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Crown, Star, TrendingUp } from 'lucide-react';
import { aiDataExtractionService, AIHistoricalFigure } from '@/services/AIDataExtractionService';

interface HistoricalFiguresWidgetProps {
  questId: string;
  compact?: boolean;
}

const HistoricalFiguresWidget: React.FC<HistoricalFiguresWidgetProps> = ({ 
  questId, 
  compact = false 
}) => {
  const [figures, setFigures] = useState<AIHistoricalFigure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistoricalFigures();
  }, [questId]);

  const loadHistoricalFigures = async () => {
    try {
      setLoading(true);
      const data = await aiDataExtractionService.getHistoricalFigures(questId);
      setFigures(data.slice(0, compact ? 3 : 10));
    } catch (error) {
      console.error('Erreur lors du chargement des personnages historiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleKey = role.toLowerCase();
    if (roleKey.includes('roi') || roleKey.includes('empereur')) return Crown;
    if (roleKey.includes('cardinal') || roleKey.includes('ministre')) return Star;
    return User;
  };

  const getRoleColor = (role: string) => {
    const roleKey = role.toLowerCase();
    if (roleKey.includes('roi') || roleKey.includes('empereur')) return 'bg-yellow-500/10 text-yellow-700';
    if (roleKey.includes('cardinal') || roleKey.includes('ministre')) return 'bg-purple-500/10 text-purple-700';
    return 'bg-blue-500/10 text-blue-700';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Personnages Historiques
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

  if (figures.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Personnages Historiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucun personnage historique identifié</p>
            <p className="text-sm">L'IA analysera les prochaines découvertes</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5" />
          Personnages Historiques
          <Badge variant="secondary" className="ml-auto">
            {figures.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {figures.map((figure) => {
          const RoleIcon = getRoleIcon(figure.role);
          
          return (
            <div key={figure.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
              <Avatar className="h-10 w-10">
                <AvatarFallback className={getRoleColor(figure.role)}>
                  {getInitials(figure.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm truncate">{figure.name}</p>
                  <RoleIcon className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {figure.period}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {figure.role}
                  </Badge>
                </div>
                {!compact && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Pertinence: {Math.round(figure.relevance * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {compact && figures.length > 3 && (
          <div className="text-center pt-2">
            <Badge variant="outline" className="text-xs">
              +{figures.length - 3} autres personnages
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoricalFiguresWidget;