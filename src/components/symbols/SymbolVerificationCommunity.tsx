import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MessageSquare,
  User,
  Clock,
  Shield,
  Send,
  Info,
  Flag,
  Trash2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SymbolVerificationCommunityProps {
  symbol: {
    id: string;
    name: string;
  };
  commentsDisabled?: boolean;
}

interface CommunityComment {
  id: string;
  user_id: string;
  comment: string;
  verification_rating: 'verified' | 'disputed' | 'unverified';
  expertise_level: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string;
    is_admin: boolean;
  };
}

export const SymbolVerificationCommunity: React.FC<SymbolVerificationCommunityProps> = ({ symbol, commentsDisabled = false }) => {
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedRating, setSelectedRating] = useState<'verified' | 'disputed' | 'unverified'>('disputed');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    checkUserPermissions();
    loadCommunityComments();
  }, [symbol.id]);

  const checkUserPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);
    } catch (error) {
      console.error('Erreur lors de la vérification des permissions:', error);
    }
  };

  const loadCommunityComments = async () => {
    try {
      setLoading(true);
      
      // Utilisation de la fonction PostgreSQL dédiée
      const { data: verificationComments, error } = await supabase
        .rpc('get_community_verification_comments', {
          p_symbol_id: symbol.id
        });

      if (error) throw error;

      setComments((verificationComments || []).map((comment: any) => ({
        ...comment,
        profiles: typeof comment.profiles === 'string' 
          ? JSON.parse(comment.profiles) 
          : comment.profiles
      })));
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      setComments([]); // Fallback pour éviter les erreurs
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim() || !userProfile) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('symbol_verification_community' as any)
        .insert({
          symbol_id: symbol.id,
          user_id: userProfile.id,
          comment: newComment.trim(),
          verification_rating: selectedRating,
          expertise_level: userProfile.is_admin ? 'admin' : 'community'
        });

      if (error) throw error;

      setNewComment('');
      toast.success('Commentaire ajouté avec succès');
      loadCommunityComments();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setSubmitting(false);
    }
  };

  const reportComment = async (commentId: string, commentText: string) => {
    if (!userProfile?.id) {
      toast.error("Vous devez être connecté pour signaler un commentaire");
      return;
    }

    try {
        const { error } = await supabase
          .from('symbol_moderation_items')
          .insert({
            symbol_id: symbol.id,
            item_type: 'comment',
            content: commentText,
            reported_by: userProfile.id,
            reported_count: 1,
            status: 'pending'
          });

      if (error) throw error;

      // Créer une notification immédiate pour l'utilisateur en utilisant le bon format
      await supabase
        .from('notifications')
        .insert({
          user_id: userProfile.id,
          type: 'system',
          content: {
            title: 'Signalement enregistré',
            message: 'Votre signalement a été transmis à nos modérateurs. Nous vous tiendrons informé du traitement.',
            action_url: '/profile/reports',
            entity_id: symbol.id,
            entity_type: 'symbol'
          }
        });

      toast.success("Commentaire signalé pour modération");
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast.error("Erreur lors du signalement du commentaire");
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!userProfile?.is_admin) {
      toast.error("Action réservée aux administrateurs");
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('symbol_verification_community' as any)
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast.success("Commentaire supprimé avec succès");
      loadCommunityComments();
      
      // Marquer les signalements liés comme traités
      await supabase
        .from('symbol_moderation_items')
        .update({ 
          status: 'rejected',
          reviewed_by: userProfile.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('symbol_id', symbol.id)
        .eq('item_type', 'comment')
        .eq('status', 'pending');
        
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'disputed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'unverified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unverified':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié';
      case 'disputed':
        return 'Contesté';
      case 'unverified':
        return 'Non vérifié';
      default:
        return 'Inconnu';
    }
  };

  // Calculer les statistiques communautaires
  const communityStats = {
    verified: comments.filter(c => c.verification_rating === 'verified').length,
    disputed: comments.filter(c => c.verification_rating === 'disputed').length,
    unverified: comments.filter(c => c.verification_rating === 'unverified').length,
    total: comments.length
  };

  const isAdmin = userProfile?.is_admin;

  if (!isAdmin) {
    return (
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Cette section est réservée aux administrateurs pour la vérification communautaire des symboles.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Vérification communautaire
        </h3>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Administrateurs uniquement
        </Badge>
      </div>

      {/* Statistiques communautaires */}
      {comments.length > 0 && (
        <Card className="p-6">
          <h4 className="font-medium text-slate-900 mb-4">Consensus communautaire</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {communityStats.verified}
              </div>
              <div className="text-sm text-green-700">Vérifiées</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {communityStats.disputed}
              </div>
              <div className="text-sm text-yellow-700">Contestées</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {communityStats.unverified}
              </div>
              <div className="text-sm text-red-700">Non vérifiées</div>
            </div>
          </div>
        </Card>
      )}

      {/* Formulaire d'ajout de commentaire */}
      {commentsDisabled ? (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Les commentaires sont temporairement désactivés par l'administration.
          </AlertDescription>
        </Alert>
      ) : (
        <Card className="p-6">
          <h4 className="font-medium text-slate-900 mb-4">Ajouter une évaluation</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Votre évaluation
              </label>
              <div className="flex gap-2">
                {[
                  { value: 'verified', label: 'Vérifié', color: 'green' },
                  { value: 'disputed', label: 'Contesté', color: 'yellow' },
                  { value: 'unverified', label: 'Non vérifié', color: 'red' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedRating(option.value as any)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                      selectedRating === option.value 
                        ? getStatusColor(option.value)
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {getStatusIcon(option.value)}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Commentaire détaillé
              </label>
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Expliquez votre évaluation en détail, mentionnez vos sources ou références..."
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={submitComment}
              disabled={!newComment.trim() || submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <Clock className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publier l'évaluation
            </Button>
          </div>
        </Card>
      )}

      {/* Liste des commentaires */}
      <div className="space-y-4">
        <h4 className="font-medium text-slate-900">Évaluations de la communauté ({comments.length})</h4>
        
        {comments.length === 0 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Aucune évaluation communautaire pour ce symbole. Soyez le premier à contribuer !
            </AlertDescription>
          </Alert>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="font-medium text-slate-900">
                      {comment.profiles?.full_name || comment.profiles?.username || 'Utilisateur'}
                    </span>
                    {comment.profiles?.is_admin && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(comment.verification_rating)}>
                    {getStatusIcon(comment.verification_rating)}
                    <span className="ml-1">{getStatusText(comment.verification_rating)}</span>
                  </Badge>
                </div>
              </div>
              
              <p className="text-slate-700 whitespace-pre-wrap mb-3">
                {comment.comment}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(comment.created_at).toLocaleString('fr-FR')}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => reportComment(comment.id, comment.comment)}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                  >
                    <Flag className="h-3 w-3" />
                    Signaler
                  </Button>
                  
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteComment(comment.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};