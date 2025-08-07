import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, MessageCircle, User, Archive, Search, Lightbulb } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface JournalEntry {
  id: string;
  timestamp: string;
  type: 'carte' | 'indice' | 'discussion' | 'source' | 'personnage' | 'archive' | 'decouverte';
  title: string;
  description: string;
  relatedTabData?: any;
  probability_impact?: number;
}

interface ChronologicalJournalProps {
  quest: TreasureQuest;
  onNavigateToTab: (tab: string, data?: any) => void;
  currentProbability: number;
}

const ChronologicalJournal: React.FC<ChronologicalJournalProps> = ({
  quest,
  onNavigateToTab,
  currentProbability
}) => {
  // Mock journal entries - À remplacer par des vraies données
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15T09:00:00Z',
      type: 'carte',
      title: 'Début de l\'investigation',
      description: 'Analyse de la carte initiale révélant 3 zones d\'intérêt principales.',
      probability_impact: 15
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'source',
      title: 'Document d\'archive découvert',
      description: 'Manuscrit du XVIe siècle mentionnant un trésor enfoui près de la rivière.',
      relatedTabData: { sourceId: 'doc_1536_river' },
      probability_impact: 25
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:20:00Z',
      type: 'indice',
      title: 'Validation de l\'indice #3',
      description: 'Symbole gravé confirmé par la communauté (score: 89/100).',
      relatedTabData: { clueId: 3 },
      probability_impact: 30
    },
    {
      id: '4',
      timestamp: '2024-01-16T08:45:00Z',
      type: 'discussion',
      title: 'Théorie collaborative émergente',
      description: 'Discussion avec @historian_expert sur la signification des symboles.',
      relatedTabData: { chatId: 'conv_historian' },
      probability_impact: 15
    },
    {
      id: '5',
      timestamp: '2024-01-16T16:30:00Z',
      type: 'personnage',
      title: 'Connexion historique établie',
      description: 'Lien confirmé avec Jean de Montclar, alchimiste local du XVIe siècle.',
      relatedTabData: { figureId: 'montclar_jean' },
      probability_impact: 20
    }
  ];

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'carte': return <MapPin className="h-4 w-4" />;
      case 'indice': return <Lightbulb className="h-4 w-4" />;
      case 'discussion': return <MessageCircle className="h-4 w-4" />;
      case 'source': return <Search className="h-4 w-4" />;
      case 'personnage': return <User className="h-4 w-4" />;
      case 'archive': return <Archive className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getEntryBadgeVariant = (type: string) => {
    switch (type) {
      case 'carte': return 'default';
      case 'indice': return 'secondary';
      case 'discussion': return 'outline';
      case 'source': return 'destructive';
      case 'personnage': return 'secondary';
      case 'archive': return 'outline';
      default: return 'default';
    }
  };

  const getTargetTab = (type: string) => {
    switch (type) {
      case 'carte': return 'map';
      case 'indice': return 'clues';
      case 'discussion': return 'chat';
      case 'source': return 'investigation';
      case 'personnage': return 'personnages';
      case 'archive': return 'archives';
      default: return 'journal';
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const probabilityLabel = () => {
    if (currentProbability < 20) return { text: "Fausse piste probable", color: "text-destructive" };
    if (currentProbability < 50) return { text: "Investigation en cours", color: "text-muted-foreground" };
    if (currentProbability < 80) return { text: "Piste prometteuse", color: "text-warning" };
    return { text: "Action terrain recommandée", color: "text-green-600" };
  };

  return (
    <div className="space-y-6">
      {/* Probabilité globale */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Probabilité de découverte</CardTitle>
            <Badge variant="outline" className={probabilityLabel().color}>
              {currentProbability}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={currentProbability} className="h-3 mb-2" />
          <p className={`text-sm ${probabilityLabel().color}`}>
            {probabilityLabel().text}
          </p>
        </CardContent>
      </Card>

      {/* Journal chronologique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Journal d'investigation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chronologie des découvertes et analyses de cette quête
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {journalEntries
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    {getEntryIcon(entry.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={getEntryBadgeVariant(entry.type)} className="text-xs">
                        {entry.type.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.timestamp)}
                      </span>
                      {entry.probability_impact && (
                        <Badge variant="outline" className="text-xs">
                          +{entry.probability_impact}%
                        </Badge>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm">{entry.title}</h4>
                      <p className="text-sm text-muted-foreground">{entry.description}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigateToTab(getTargetTab(entry.type), entry.relatedTabData)}
                      className="h-8 text-xs"
                    >
                      Voir détails →
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Résumé et prochaines étapes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prochaines étapes recommandées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentProbability < 50 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Search className="h-4 w-4" />
                <span className="text-sm">Rechercher plus de sources documentaires</span>
              </div>
            )}
            {currentProbability >= 50 && currentProbability < 80 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">Valider les hypothèses avec la communauté</span>
              </div>
            )}
            {currentProbability >= 80 && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950">
                <MapPin className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Préparer l'expédition terrain</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChronologicalJournal;