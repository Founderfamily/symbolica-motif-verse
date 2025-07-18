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
  MessageSquare
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
}

export const CommunityModeration: React.FC<CommunityModerationProps> = ({ symbolId }) => {
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

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
      
      // Simuler des éléments de modération
      const mockItems: ModerationItem[] = [
        {
          id: '1',
          type: 'comment',
          content: 'Ce symbole est mal interprété, voici la vraie signification...',
          reported_count: 2,
          status: 'pending',
          created_at: new Date().toISOString(),
          reported_at: new Date().toISOString(),
          user: {
            username: 'user123',
            full_name: 'Utilisateur Actif'
          }
        },
        {
          id: '2',
          type: 'source',
          content: 'https://source-douteuse.com/symbole-fake',
          reported_count: 5,
          status: 'pending',
          created_at: new Date().toISOString(),
          reported_at: new Date().toISOString(),
          user: {
            username: 'contributor',
            full_name: 'Contributeur Pro'
          }
        }
      ];
      
      setModerationItems(mockItems);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (itemId: string, action: 'approve' | 'reject') => {
    if (!userProfile?.is_admin) {
      toast.error('Action réservée aux modérateurs');
      return;
    }

    try {
      // Mettre à jour localement
      setModerationItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' }
          : item
      ));

      toast.success(`Élément ${action === 'approve' ? 'approuvé' : 'rejeté'} avec succès`);
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
      // Mettre à jour le compteur de signalements
      setModerationItems(prev => prev.map(item => 
        item.id === itemId 
          ? { ...item, reported_count: item.reported_count + 1 }
          : item
      ));

      toast.success('Signalement envoyé');
    } catch (error) {
      console.error('Erreur lors du signalement:', error);
      toast.error('Erreur lors du signalement');
    }
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

  const pendingItems = moderationItems.filter(item => item.status === 'pending');
  const processedItems = moderationItems.filter(item => item.status !== 'pending');

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
        <Shield className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Modération communautaire
        </h3>
        {pendingItems.length > 0 && (
          <Badge variant="outline" className="bg-red-50 text-red-700">
            {pendingItems.length} en attente
          </Badge>
        )}
      </div>

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
                        >
                          <ThumbsUp className="h-4 w-4" />
                          Approuver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleModeration(item.id, 'reject')}
                          className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-4 w-4" />
                          Rejeter
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
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};