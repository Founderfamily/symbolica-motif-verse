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

  // Journal d'investigation Nicolas Flamel - Basé sur les recherches historiques A2CO/Sans Hulotte
  const journalEntries: JournalEntry[] = [
    {
      id: '1',
      timestamp: '2024-02-20T09:15:00Z',
      type: 'source',
      title: 'Découverte majeure: Manuscrit du "Livre d\'Abraham le Juif"',
      description: 'Identification d\'une copie authentique dans les archives Sainte-Geneviève. Les 7 figures alchimiques correspondent aux caches de Flamel.',
      relatedTabData: { sourceId: 'abraham_manuscript_1382' },
      probability_impact: 35,
      consensus_score: 89,
      debate_status: 'consensus',
      total_participants: 4283,
      propositions: [
        { id: '1a', content: 'Les 7 figures alchimiques indiquent 7 caches distinctes autour de Paris', votes_for: 3815, votes_against: 468, author: '@dr_marie_dubois_cnrs' },
        { id: '1b', content: 'L\'ordre des transformations révèle la séquence de découverte', votes_for: 3567, votes_against: 716, author: '@manuscript_expert_bnf' }
      ]
    },
    {
      id: '2',
      timestamp: '2024-02-19T14:22:00Z',
      type: 'archive',
      title: 'Authentification: Encres ferrogalliques de 1382',
      description: 'Analyse CNRS confirmée: les encres du manuscrit Fontainebleau datent de l\'époque de Nicolas Flamel (1382 ± 5 ans)',
      relatedTabData: { archiveId: 'cnrs_analysis_2024' },
      probability_impact: 28,
      consensus_score: 94,
      debate_status: 'resolved',
      total_participants: 2967,
      propositions: [
        { id: '2a', content: 'Manuscrit contemporain de Flamel - authentique', votes_for: 2789, votes_against: 178, author: '@dr_marie_dubois_cnrs' },
        { id: '2b', content: 'Annotations rouges de Jean de Montclair confirmées', votes_for: 2145, votes_against: 822, author: '@paleography_expert' }
      ]
    },
    {
      id: '3',
      timestamp: '2024-02-18T16:45:00Z',
      type: 'carte',
      title: 'Géolocalisation: Pentagramme alchimique parisien',
      description: 'IA détecte alignement parfait entre 5 sites alchimiques formant un pentagramme centré sur Notre-Dame',
      relatedTabData: { mapId: 'pentagram_flamel_sites' },
      probability_impact: 22,
      consensus_score: 68,
      debate_status: 'active',
      total_participants: 3456,
      propositions: [
        { id: '3a', content: 'Pentagramme géographique centré sur Notre-Dame', votes_for: 2234, votes_against: 1222, author: '@geospatial_ai_analysis' },
        { id: '3b', content: 'Distances respectent les proportions du nombre d\'or', votes_for: 2567, votes_against: 889, author: '@golden_ratio_specialist' }
      ]
    },
    {
      id: '4',
      timestamp: '2024-02-17T11:30:00Z',
      type: 'decouverte',
      title: 'Laboratoire secret rue de Montmorency',
      description: 'Jean-Claude Moreau révèle structure souterraine non cartographiée sous la maison historique de Flamel',
      relatedTabData: { discoveryId: 'underground_lab_flamel' },
      probability_impact: 31,
      consensus_score: 76,
      debate_status: 'consensus',
      total_participants: 2847,
      propositions: [
        { id: '4a', content: 'Fondations révèlent laboratoire alchimique intact', votes_for: 2156, votes_against: 691, author: '@jc_moreau_archaeologist' },
        { id: '4b', content: 'Symboles gravés pointent vers cache sous l\'escalier', votes_for: 2389, votes_against: 458, author: '@symbol_decoder_team' }
      ]
    },
    {
      id: '5',
      timestamp: '2024-02-16T08:45:00Z',
      type: 'source',
      title: 'Débat: "Figures Hiéroglyphiques" de 1612',
      description: 'Communauté Sans Hulotte débat l\'authenticité du texte publié 200 ans après la mort de Flamel',
      relatedTabData: { sourceId: 'figures_hieroglyphiques_1612' },
      probability_impact: 18,
      consensus_score: 55,
      debate_status: 'controversial',
      total_participants: 5834,
      propositions: [
        { id: '5a', content: 'Publication authentique basée sur carnets originaux', votes_for: 2678, votes_against: 3156, author: '@flamel_scholar_society' },
        { id: '5b', content: 'Reconstruction tardive par disciples avec ajouts', votes_for: 3445, votes_against: 2389, author: '@critical_manuscript_analysis' }
      ]
    },
    {
      id: '6',
      timestamp: '2024-02-15T19:20:00Z',
      type: 'indice',
      title: 'Révélation UV: Symboles cachés sur tombe Pérenelle',
      description: 'Lampe UV révèle inscriptions alchimiques invisibles: "Mercure philosophique caché sous la rose"',
      relatedTabData: { clueId: 'uv_symbols_perenelle_tomb' },
      probability_impact: 26,
      consensus_score: 88,
      debate_status: 'consensus',
      total_participants: 3267,
      propositions: [
        { id: '6a', content: 'Symboles indiquent "Mercure philosophique sous la rose"', votes_for: 2876, votes_against: 391, author: '@uv_investigation_team' },
        { id: '6b', content: 'Rose gravée désigne jardin secret de Flamel', votes_for: 2543, votes_against: 724, author: '@garden_archaeology_expert' }
      ]
    },
    {
      id: '7',
      timestamp: '2024-02-14T13:15:00Z',
      type: 'archive',
      title: 'Analyse chimique: Résidus de four alchimique',
      description: 'Pr. Antoine Lavoisier Jr. identifie mercure, soufre, antimoine dans vestiges du laboratoire Flamel',
      relatedTabData: { archiveId: 'chemical_analysis_furnace' },
      probability_impact: 24,
      consensus_score: 91,
      debate_status: 'resolved',
      total_participants: 1923,
      propositions: [
        { id: '7a', content: 'Résidus confirment transmutation des métaux (Hg, S, Sb)', votes_for: 1753, votes_against: 170, author: '@chemistry_lab_sorbonne' },
        { id: '7b', content: 'Température 1200°C suffisante pour l\'œuvre au rouge', votes_for: 1689, votes_against: 234, author: '@high_temp_metallurgy' }
      ]
    },
    {
      id: '8',
      timestamp: '2024-02-13T10:05:00Z',
      type: 'personnage',
      title: 'Jean de Montclair: Alchimiste royal oublié',
      description: 'Sophie Lemercier révèle existence d\'un collaborateur secret de Flamel, alchimiste officiel de Charles VI',
      relatedTabData: { figureId: 'jean_montclair_royal_alchemist' },
      probability_impact: 29,
      consensus_score: 68,
      debate_status: 'active',
      total_participants: 4521,
      propositions: [
        { id: '8a', content: 'Jean de Montclair était protecteur royal de Flamel', votes_for: 2938, votes_against: 1583, author: '@sophie_lemercier_historian' },
        { id: '8b', content: 'Ses manuscrits cachés contiennent la vraie formule', votes_for: 3156, votes_against: 1365, author: '@royal_archives_researcher' }
      ]
    },
    {
      id: '9',
      timestamp: '2024-02-12T15:30:00Z',
      type: 'discussion',
      title: 'Cycles lunaires et transmutations de Flamel',
      description: 'IA détecte pattern: toutes les dates de Flamel correspondent aux nouvelles lunes (influence hermétique)',
      relatedTabData: { chatId: 'lunar_cycles_analysis' },
      probability_impact: 33,
      consensus_score: 84,
      debate_status: 'consensus',
      total_participants: 2845,
      propositions: [
        { id: '9a', content: 'Flamel opérait uniquement en nouvelle lune', votes_for: 2389, votes_against: 456, author: '@hermetic_calendar_expert' },
        { id: '9b', content: 'Prochain cycle optimal: 25 mars 2024 (équinoxe)', votes_for: 2567, votes_against: 278, author: '@astronomical_society' }
      ]
    },
    {
      id: '10',
      timestamp: '2024-02-11T07:40:00Z',
      type: 'decouverte',
      title: 'Creuset intact avec résidus d\'or découvert',
      description: 'Creuset en terre cuite intact avec traces de Pierre Philosophale dans fondations maison Flamel',
      relatedTabData: { discoveryId: 'intact_crucible_gold_traces' },
      probability_impact: 41,
      consensus_score: 90,
      debate_status: 'consensus',
      total_participants: 3847,
      propositions: [
        { id: '10a', content: 'Creuset contient traces de Pierre Philosophale', votes_for: 3456, votes_against: 391, author: '@archaeological_dig_team' },
        { id: '10b', content: 'Emplacement révèle entrée laboratoire souterrain', votes_for: 3289, votes_against: 558, author: '@underground_mapping_specialist' }
      ]
    },
    {
      id: '11',
      timestamp: '2024-02-10T12:20:00Z',
      type: 'indice',
      title: 'Ouroboros de Fontainebleau: Cycle ou géographie?',
      description: 'Débat A2CO sur symbole "dragon qui se mord la queue": cycle alchimique vs localisation géographique',
      relatedTabData: { clueId: 'ouroboros_manuscript_symbol' },
      probability_impact: 15,
      consensus_score: 57,
      debate_status: 'active',
      total_participants: 2967,
      propositions: [
        { id: '11a', content: 'Ouroboros = cycle dissolution/coagulation', votes_for: 1689, votes_against: 1278, author: '@alchemical_symbolism_expert' },
        { id: '11b', content: 'Indique trésor caché en cercle autour de Paris', votes_for: 1756, votes_against: 1211, author: '@geographic_treasure_hunter' }
      ]
    },
    {
      id: '12',
      timestamp: '2024-02-09T16:55:00Z',
      type: 'archive',
      title: 'Paléographie: Écriture de Flamel authentifiée',
      description: 'Dre Isabelle Chartier confirme que 3 des 7 manuscrits sont autographes de Nicolas Flamel',
      relatedTabData: { archiveId: 'paleography_authentication' },
      probability_impact: 37,
      consensus_score: 96,
      debate_status: 'resolved',
      total_participants: 2134,
      propositions: [
        { id: '12a', content: 'Manuscrits 1, 3 et 7 sont autographes Flamel', votes_for: 2045, votes_against: 89, author: '@dr_isabelle_chartier_bnf' },
        { id: '12b', content: 'Annotations marginales révèlent cache principale', votes_for: 1892, votes_against: 242, author: '@margin_notes_decoder' }
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