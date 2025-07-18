import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Flag, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Eye,
  ThumbsUp,
  ThumbsDown,
  User,
  Clock,
  MessageSquare,
  Trash2,
  Filter,
  Search,
  Ban,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ModerationItem {
  id: string;
  type: 'comment' | 'source' | 'symbol_info';
  content: string;
  reported_count: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reported_at?: string;
  user: {
    username: string;
    full_name: string;
  };
}

interface CommunityModerationProps {
  symbolId: string;
  onCommentsDisabledChange?: (disabled: boolean) => void;
}

export const CommunityModeration: React.FC<CommunityModerationProps> = ({ symbolId, onCommentsDisabledChange }) => {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [commentsDisabled, setCommentsDisabled] = useState(false);

  useEffect(() => {
    checkUser();
    loadModerationItems();
  }, [symbolId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(profile);
    }
  };

  const loadModerationItems = async () => {
    try {
      setLoading(true);
      
      // Récupérer les éléments de modération depuis la base de données
      const { data: moderationData, error } = await supabase
        .from('symbol_moderation_items')
        .select(`
          *,
          profiles!symbol_moderation_items_reported_by_fkey (
            username,
            full_name
          )
        `)
        .eq('symbol_id', symbolId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des éléments de modération:', error);
        setModerationItems([]);
        return;
      }

      // Mapper les données pour correspondre à l'interface
      const mappedItems = moderationData.map(item => ({
        id: item.id,
        type: item.item_type as 'comment' | 'source' | 'symbol_info',
        content: item.content,
        reported_count: item.reported_count,
        status: item.status as 'pending' | 'approved' | 'rejected',
        created_at: item.created_at,
        reported_at: item.created_at,
        user: {
          username: item.profiles?.username || 'Utilisateur anonyme',
          full_name: item.profiles?.full_name || 'Utilisateur anonyme'
        }
      }));
      
      setModerationItems(mappedItems);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      setModerationItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (itemId: string, action: 'approve' | 'reject') => {
    if (!userProfile?.is_admin) {
      toast.error('Action réservée aux modérateurs');
      return;
    }

    // Confirmation pour l'approbation qui va supprimer le contenu
    if (action === 'approve') {
      const confirmed = window.confirm(
        "Approuver ce signalement va supprimer définitivement le commentaire original. Voulez-vous continuer ?"
      );
      if (!confirmed) return;
    }

    try {
      const currentItem = moderationItems.find(item => item.id === itemId);
      if (!currentItem) {
        toast.error('Élément non trouvé');
        return;
      }

      // Si on approuve un signalement de commentaire, supprimer le commentaire original
      if (action === 'approve' && currentItem.type === 'comment') {
        // Supprimer le commentaire de la table symbol_verification_community
        const { error: deleteCommentError } = await supabase
          .from('symbol_verification_community')
          .delete()
          .eq('comment', currentItem.content)
          .eq('symbol_id', symbolId);

        if (deleteCommentError) {
          console.error('Erreur lors de la suppression du commentaire:', deleteCommentError);
          // Continuer même si la suppression échoue pour au moins marquer le signalement
        }
      }

      // Mettre à jour le statut du signalement
      const { error } = await supabase
        .from('symbol_moderation_items')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', itemId);

      if (error) throw error;

      // Recharger les données
      await loadModerationItems();
      
      if (action === 'approve') {
        toast.success('Signalement approuvé et contenu supprimé');
      } else {
        toast.success('Signalement rejeté - le contenu reste visible');
      }
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
      toast.error('Erreur lors de la modération');
    }
  };

  const reportItem = async (itemId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour signaler');
      return;
    }

    try {
      // Trouver l'élément actuel pour incrémenter le compteur
      const currentItem = moderationItems.find(item => item.id === itemId);
      if (!currentItem) {
        toast.error('Élément non trouvé');
        return;
      }

      // Mettre à jour directement le compteur de signalements
      const { error } = await supabase
        .from('symbol_moderation_items')
        .update({
          reported_count: currentItem.reported_count + 1
        })
        .eq('id', itemId);

      if (error) throw error;

      // Recharger les données
      await loadModerationItems();
      toast.success('Signalement envoyé');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast.error('Erreur lors du signalement');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!userProfile?.is_admin) {
      toast.error('Action réservée aux administrateurs');
      return;
    }

    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cet élément ?")) {
      return;
    }

    try {
      const { error } = await supabase
        .from('symbol_moderation_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await loadModerationItems();
      toast.success('Élément supprimé définitivement');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const clearProcessedHistory = async () => {
    if (!userProfile?.is_admin) {
      toast.error('Action réservée aux administrateurs');
      return;
    }

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir supprimer tout l'historique des signalements traités ? Cette action est irréversible."
    );
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('symbol_moderation_items')
        .delete()
        .eq('symbol_id', symbolId)
        .in('status', ['approved', 'rejected']);

      if (error) throw error;

      await loadModerationItems();
      toast.success('Historique supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'historique:', error);
      toast.error('Erreur lors de la suppression de l\'historique');
    }
  };

  const toggleCommentsAccess = async () => {
    if (!userProfile?.is_admin) {
      toast.error('Action réservée aux administrateurs');
      return;
    }

    const newStatus = !commentsDisabled;
    setCommentsDisabled(newStatus);
    
    // Notifier le composant parent du changement
    onCommentsDisabledChange?.(newStatus);
    
    toast.success(
      newStatus 
        ? 'Commentaires désactivés temporairement' 
        : 'Commentaires réactivés'
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'source':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const filteredItems = moderationItems.filter(item => 
    filterType === 'all' || item.type === filterType
  );
  
  const pendingItems = filteredItems.filter(item => item.status === 'pending');
  const processedItems = filteredItems.filter(item => item.status !== 'pending');

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">
            Modération communautaire
          </h3>
          {pendingItems.length > 0 && (
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {pendingItems.length} en attente
            </Badge>
          )}
          {commentsDisabled && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700">
              <Ban className="h-3 w-3 mr-1" />
              Commentaires désactivés
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="comment">Commentaires</option>
            <option value="source">Sources</option>
            <option value="symbol_info">Informations</option>
          </select>
        </div>
      </div>

      {/* Panneau d'administration */}
      {userProfile?.is_admin && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-blue-900">Administration</h4>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleCommentsAccess}
                className={`flex items-center gap-1 ${
                  commentsDisabled 
                    ? 'text-green-600 border-green-300 hover:bg-green-50' 
                    : 'text-orange-600 border-orange-300 hover:bg-orange-50'
                }`}
              >
                {commentsDisabled ? (
                  <RotateCcw className="h-4 w-4" />
                ) : (
                  <Ban className="h-4 w-4" />
                )}
                {commentsDisabled ? 'Réactiver commentaires' : 'Désactiver commentaires'}
              </Button>
              {processedItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearProcessedHistory}
                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Vider l'historique
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            En attente ({pendingItems.length})
          </TabsTrigger>
          <TabsTrigger value="processed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Traités ({processedItems.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingItems.length === 0 ? (
            <Card className="p-8 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-slate-600">Aucun élément en attente de modération</p>
            </Card>
          ) : (
            pendingItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <Badge variant="outline">
                      {item.type === 'comment' ? 'Commentaire' : 
                       item.type === 'source' ? 'Source' : 'Information'}
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      <Flag className="h-3 w-3 mr-1" />
                      {item.reported_count} signalement{item.reported_count > 1 ? 's' : ''}
                    </Badge>
                  </div>
                  
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">En attente</span>
                  </Badge>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                  <p className="text-slate-700">{item.content}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.user.full_name || item.user.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!userProfile?.is_admin ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reportItem(item.id)}
                        className="flex items-center gap-1"
                      >
                        <Flag className="h-4 w-4" />
                        Signaler
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleModeration(item.id, 'approve')}
                          className="flex items-center gap-1 text-green-600 border-green-300 hover:bg-green-50"
                          title="Approuver le signalement et supprimer le contenu"
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Approuver & Supprimer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleModeration(item.id, 'reject')}
                          className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                          title="Rejeter le signalement (garder le contenu)"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Rejeter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="flex items-center gap-1 text-red-700 border-red-400 hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                          Supprimer
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="processed" className="space-y-4">
          {processedItems.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-slate-600">Aucun élément traité pour ce symbole</p>
            </Card>
          ) : (
            processedItems.map((item) => (
              <Card key={item.id} className="p-4 opacity-75">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <Badge variant="outline">
                      {item.type === 'comment' ? 'Commentaire' : 
                       item.type === 'source' ? 'Source' : 'Information'}
                    </Badge>
                  </div>
                  
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">
                      {item.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                    </span>
                  </Badge>
                </div>
                
                <div className="bg-slate-50 p-3 rounded-lg mb-3">
                  <p className="text-slate-700">{item.content}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.user.full_name || item.user.username}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(item.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>

                  {userProfile?.is_admin && item.status === 'rejected' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItem(item.id)}
                      className="flex items-center gap-1 text-red-700 border-red-400 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer définitivement
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};