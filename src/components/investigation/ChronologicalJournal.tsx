import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, MessageCircle, User, Archive, Search, Lightbulb, ThumbsUp, ThumbsDown, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';

interface CommunityVote {
  user_id: string;
  username: string;
  vote_type: 'for' | 'against' | 'neutral';
  timestamp: string;
  comment?: string;
}

interface JournalEntry {
  id: string;
  timestamp: string;
  type: 'carte' | 'indice' | 'discussion' | 'source' | 'personnage' | 'archive' | 'decouverte';
  title: string;
  description: string;
  relatedTabData?: any;
  probability_impact?: number;
  community_votes?: CommunityVote[];
  consensus_score?: number;
  debate_status?: 'active' | 'consensus' | 'controversial' | 'resolved';
  total_participants?: number;
  propositions?: {
    id: string;
    content: string;
    votes_for: number;
    votes_against: number;
    author: string;
  }[];
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
  const [userVotes, setUserVotes] = useState<Record<string, 'for' | 'against'>>({});

  // Mock collaborative journal entries with community votes
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      timestamp: '2024-01-15T09:00:00Z',
      type: 'carte',
      title: 'Localisation du site principal',
      description: 'Proposition: "Zone rocheuse près du pont médiéval" vs "Clairière forestière au sud"',
      probability_impact: 15,
      consensus_score: 76,
      debate_status: 'consensus',
      total_participants: 2847,
      propositions: [
        { id: '1a', content: 'Zone rocheuse près du pont médiéval', votes_for: 2134, votes_against: 713, author: '@geologist_pro' },
        { id: '1b', content: 'Clairière forestière au sud', votes_for: 891, votes_against: 1956, author: '@forest_explorer' }
      ]
    },
    {
      id: '2',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'source',
      title: 'Authenticité du manuscrit de 1536',
      description: 'Débat sur la validité du document mentionnant "l\'or caché près des eaux vives"',
      relatedTabData: { sourceId: 'doc_1536_river' },
      probability_impact: 25,
      consensus_score: 45,
      debate_status: 'controversial',
      total_participants: 4521,
      propositions: [
        { id: '2a', content: 'Document authentique - papier et encre cohérents', votes_for: 2123, votes_against: 2398, author: '@manuscript_expert' },
        { id: '2b', content: 'Faux moderne - style d\'écriture incohérent', votes_for: 1876, votes_against: 2645, author: '@calligraphy_specialist' }
      ]
    },
    {
      id: '3',
      timestamp: '2024-01-15T14:20:00Z',
      type: 'indice',
      title: 'Interprétation du symbole gravé',
      description: 'Consensus atteint: symbole alchimique pointant vers une cache souterraine',
      relatedTabData: { clueId: 3 },
      probability_impact: 30,
      consensus_score: 89,
      debate_status: 'resolved',
      total_participants: 3256,
      propositions: [
        { id: '3a', content: 'Symbole alchimique = cache souterraine', votes_for: 2891, votes_against: 365, author: '@alchemy_historian' },
        { id: '3b', content: 'Simple marque de tailleur de pierre', votes_for: 287, votes_against: 2969, author: '@stone_mason' }
      ]
    },
    {
      id: '4',
      timestamp: '2024-01-16T08:45:00Z',
      type: 'personnage',
      title: 'Rôle de Jean de Montclar',
      description: 'DÉBAT ACTIF: Alchimiste royal ou simple marchand? Impact sur la localisation',
      relatedTabData: { figureId: 'montclar_jean' },
      probability_impact: 20,
      consensus_score: 52,
      debate_status: 'active',
      total_participants: 5834,
      propositions: [
        { id: '4a', content: 'Alchimiste royal avec accès aux coffres secrets', votes_for: 3045, votes_against: 2789, author: '@royal_historian' },
        { id: '4b', content: 'Marchand aisé sans liens avec la cour', votes_for: 2456, votes_against: 3378, author: '@trade_specialist' },
        { id: '4c', content: 'Espion utilisant l\'alchimie comme couverture', votes_for: 1567, votes_against: 4267, author: '@conspiracy_theorist' }
      ]
    },
    {
      id: '5',
      timestamp: '2024-01-16T16:30:00Z',
      type: 'discussion',
      title: 'Théorie de la double cache',
      description: 'Nouvelle hypothèse: deux trésors distincts cachés à des époques différentes',
      relatedTabData: { chatId: 'conv_historian' },
      probability_impact: 35,
      consensus_score: 67,
      debate_status: 'consensus',
      total_participants: 1923,
      propositions: [
        { id: '5a', content: 'Deux caches: une médiévale, une Renaissance', votes_for: 1287, votes_against: 636, author: '@timeline_analyst' },
        { id: '5b', content: 'Cache unique déplacée au fil du temps', votes_for: 543, votes_against: 1380, author: '@single_cache_theory' }
      ]
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

  const handleVote = (entryId: string, propositionId: string, voteType: 'for' | 'against') => {
    setUserVotes(prev => ({
      ...prev,
      [`${entryId}_${propositionId}`]: voteType
    }));
    // Ici on appellerait l'API pour enregistrer le vote
    console.log(`Vote ${voteType} pour la proposition ${propositionId} de l'entrée ${entryId}`);
  };

  const getDebateStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-orange-500/20 text-orange-700 dark:text-orange-300';
      case 'consensus': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'controversial': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      case 'resolved': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const getDebateStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'DÉBAT ACTIF';
      case 'consensus': return 'CONSENSUS';
      case 'controversial': return 'CONTROVERSÉ';
      case 'resolved': return 'RÉSOLU';
      default: return 'EN ATTENTE';
    }
  };

  const probabilityLabel = () => {
    if (currentProbability < 20) return { text: "Fausse piste probable", color: "text-destructive" };
    if (currentProbability < 50) return { text: "Investigation en cours", color: "text-muted-foreground" };
    if (currentProbability < 80) return { text: "Piste prometteuse", color: "text-warning" };
    return { text: "Action terrain recommandée", color: "text-green-600" };
  };

  // Calcul des métriques communautaires globales
  const totalActiveDebates = journalEntries.filter(e => e.debate_status === 'active').length;
  const totalParticipants = journalEntries.reduce((sum, e) => sum + (e.total_participants || 0), 0);
  const avgConsensus = journalEntries.reduce((sum, e) => sum + (e.consensus_score || 0), 0) / journalEntries.length;

  return (
    <div className="space-y-6">
      {/* Métriques communautaires globales */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Intelligence Collective
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300">
                {totalActiveDebates} débats actifs
              </Badge>
              <Badge variant="outline">
                {totalParticipants.toLocaleString()} participants
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(avgConsensus)}%</div>
              <div className="text-xs text-muted-foreground">Consensus moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentProbability}%</div>
              <div className="text-xs text-muted-foreground">Probabilité globale</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalActiveDebates}</div>
              <div className="text-xs text-muted-foreground">Votes critiques</div>
            </div>
          </div>
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
                  className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  {/* En-tête de l'entrée */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      {getEntryIcon(entry.type)}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getEntryBadgeVariant(entry.type)} className="text-xs">
                          {entry.type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.timestamp)}
                        </span>
                        {entry.debate_status && (
                          <Badge className={`text-xs ${getDebateStatusColor(entry.debate_status)}`}>
                            {getDebateStatusText(entry.debate_status)}
                          </Badge>
                        )}
                        {entry.probability_impact && (
                          <Badge variant="outline" className="text-xs">
                            +{entry.probability_impact}%
                          </Badge>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {entry.total_participants?.toLocaleString()}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm">{entry.title}</h4>
                        <p className="text-sm text-muted-foreground">{entry.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Consensus global */}
                  {entry.consensus_score !== undefined && (
                    <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Consensus communautaire</span>
                        <span className="text-sm font-bold">{entry.consensus_score}%</span>
                      </div>
                      <Progress value={entry.consensus_score} className="h-2" />
                    </div>
                  )}

                  {/* Propositions et votes */}
                  {entry.propositions && entry.propositions.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {entry.propositions.map((prop) => {
                        const totalVotes = prop.votes_for + prop.votes_against;
                        const supportPercentage = totalVotes > 0 ? (prop.votes_for / totalVotes) * 100 : 0;
                        const userVoteKey = `${entry.id}_${prop.id}`;
                        const userVote = userVotes[userVoteKey];
                        
                        return (
                          <div key={prop.id} className="p-3 border rounded-lg bg-background">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{prop.content}</p>
                                <p className="text-xs text-muted-foreground">par {prop.author}</p>
                              </div>
                              <div className="flex gap-1 ml-2">
                                <Button
                                  variant={userVote === 'for' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleVote(entry.id, prop.id, 'for')}
                                  className="h-8 px-2"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                  <span className="ml-1 text-xs">{prop.votes_for}</span>
                                </Button>
                                <Button
                                  variant={userVote === 'against' ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleVote(entry.id, prop.id, 'against')}
                                  className="h-8 px-2"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                  <span className="ml-1 text-xs">{prop.votes_against}</span>
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress value={supportPercentage} className="h-1 flex-1" />
                              <span className="text-xs text-muted-foreground">
                                {Math.round(supportPercentage)}% de soutien
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action pour voir les détails */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigateToTab(getTargetTab(entry.type), entry.relatedTabData)}
                      className="h-8 text-xs"
                    >
                      Voir détails et voter →
                    </Button>
                    {entry.debate_status === 'active' && (
                      <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-600">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Vote critique
                      </Badge>
                    )}
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