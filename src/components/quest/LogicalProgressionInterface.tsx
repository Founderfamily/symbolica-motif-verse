import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Target, 
  Star,
  History,
  Users,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface ClueNode {
  id: string;
  title: string;
  description: string;
  status: 'locked' | 'available' | 'completed';
  dependencies: string[];
  unlocks: string[];
  discoveredBy?: string;
  discoveredAt?: Date;
  validation_score: number;
  required_for_map: boolean;
}

interface LogicalProgressionInterfaceProps {
  clues: ClueNode[];
  questProgress: {
    totalClues: number;
    completedClues: number;
    mapUnlocked: boolean;
    finalStageUnlocked: boolean;
  };
  onClueActivate: (clueId: string) => void;
  onMapAccess: () => void;
  onFinalStage: () => void;
}

const LogicalProgressionInterface: React.FC<LogicalProgressionInterfaceProps> = ({
  clues,
  questProgress,
  onClueActivate,
  onMapAccess,
  onFinalStage
}) => {
  const [selectedClue, setSelectedClue] = useState<ClueNode | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const getClueProgress = () => {
    return Math.round((questProgress.completedClues / questProgress.totalClues) * 100);
  };

  const getAvailableClues = () => {
    return clues.filter(clue => clue.status === 'available');
  };

  const getNextClues = (completedClueId: string) => {
    const clue = clues.find(c => c.id === completedClueId);
    if (!clue) return [];
    return clues.filter(c => c.dependencies.includes(completedClueId));
  };

  const canAccessMap = () => {
    const requiredClues = clues.filter(c => c.required_for_map);
    const completedRequired = requiredClues.filter(c => c.status === 'completed');
    return completedRequired.length >= Math.ceil(requiredClues.length * 0.7); // 70% des indices requis
  };

  const getMapAccessThreshold = () => {
    const requiredClues = clues.filter(c => c.required_for_map);
    const completedRequired = requiredClues.filter(c => c.status === 'completed');
    const needed = Math.ceil(requiredClues.length * 0.7);
    return {
      current: completedRequired.length,
      needed,
      percentage: Math.round((completedRequired.length / needed) * 100)
    };
  };

  const renderClueTree = () => {
    // Organiser les indices par niveaux de dépendance
    const levels: ClueNode[][] = [];
    const processedClues = new Set<string>();
    
    // Niveau 0: indices sans dépendances
    levels[0] = clues.filter(clue => clue.dependencies.length === 0);
    levels[0].forEach(clue => processedClues.add(clue.id));
    
    // Niveaux suivants
    let currentLevel = 0;
    while (processedClues.size < clues.length && currentLevel < 10) {
      currentLevel++;
      levels[currentLevel] = clues.filter(clue => 
        !processedClues.has(clue.id) && 
        clue.dependencies.every(dep => processedClues.has(dep))
      );
      levels[currentLevel].forEach(clue => processedClues.add(clue.id));
    }

    return levels.filter(level => level.length > 0);
  };

  const getClueStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'available': return <Unlock className="w-5 h-5 text-amber-500" />;
      case 'locked': return <Lock className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getClueStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-200 bg-green-50';
      case 'available': return 'border-amber-200 bg-amber-50';
      case 'locked': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const mapThreshold = getMapAccessThreshold();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Progression Logique
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowTimeline(true)}
            >
              <History className="w-4 h-4 mr-1" />
              Chronologie
            </Button>
            <Badge variant="outline">
              {questProgress.completedClues}/{questProgress.totalClues} indices
            </Badge>
          </div>
        </div>
        <Progress value={getClueProgress()} className="h-3" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seuil d'accès à la carte */}
        <Card className={`border-2 ${canAccessMap() ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'}`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className={`w-6 h-6 ${canAccessMap() ? 'text-green-600' : 'text-amber-600'}`} />
                <div>
                  <h4 className="font-medium">Accès à la Carte Interactive</h4>
                  <p className="text-sm text-muted-foreground">
                    {mapThreshold.current}/{mapThreshold.needed} indices requis validés
                  </p>
                </div>
              </div>
              <div className="text-right">
                {canAccessMap() ? (
                  <Button onClick={onMapAccess} className="bg-green-600 hover:bg-green-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Accéder à la carte
                  </Button>
                ) : (
                  <div>
                    <Progress value={mapThreshold.percentage} className="w-24 h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{mapThreshold.percentage}%</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Arbre de dépendances */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Arbre de progression</h4>
          {renderClueTree().map((level, levelIndex) => (
            <div key={levelIndex} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Niveau {levelIndex + 1}
                </Badge>
                {levelIndex > 0 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {level.map((clue) => (
                  <Dialog key={clue.id}>
                    <DialogTrigger asChild>
                      <div 
                        className={`p-3 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${getClueStatusColor(clue.status)}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getClueStatusIcon(clue.status)}
                            <h5 className="font-medium text-sm">{clue.title}</h5>
                          </div>
                          {clue.required_for_map && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              Carte
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {clue.description}
                        </p>
                        {clue.discoveredBy && clue.discoveredAt && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            {clue.discoveredBy} - {clue.discoveredAt.toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-xs">
                            Score: {clue.validation_score}%
                          </Badge>
                          {clue.status === 'available' && (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                onClueActivate(clue.id);
                              }}
                            >
                              Activer
                            </Button>
                          )}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {getClueStatusIcon(clue.status)}
                          {clue.title}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p>{clue.description}</p>
                        
                        {clue.dependencies.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Dépendances:</h4>
                            <div className="space-y-1">
                              {clue.dependencies.map(depId => {
                                const depClue = clues.find(c => c.id === depId);
                                return depClue ? (
                                  <div key={depId} className="flex items-center gap-2 text-sm">
                                    {getClueStatusIcon(depClue.status)}
                                    {depClue.title}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {clue.unlocks.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Débloque:</h4>
                            <div className="space-y-1">
                              {clue.unlocks.map(unlockId => {
                                const unlockClue = clues.find(c => c.id === unlockId);
                                return unlockClue ? (
                                  <div key={unlockId} className="flex items-center gap-2 text-sm">
                                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                    {unlockClue.title}
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {clue.status === 'available' && (
                          <Button 
                            onClick={() => onClueActivate(clue.id)}
                            className="w-full"
                          >
                            Commencer cet indice
                          </Button>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Alertes intelligentes */}
        {getAvailableClues().length > 0 && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <div>
                  <h4 className="font-medium text-amber-800">
                    {getAvailableClues().length} indice{getAvailableClues().length > 1 ? 's' : ''} disponible{getAvailableClues().length > 1 ? 's' : ''}
                  </h4>
                  <p className="text-sm text-amber-700">
                    Vous pouvez progresser dans votre enquête
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chronologie des découvertes */}
        <Dialog open={showTimeline} onOpenChange={setShowTimeline}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Chronologie des découvertes</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {clues
                .filter(clue => clue.discoveredAt)
                .sort((a, b) => (b.discoveredAt!.getTime() - a.discoveredAt!.getTime()))
                .map((clue) => (
                  <div key={clue.id} className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="text-center min-w-0">
                      <div className="text-xs text-muted-foreground">
                        {clue.discoveredAt!.toLocaleDateString()}
                      </div>
                      <div className="text-xs font-medium">
                        {clue.discoveredAt!.toLocaleTimeString()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{clue.title}</div>
                      <div className="text-sm text-muted-foreground">
                        Découvert par {clue.discoveredBy}
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-amber-500" />
                  </div>
                ))}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LogicalProgressionInterface;