import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ThumbsUp, ThumbsDown, MessageCircle, Filter, Clock, Users, TrendingUp, AlertTriangle } from 'lucide-react';

interface ClueData {
  id: number;
  title: string;
  description: string;
  content: string;
  hint: string;
  validation_type: 'location' | 'symbol' | 'photo' | 'code';
  validation_data: any;
  votes: { true: number; false: number };
  validation_score: number;
  userVote?: boolean;
  consensus_reached: boolean;
  validation_threshold: number;
  debate_status: 'consensus' | 'active_debate' | 'controversial' | 'rejected';
  submitted_by: string;
  submitted_at: string;
  contributors: string[];
  controversy_level: 'low' | 'medium' | 'high';
  comments: { user: string; text: string; votes: number }[];
}

interface ClueVotingSystemProps {
  questId: string;
  clues: ClueData[];
  onClueValidated: (clueId: number, isValid: boolean) => void;
}

const ClueVotingSystem: React.FC<ClueVotingSystemProps> = ({
  questId,
  clues,
  onClueValidated
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterType, setFilterType] = React.useState<string>('all');
  const [sortBy, setSortBy] = React.useState<string>('recent');

  const handleVote = (clueId: number, isValid: boolean) => {
    onClueValidated(clueId, isValid);
  };

  const getDebateStatusBadge = (status: string, controversyLevel: string) => {
    switch (status) {
      case 'consensus':
        return <Badge className="bg-green-100 text-green-800 border-green-300">✓ Consensus</Badge>;
      case 'active_debate':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">🔥 Débat actif</Badge>;
      case 'controversial':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">⚠️ Controversé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-300">✗ Rejeté</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getContributorsText = (contributors: string[], submittedBy: string) => {
    const totalContributors = contributors.length + 1; // +1 pour le soumetteur
    return `${totalContributors} contributeur${totalContributors > 1 ? 's' : ''}`;
  };

  // Filtrage et tri des indices
  const filteredAndSortedClues = React.useMemo(() => {
    let filtered = clues.filter(clue => {
      const matchesSearch = searchTerm === '' || 
        clue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clue.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || clue.validation_type === filterType;
      
      return matchesSearch && matchesType;
    });

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
        case 'score':
          return b.validation_score - a.validation_score;
        case 'votes':
          return (b.votes.true + b.votes.false) - (a.votes.true + a.votes.false);
        case 'controversy':
          const controversyOrder = { high: 3, medium: 2, low: 1 };
          return controversyOrder[b.controversy_level] - controversyOrder[a.controversy_level];
        default:
          return 0;
      }
    });

    return filtered;
  }, [clues, searchTerm, filterType, sortBy]);

  // Statistiques globales
  const stats = React.useMemo(() => {
    const totalVotes = clues.reduce((sum, clue) => sum + clue.votes.true + clue.votes.false, 0);
    const consensusClues = clues.filter(clue => clue.debate_status === 'consensus').length;
    const activeDebates = clues.filter(clue => clue.debate_status === 'active_debate').length;
    const avgScore = clues.reduce((sum, clue) => sum + clue.validation_score, 0) / clues.length;

    return { totalVotes, consensusClues, activeDebates, avgScore };
  }, [clues]);

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">{stats.totalVotes}</p>
              <p className="text-xs text-muted-foreground">Votes totaux</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{stats.consensusClues}</p>
              <p className="text-xs text-muted-foreground">Consensus</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-sm font-medium">{stats.activeDebates}</p>
              <p className="text-xs text-muted-foreground">Débats actifs</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">{Math.round(stats.avgScore * 100)}%</p>
              <p className="text-xs text-muted-foreground">Score moyen</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Contrôles de filtrage et tri */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher dans les indices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Type d'indice" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="location">📍 Localisation</SelectItem>
            <SelectItem value="symbol">🔣 Symbole</SelectItem>
            <SelectItem value="photo">📸 Photo</SelectItem>
            <SelectItem value="code">🔐 Code</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <Clock className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Plus récents</SelectItem>
            <SelectItem value="score">Score validation</SelectItem>
            <SelectItem value="votes">Nombre de votes</SelectItem>
            <SelectItem value="controversy">Controverse</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* En-tête des résultats */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {filteredAndSortedClues.length} indice{filteredAndSortedClues.length > 1 ? 's' : ''}
          {searchTerm && ` correspondant à "${searchTerm}"`}
        </h3>
        <Badge variant="outline">
          Communauté active: 4,827 participants
        </Badge>
      </div>

      {filteredAndSortedClues.map((clue) => (
        <Card key={clue.id} className="relative">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-base">{clue.title}</CardTitle>
                  {getDebateStatusBadge(clue.debate_status, clue.controversy_level)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {clue.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Par {clue.submitted_by}</span>
                  <span>•</span>
                  <span>{getContributorsText(clue.contributors, clue.submitted_by)}</span>
                  <span>•</span>
                  <span>{new Date(clue.submitted_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge 
                  variant={clue.consensus_reached ? 'default' : 'secondary'}
                  className="text-lg font-bold px-3 py-1"
                >
                  {Math.round(clue.validation_score * 100)}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {clue.validation_type === 'location' && '📍 Localisation'}
                  {clue.validation_type === 'symbol' && '🔣 Symbole'}
                  {clue.validation_type === 'photo' && '📸 Photo'}
                  {clue.validation_type === 'code' && '🔐 Code'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Score de validation communautaire</span>
                  <span className="font-medium">
                    {clue.votes.true + clue.votes.false} votes
                    {clue.controversy_level === 'high' && ' • 🔥 Très débattu'}
                  </span>
                </div>
                <Progress 
                  value={clue.validation_score * 100} 
                  className="h-3"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{clue.votes.true} pour</span>
                  <span>{clue.votes.false} contre</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm">
                  <strong>Détails :</strong> {clue.content}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={clue.userVote === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleVote(clue.id, true)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Valider ({clue.votes.true.toLocaleString()})
                </Button>
                
                <Button
                  variant={clue.userVote === false ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleVote(clue.id, false)}
                  className="gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Rejeter ({clue.votes.false.toLocaleString()})
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Débat ({clue.comments.length})
                </Button>

                {clue.debate_status === 'active_debate' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    🔥 Vote urgent
                  </Badge>
                )}
              </div>

              {clue.hint && (
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-sm">
                    <strong>💡 Indice :</strong> {clue.hint}
                  </p>
                </div>
              )}

              {/* Aperçu des commentaires populaires */}
              {clue.comments.length > 0 && (
                <div className="border-t pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Commentaires les plus votés:
                  </p>
                  {clue.comments.slice(0, 2).map((comment, idx) => (
                    <div key={idx} className="flex items-start gap-2 mb-2 text-xs">
                      <Badge variant="outline" className="px-1 py-0 text-xs">
                        +{comment.votes}
                      </Badge>
                      <div>
                        <span className="font-medium">{comment.user}:</span>
                        <span className="ml-1 text-muted-foreground">{comment.text}</span>
                      </div>
                    </div>
                  ))}
                  {clue.comments.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{clue.comments.length - 2} autres commentaires...
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClueVotingSystem;