import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { QuestClue } from '@/types/quests';

interface ClueVote {
  clueId: string;
  userId: string;
  voteType: 'true' | 'false';
  comment?: string;
  timestamp: Date;
}

interface ClueVotingSystemProps {
  clues: (QuestClue & {
    votes: { true: number; false: number };
    userVote?: 'true' | 'false';
    consensus_reached: boolean;
    validation_threshold: number;
    comments: Array<{
      userId: string;
      userName: string;
      comment: string;
      timestamp: Date;
    }>;
  })[];
  onVote: (clueId: string, voteType: 'true' | 'false', comment?: string) => void;
  onUnlock?: (clueId: string) => void;
}

const ClueVotingSystem: React.FC<ClueVotingSystemProps> = ({
  clues,
  onVote,
  onUnlock
}) => {
  const [selectedClue, setSelectedClue] = useState<string | null>(null);
  const [voteComment, setVoteComment] = useState('');
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = (clueId: string, voteType: 'true' | 'false') => {
    setIsVoting(true);
    onVote(clueId, voteType, voteComment);
    setVoteComment('');
    setSelectedClue(null);
    setIsVoting(false);
  };

  const getConsensusPercentage = (clue: any) => {
    const total = clue.votes.true + clue.votes.false;
    if (total === 0) return 0;
    return Math.round((clue.votes.true / total) * 100);
  };

  const getConsensusStatus = (clue: any) => {
    const percentage = getConsensusPercentage(clue);
    const total = clue.votes.true + clue.votes.false;
    
    if (total < 3) return { status: 'insufficient', color: 'text-gray-500', label: 'Votes insuffisants' };
    if (percentage >= 80) return { status: 'validated', color: 'text-green-600', label: 'Validé par la communauté' };
    if (percentage <= 20) return { status: 'rejected', color: 'text-red-600', label: 'Rejeté par la communauté' };
    return { status: 'debated', color: 'text-orange-600', label: 'En débat' };
  };

  const getUnlockedClues = () => {
    return clues.filter(clue => {
      const consensus = getConsensusStatus(clue);
      return consensus.status === 'validated';
    }).length;
  };

  const getTotalProgress = () => {
    const totalClues = clues.length;
    const validatedClues = getUnlockedClues();
    return totalClues > 0 ? Math.round((validatedClues / totalClues) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Validation Communautaire
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {getUnlockedClues()}/{clues.length} validés
            </Badge>
            <Badge variant="outline">
              Progression: {getTotalProgress()}%
            </Badge>
          </div>
        </div>
        <Progress value={getTotalProgress()} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        {clues.map((clue) => {
          const consensus = getConsensusStatus(clue);
          const percentage = getConsensusPercentage(clue);
          const totalVotes = clue.votes.true + clue.votes.false;

          return (
            <div key={clue.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{clue.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{clue.description}</p>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${consensus.color} bg-opacity-10`}
                >
                  {consensus.status === 'validated' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {consensus.status === 'rejected' && <AlertTriangle className="w-3 h-3 mr-1" />}
                  {consensus.status === 'debated' && <Clock className="w-3 h-3 mr-1" />}
                  {consensus.label}
                </Badge>
              </div>

              {/* Barre de progression des votes */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">✓ Vrai ({clue.votes.true})</span>
                  <span className={consensus.color}>{percentage}%</span>
                  <span className="text-red-600">✗ Faux ({clue.votes.false})</span>
                </div>
                <div className="relative h-2 bg-red-100 rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 h-full bg-green-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>

              {/* Actions de vote */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!clue.userVote ? (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => setSelectedClue(clue.id.toString())}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            Vrai
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Voter pour cet indice</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="p-3 bg-muted rounded-lg">
                              <h4 className="font-medium">{clue.title}</h4>
                              <p className="text-sm text-muted-foreground">{clue.description}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Commentaire (optionnel)</label>
                              <Textarea 
                                value={voteComment}
                                onChange={(e) => setVoteComment(e.target.value)}
                                placeholder="Expliquez votre vote..."
                                rows={3}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => handleVote(clue.id.toString(), 'true')}
                                disabled={isVoting}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Voter VRAI
                              </Button>
                              <Button 
                                onClick={() => handleVote(clue.id.toString(), 'false')}
                                disabled={isVoting}
                                variant="destructive"
                                className="flex-1"
                              >
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Voter FAUX
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  ) : (
                    <Badge variant="outline" className={clue.userVote === 'true' ? 'text-green-600' : 'text-red-600'}>
                      Voté: {clue.userVote === 'true' ? 'Vrai' : 'Faux'}
                    </Badge>
                  )}
                  
                  {clue.comments.length > 0 && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {clue.comments.length}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Commentaires de la communauté</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {clue.comments.map((comment, index) => (
                            <div key={index} className="p-3 border rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{comment.userName}</span>
                                <span className="text-xs text-muted-foreground">
                                  {comment.timestamp.toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{comment.comment}</p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                {consensus.status === 'validated' && onUnlock && (
                  <Button 
                    size="sm" 
                    onClick={() => onUnlock(clue.id.toString())}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Utiliser cet indice
                  </Button>
                )}
              </div>

              {totalVotes > 0 && (
                <div className="text-xs text-muted-foreground">
                  {totalVotes} participant{totalVotes > 1 ? 's ont' : ' a'} voté sur cet indice
                </div>
              )}
            </div>
          );
        })}

        {clues.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun indice à valider pour le moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClueVotingSystem;