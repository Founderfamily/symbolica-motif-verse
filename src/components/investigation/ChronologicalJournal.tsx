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
    community_votes: event.community_votes || [],
    propositions: [] // Real propositions will be loaded from actual data
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
          {/* Timeline visuelle */}
          <div className="relative">
            {/* Ligne de temps principale */}
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent"></div>
            
            <div className="space-y-8">
              {journalEntries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun événement dans la timeline pour le moment
                </div>
              ) : (
                journalEntries.map((entry, index) => {
                  console.log('Timeline entry:', entry); // Debug log
                  const eventDate = new Date(entry.timestamp);
                const isFirstOfDay = index === 0 || 
                  new Date(journalEntries[index - 1].timestamp).toDateString() !== eventDate.toDateString();
                
                return (
                  <div key={entry.id} className="relative flex items-start gap-6">
                    {/* Date à gauche */}
                    <div className="flex-shrink-0 w-14 text-right">
                      {isFirstOfDay && (
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="font-semibold text-foreground">
                            {eventDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </div>
                          <div className="text-[10px]">
                            {eventDate.getFullYear()}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Point sur la timeline */}
                    <div className="relative flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 border-background flex items-center justify-center z-10
                        ${entry.debate_status === 'consensus' ? 'bg-green-500' :
                          entry.debate_status === 'controversial' ? 'bg-red-500' :
                          entry.debate_status === 'resolved' ? 'bg-blue-500' :
                          'bg-orange-500'
                        }`}>
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute top-1/2 -translate-y-1/2 left-6 w-6 h-px bg-border"></div>
                    </div>

                    {/* Heure */}
                    <div className="flex-shrink-0 w-12 text-xs text-muted-foreground">
                      {eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>

                    {/* Contenu de l'événement */}
                    <div className="flex-1">
                      <Card className={`transition-all duration-200 hover:shadow-md border-l-4 
                        ${entry.debate_status === 'consensus' ? 'border-l-green-500' :
                          entry.debate_status === 'controversial' ? 'border-l-red-500' :
                          entry.debate_status === 'resolved' ? 'border-l-blue-500' :
                          'border-l-orange-500'
                        }`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {getEntryIcon(entry.type)}
                                <Badge variant={getEntryBadgeVariant(entry.type)}>
                                  {entry.type === 'carte' ? 'Carte' :
                                   entry.type === 'indice' ? 'Indice' :
                                   entry.type === 'discussion' ? 'Discussion' :
                                   entry.type === 'source' ? 'Source' :
                                   entry.type === 'personnage' ? 'Personnage' :
                                   entry.type === 'archive' ? 'Archive' :
                                   'Découverte'}
                                </Badge>
                                <Badge 
                                  className={`text-xs px-2 py-0.5 ${getDebateStatusColor(entry.debate_status || 'active')}`}
                                >
                                  {getDebateStatusText(entry.debate_status || 'active')}
                                </Badge>
                              </div>
                              <CardTitle className="text-base leading-tight">
                                {entry.title}
                              </CardTitle>
                            </div>
                            <div className="text-right">
                              {entry.consensus_score && (
                                <div className="text-sm font-medium text-foreground">
                                  {entry.consensus_score}%
                                </div>
                              )}
                              {entry.total_participants && (
                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {entry.total_participants}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {entry.description}
                          </p>

                          {/* Métriques de consensus */}
                          {entry.consensus_score && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Consensus communautaire</span>
                                <span className="font-medium">{entry.consensus_score}%</span>
                              </div>
                              <Progress value={entry.consensus_score} className="h-1.5" />
                            </div>
                          )}

                          {/* Propositions et votes */}
                          {entry.propositions && Array.isArray(entry.propositions) && entry.propositions.length > 0 && (
                            <div className="space-y-3 border-t pt-3">
                              <div className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                Propositions communautaires
                              </div>
                              {entry.propositions?.slice(0, 2).map((prop) => {
                                const totalVotes = prop.votes_for + prop.votes_against;
                                const forPercentage = totalVotes > 0 ? (prop.votes_for / totalVotes) * 100 : 0;
                                const userVoteKey = `${entry.id}_${prop.id}`;
                                const userVote = userVotes[userVoteKey];
                                
                                return (
                                  <div key={prop.id} className="space-y-2 p-3 bg-muted/30 rounded-lg">
                                    <div className="text-xs leading-relaxed">
                                      <span className="font-medium">{prop.author}</span> propose: "{prop.content}"
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant={userVote === 'for' ? 'default' : 'outline'}
                                          size="sm"
                                          className="h-6 px-2 gap-1"
                                          onClick={() => handleVote(entry.id, prop.id, 'for')}
                                        >
                                          <ThumbsUp className="h-3 w-3" />
                                          {prop.votes_for}
                                        </Button>
                                        <Button
                                          variant={userVote === 'against' ? 'destructive' : 'outline'}
                                          size="sm"
                                          className="h-6 px-2 gap-1"
                                          onClick={() => handleVote(entry.id, prop.id, 'against')}
                                        >
                                          <ThumbsDown className="h-3 w-3" />
                                          {prop.votes_against}
                                        </Button>
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {Math.round(forPercentage)}% d'accord
                                      </div>
                                    </div>
                                    
                                    <Progress value={forPercentage} className="h-1" />
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatDate(entry.timestamp)}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onNavigateToTab(getTargetTab(entry), entry.relatedTabData)}
                              className="h-8 px-3 flex items-center gap-2"
                            >
                              {getEntryIcon(entry.type)}
                              Voir dans {getTargetTab(entry) === 'map' ? 'Carte' : 
                                       getTargetTab(entry) === 'clues' ? 'Indices' :
                                       getTargetTab(entry) === 'chat' ? 'Chat' :
                                       getTargetTab(entry) === 'investigation' ? 'Investigation' :
                                       getTargetTab(entry) === 'personnages' ? 'Personnages' :
                                       getTargetTab(entry) === 'archives' ? 'Archives' : 'Journal'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                );
              })
              )}
            </div>

            {/* Fin de timeline */}
            <div className="flex items-center gap-6 mt-8">
              <div className="w-14"></div>
              <div className="w-4 h-4 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
              </div>
              <div className="w-12"></div>
              <div className="text-sm text-muted-foreground">
                Début de l'investigation...
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChronologicalJournal;