import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';

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
  comments: any[];
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
  const handleVote = (clueId: number, isValid: boolean) => {
    onClueValidated(clueId, isValid);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Validation des indices</h3>
        <Badge variant="outline">
          {clues.length} indice{clues.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {clues.map((clue) => (
        <Card key={clue.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base">{clue.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {clue.description}
                </p>
              </div>
              <Badge 
                variant={clue.consensus_reached ? 'default' : 'secondary'}
              >
                {Math.round(clue.validation_score * 100)}%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Score de validation</span>
                  <span>{clue.votes.true + clue.votes.false} votes</span>
                </div>
                <Progress 
                  value={clue.validation_score * 100} 
                  className="h-2"
                />
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant={clue.userVote === true ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleVote(clue.id, true)}
                  className="gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Valide ({clue.votes.true})
                </Button>
                
                <Button
                  variant={clue.userVote === false ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => handleVote(clue.id, false)}
                  className="gap-2"
                >
                  <ThumbsDown className="h-4 w-4" />
                  Invalide ({clue.votes.false})
                </Button>

                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Commentaires ({clue.comments.length})
                </Button>
              </div>

              {clue.hint && (
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-sm">
                    <strong>Indice :</strong> {clue.hint}
                  </p>
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