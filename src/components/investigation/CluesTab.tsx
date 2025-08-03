import React from 'react';
import { TreasureQuest } from '@/types/quests';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Lock, CheckCircle, Search, Lightbulb } from 'lucide-react';

interface CluesTabProps {
  quest: TreasureQuest;
}

const CluesTab: React.FC<CluesTabProps> = ({ quest }) => {
  const clues = quest.clues || [];

  const getClueStatus = (clueIndex: number) => {
    // Pour l'instant, simulons quelques statuts
    if (clueIndex === 0) return 'completed';
    if (clueIndex === 1) return 'available';
    return 'locked';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'available':
        return <Search className="h-5 w-5 text-blue-600" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return <Search className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Résolu</Badge>;
      case 'available':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Disponible</Badge>;
      case 'locked':
        return <Badge variant="secondary">Verrouillé</Badge>;
      default:
        return <Badge variant="secondary">Inconnu</Badge>;
    }
  };

  if (clues.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun indice disponible pour cette quête</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Indices de la Quête</h3>
          <p className="text-sm text-muted-foreground">
            {clues.length} indice{clues.length > 1 ? 's' : ''} au total
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">
            {clues.filter((_, i) => getClueStatus(i) === 'completed').length} Résolus
          </Badge>
          <Badge variant="outline">
            {clues.filter((_, i) => getClueStatus(i) === 'available').length} Disponibles
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {clues.map((clue, index) => {
          const status = getClueStatus(index);
          const isLocked = status === 'locked';

          return (
            <Card key={clue.id} className={`transition-all ${isLocked ? 'opacity-60' : 'hover:shadow-md'}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(status)}
                    <div>
                      <CardTitle className="text-base">
                        {isLocked ? `Indice ${index + 1}` : clue.title}
                      </CardTitle>
                      <CardDescription>
                        Type de validation: {clue.validation_type}
                      </CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {!isLocked && (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {clue.description}
                      </p>
                    </div>

                    {clue.hint && (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                              Indice
                            </h4>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                              {clue.hint}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {clue.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>
                          Zone géographique: {clue.location.latitude.toFixed(4)}, {clue.location.longitude.toFixed(4)}
                          {clue.location.radius && ` (Rayon: ${clue.location.radius}m)`}
                        </span>
                      </div>
                    )}

                    {clue.symbol_reference && (
                      <div className="text-sm text-muted-foreground">
                        <strong>Référence symbolique:</strong> {clue.symbol_reference}
                      </div>
                    )}

                    {clue.unlock_condition && isLocked && (
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <p className="text-sm">
                          <strong>Condition de déverrouillage:</strong> {clue.unlock_condition}
                        </p>
                      </div>
                    )}
                  </>
                )}

                {isLocked && (
                  <div className="text-center py-4 text-muted-foreground">
                    <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Cet indice sera déverrouillé une fois les indices précédents résolus</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CluesTab;