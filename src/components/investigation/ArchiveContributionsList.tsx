import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThumbsUp, ThumbsDown, Camera, MessageCircle, FileEdit, ExternalLink, MapPin } from 'lucide-react';
import { archiveContributionService, ArchiveContribution } from '@/services/archiveContributionService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ArchiveContributionsListProps {
  archiveId: string;
  refreshTrigger?: number;
}

export const ArchiveContributionsList: React.FC<ArchiveContributionsListProps> = ({
  archiveId,
  refreshTrigger
}) => {
  const [contributions, setContributions] = useState<ArchiveContribution[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  const contributionIcons = {
    photo: Camera,
    comment: MessageCircle,
    correction: FileEdit,
    source: ExternalLink,
    location: MapPin
  };

  const loadContributions = async () => {
    try {
      const data = await archiveContributionService.getArchiveContributions(archiveId);
      setContributions(data);
      
      // Load user votes
      const votes: Record<string, string> = {};
      for (const contribution of data) {
        const userVote = await archiveContributionService.getUserVote(contribution.id);
        if (userVote) {
          votes[contribution.id] = userVote.vote_type;
        }
      }
      setUserVotes(votes);
    } catch (error) {
      console.error('Erreur lors du chargement des contributions:', error);
      toast.error('Erreur lors du chargement des contributions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContributions();
  }, [archiveId, refreshTrigger]);

  const handleVote = async (contributionId: string, voteType: 'upvote' | 'downvote') => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error('Vous devez être connecté pour voter');
        return;
      }

      await archiveContributionService.voteContribution(contributionId, voteType);
      
      // Update local state
      setUserVotes(prev => ({ ...prev, [contributionId]: voteType }));
      
      // Update contribution score locally
      setContributions(prev => prev.map(contribution => {
        if (contribution.id === contributionId) {
          const currentUserVote = userVotes[contributionId];
          let scoreChange = 0;
          
          if (currentUserVote === 'upvote' && voteType === 'downvote') {
            scoreChange = -2;
          } else if (currentUserVote === 'downvote' && voteType === 'upvote') {
            scoreChange = 2;
          } else if (!currentUserVote) {
            scoreChange = voteType === 'upvote' ? 1 : -1;
          }
          
          return {
            ...contribution,
            score: contribution.score + scoreChange
          };
        }
        return contribution;
      }));
      
      toast.success('Vote enregistré');
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast.error('Erreur lors du vote');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Chargement des contributions...</div>;
  }

  if (contributions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          Aucune contribution communautaire pour ce document.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Contributions de la communauté ({contributions.length})</h3>
      
      {contributions.map((contribution) => {
        const Icon = contributionIcons[contribution.contribution_type as keyof typeof contributionIcons] || FileEdit;
        const userVote = userVotes[contribution.id];
        
        return (
          <Card key={contribution.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-base">
                      {contribution.title || `Contribution ${contribution.contribution_type}`}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {contribution.user_id.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {new Date(contribution.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {contribution.contribution_type}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={userVote === 'upvote' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(contribution.id, 'upvote')}
                    className="gap-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                    {contribution.score > 0 ? `+${contribution.score}` : contribution.score}
                  </Button>
                  <Button
                    variant={userVote === 'downvote' ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(contribution.id, 'downvote')}
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm mb-3">{contribution.description}</p>
              
              {contribution.image_url && (
                <div className="mt-3">
                  <img
                    src={contribution.image_url}
                    alt="Contribution"
                    className="max-w-full h-auto rounded-lg border"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};