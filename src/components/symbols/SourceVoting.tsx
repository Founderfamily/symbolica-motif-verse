import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SourceReportDialog } from './SourceReportDialog';
import { SourceActionDialog } from './SourceActionDialog';
import { 
  ThumbsUp, 
  ThumbsDown, 
  ExternalLink, 
  User, 
  Clock, 
  TrendingUp,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Award,
  BookOpen,
  AlertTriangle,
  Flag,
  Wrench,
  Link
} from 'lucide-react';

interface Source {
  id: string;
  url: string;
  title: string;
  description?: string;
  added_by: string;
  created_at: string;
  upvotes: number;
  downvotes: number;
  user_vote?: 'up' | 'down' | null;
  reliability_tier?: number;
  verification_status?: 'pending' | 'verified' | 'disputed' | 'rejected';
  expert_verified?: boolean;
  doi?: string;
  isbn?: string;
  archive_url?: string;
  profiles: {
    username: string;
    full_name: string;
  };
}

interface SourceVotingProps {
  symbolId: string;
}

export const SourceVoting: React.FC<SourceVotingProps> = ({ symbolId }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadSources();
  }, [symbolId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadSources = async () => {
    try {
      setLoading(true);
      
      // Récupérer les sources depuis la base de données
      const { data: sourcesData, error } = await supabase
        .from('symbol_sources')
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .eq('symbol_id', symbolId)
        .order('reliability_tier', { ascending: true })
        .order('upvotes', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des sources:', error);
        setSources([]);
        return;
      }

      // Récupérer les votes de l'utilisateur actuel si connecté
      let userVotes: any[] = [];
      if (user) {
        const { data: votesData } = await supabase
          .from('symbol_source_votes')
          .select('source_id, vote_type')
          .eq('user_id', user.id);
        
        userVotes = votesData || [];
      }

      // Mapper les données avec les votes de l'utilisateur
      const sourcesWithVotes = sourcesData.map(source => ({
        ...source,
        user_vote: userVotes.find(vote => vote.source_id === source.id)?.vote_type || null,
        verification_status: source.verification_status as 'pending' | 'verified' | 'disputed' | 'rejected' | undefined
      }));
      
      setSources(sourcesWithVotes as Source[]);
    } catch (error) {
      console.error('Erreur lors du chargement des sources:', error);
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (sourceId: string, voteType: 'up' | 'down') => {
    if (!user) {
      toast.error('Vous devez être connecté pour voter');
      return;
    }

    try {
      // Vérifier si l'utilisateur a déjà voté
      const currentSource = sources.find(s => s.id === sourceId);
      const isTogglingVote = currentSource?.user_vote === voteType;

      if (isTogglingVote) {
        // Supprimer le vote existant
        const { error } = await supabase
          .from('symbol_source_votes')
          .delete()
          .eq('source_id', sourceId)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Ajouter ou modifier le vote
        const { error } = await supabase
          .from('symbol_source_votes')
          .upsert({
            source_id: sourceId,
            user_id: user.id,
            vote_type: voteType
          });

        if (error) throw error;
      }

      // Recharger les sources pour mettre à jour les compteurs
      await loadSources();
      toast.success(isTogglingVote ? 'Vote retiré !' : 'Vote enregistré !');
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      toast.error('Erreur lors du vote');
    }
  };

  const getVoteScore = (source: Source) => {
    return source.upvotes - source.downvotes;
  };

  const getCredibilityLevel = (source: Source) => {
    const score = getVoteScore(source);
    const totalVotes = source.upvotes + source.downvotes;
    
    if (totalVotes < 3) return { level: 'Non évalué', color: 'bg-gray-100 text-gray-800' };
    if (score >= 5) return { level: 'Très fiable', color: 'bg-green-100 text-green-800' };
    if (score >= 2) return { level: 'Fiable', color: 'bg-blue-100 text-blue-800' };
    if (score >= 0) return { level: 'Neutre', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Contesté', color: 'bg-red-100 text-red-800' };
  };

  const getReliabilityTierInfo = (tier?: number) => {
    switch (tier) {
      case 1:
        return { 
          label: 'Tier 1 - Source primaire', 
          color: 'bg-emerald-100 text-emerald-800',
          icon: Award 
        };
      case 2:
        return { 
          label: 'Tier 2 - Source académique', 
          color: 'bg-blue-100 text-blue-800',
          icon: BookOpen 
        };
      case 3:
        return { 
          label: 'Tier 3 - Source fiable', 
          color: 'bg-gray-100 text-gray-800',
          icon: Shield 
        };
      case 4:
        return { 
          label: 'Tier 4 - Source à vérifier', 
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle 
        };
      default:
        return { 
          label: 'Non classée', 
          color: 'bg-gray-100 text-gray-800',
          icon: Shield 
        };
    }
  };

  const getVerificationStatusInfo = (status?: string) => {
    switch (status) {
      case 'verified':
        return { 
          label: 'Vérifiée', 
          color: 'bg-green-100 text-green-800',
          icon: ShieldCheck 
        };
      case 'disputed':
        return { 
          label: 'Contestée', 
          color: 'bg-yellow-100 text-yellow-800',
          icon: ShieldAlert 
        };
      case 'rejected':
        return { 
          label: 'Rejetée', 
          color: 'bg-red-100 text-red-800',
          icon: ShieldX 
        };
      default:
        return { 
          label: 'En attente', 
          color: 'bg-gray-100 text-gray-800',
          icon: Shield 
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-amber-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Sources validées par la communauté
        </h3>
      </div>

      <div className="space-y-4">
        {sources.map((source) => {
          const credibility = getCredibilityLevel(source);
          const score = getVoteScore(source);
          
          return (
            <Card key={source.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <a 
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      {source.title}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    
                    {source.expert_verified && (
                      <Badge className="bg-purple-100 text-purple-800">
                        <Award className="h-3 w-3 mr-1" />
                        Expert
                      </Badge>
                    )}
                  </div>
                  
                  {source.description && (
                    <p className="text-slate-600 mb-2">{source.description}</p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{source.profiles.full_name || source.profiles.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(source.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {source.archive_url && (
                      <a
                        href={source.archive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                      >
                        <Link className="h-4 w-4" />
                        Archive
                      </a>
                    )}
                  </div>

                  {(source.doi || source.isbn) && (
                    <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                      {source.doi && (
                        <span>DOI: {source.doi}</span>
                      )}
                      {source.isbn && (
                        <span>ISBN: {source.isbn}</span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="flex flex-col gap-1">
                    {(() => {
                      const tierInfo = getReliabilityTierInfo(source.reliability_tier);
                      const TierIcon = tierInfo.icon;
                      return (
                        <Badge className={tierInfo.color}>
                          <TierIcon className="h-3 w-3 mr-1" />
                          {tierInfo.label}
                        </Badge>
                      );
                    })()}
                    
                    {(() => {
                      const statusInfo = getVerificationStatusInfo(source.verification_status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      );
                    })()}
                    
                    <Badge className={credibility.color}>
                      {credibility.level}
                    </Badge>
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      score > 0 ? 'text-green-600' : 
                      score < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {score > 0 ? '+' : ''}{score}
                    </div>
                    <div className="text-xs text-slate-500">score</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={source.user_vote === 'up' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(source.id, 'up')}
                    disabled={!user}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{source.upvotes}</span>
                  </Button>
                  <Button
                    variant={source.user_vote === 'down' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(source.id, 'down')}
                    disabled={!user}
                    className="flex items-center gap-1"
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>{source.downvotes}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  {user ? (
                    <>
                      <SourceReportDialog sourceId={source.id}>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Flag className="h-4 w-4 mr-1" />
                          Signaler
                        </Button>
                      </SourceReportDialog>
                      
                      <SourceActionDialog sourceId={source.id}>
                        <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700">
                          <Wrench className="h-4 w-4 mr-1" />
                          Améliorer
                        </Button>
                      </SourceActionDialog>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">
                      Connectez-vous pour voter et signaler
                    </p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {sources.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-slate-600">Aucune source n'a encore été ajoutée pour ce symbole.</p>
        </Card>
      )}
    </div>
  );
};