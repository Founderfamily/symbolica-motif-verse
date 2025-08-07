import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, MessageCircle, User, Archive, Search, Lightbulb, ThumbsUp, ThumbsDown, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useTimelineData, TimelineEvent } from '@/hooks/useTimelineData';

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
  sources?: any[];
  clues?: any[];
  documents?: any[];
  discussions?: any[];
  figures?: any[];
  archives?: any[];
}

const ChronologicalJournal: React.FC<ChronologicalJournalProps> = ({
  quest,
  onNavigateToTab,
  currentProbability,
  sources = [],
  clues = [],
  documents = [],
  discussions = [],
  figures = [],
  archives = []
}) => {
  const [userVotes, setUserVotes] = useState<Record<string, 'for' | 'against'>>({});
  
  // Use timeline hook to get dynamic events
  const { events, getStatistics, addTimelineEvent } = useTimelineData({
    quest,
    sources,
    clues,
    documents,
    discussions,
    figures,
    archives
  });

  // Convert timeline events to journal entries for compatibility
  const journalEntries: JournalEntry[] = events.map(event => ({
    id: event.id,
    timestamp: event.timestamp,
    type: event.type,
    title: event.title,
    description: event.description,
    relatedTabData: event.relatedTabData,
    probability_impact: event.probability_impact,
    consensus_score: event.consensus_score,
    debate_status: event.debate_status,
    total_participants: event.total_participants,
    community_votes: event.community_votes,
    propositions: [] // Will be filled from real data when available
  }));

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

  const getTargetTab = (entry: JournalEntry) => {
    // Use relatedTabData if available, otherwise fall back to type mapping
    if (entry.relatedTabData?.tabTarget) {
      return entry.relatedTabData.tabTarget;
    }
    
    switch (entry.type) {
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
  const statistics = getStatistics();
  const totalActiveDebates = statistics.activeDebates;
  const totalParticipants = statistics.totalParticipants;
  const avgConsensus = statistics.avgConsensus;

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
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(avgConsensus)}%</div>
              <div className="text-xs text-muted-foreground">Consensus global</div>
              <div className="text-[10px] text-muted-foreground/70">15,847 votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{currentProbability}%</div>
              <div className="text-xs text-muted-foreground">Pierre localisée</div>
              <div className="text-[10px] text-muted-foreground/70">Flamel laboratory</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalActiveDebates}</div>
              <div className="text-xs text-muted-foreground">Débats actifs</div>
              <div className="text-[10px] text-muted-foreground/70">Manuscrits • Sites</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">423</div>
              <div className="text-xs text-muted-foreground">Chercheurs</div>
              <div className="text-[10px] text-muted-foreground/70">A2CO • Sans Hulotte</div>
            </div>
          </div>
          <Progress value={currentProbability} className="h-3 mb-2" />
          <p className={`text-sm ${probabilityLabel().color}`}>
            {probabilityLabel().text} - Investigation Nicolas Flamel & Jean de Montclair
          </p>
        </CardContent>
      </Card>

      {/* Journal chronologique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Journal Nicolas Flamel - Investigation Collaborative
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Chronologie des découvertes historiques • Manuscrits authentifiés • Sites alchimiques • Communautés A2CO & Sans Hulotte
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
                      onClick={() => onNavigateToTab(getTargetTab(entry), entry.relatedTabData)}
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