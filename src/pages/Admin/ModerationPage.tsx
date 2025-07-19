
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { Check, X, Flag, AlertTriangle, Eye, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface ModerationItem {
  id: string;
  item_type: string;
  item_id: string;
  reason: string;
  evidence_url?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  reported_by: string;
  reviewed_by?: string;
  reviewed_at?: string;
  resolution_notes?: string;
  profiles?: {
    username: string;
    full_name: string;
  };
}

export default function ModerationPage() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (isAdmin) {
      loadModerationItems();
    }
  }, [isAdmin]);

  const loadModerationItems = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('symbol_moderation_items')
        .select(`
          *,
          profiles!symbol_moderation_items_reported_by_fkey (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des signalements:', error);
        toast.error('Erreur lors du chargement des signalements');
        return;
      }

      setModerationItems(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleModerationAction = async (itemId: string, action: 'approve' | 'reject', notes?: string) => {
    if (!user || !isAdmin) {
      toast.error('Action non autorisée');
      return;
    }

    try {
      const { error } = await supabase
        .from('symbol_moderation_items')
        .update({
          status: action === 'approve' ? 'resolved' : 'dismissed',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          resolution_notes: notes || null
        })
        .eq('id', itemId);

      if (error) throw error;

      // Recharger les données
      await loadModerationItems();
      
      toast.success(
        action === 'approve' 
          ? 'Signalement approuvé' 
          : 'Signalement rejeté'
      );
    } catch (error) {
      console.error('Erreur lors de la modération:', error);
      toast.error('Erreur lors de la modération');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!user || !isAdmin) {
      toast.error('Action non autorisée');
      return;
    }

    if (!window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce signalement ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('symbol_moderation_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      await loadModerationItems();
      toast.success('Signalement supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">En attente</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-600">Résolu</Badge>;
      case 'dismissed':
        return <Badge variant="destructive">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const getItemTypeLabel = (type: string) => {
    switch (type) {
      case 'comment':
        return 'Commentaire';
      case 'source':
        return 'Source';
      case 'verification':
        return 'Vérification';
      default:
        return type;
    }
  };

  const filterItems = (status: string) => {
    if (status === 'all') return moderationItems;
    if (status === 'resolved') return moderationItems.filter(item => item.status === 'resolved');
    if (status === 'dismissed') return moderationItems.filter(item => item.status === 'dismissed');
    return moderationItems.filter(item => item.status === 'pending');
  };

  const pendingCount = moderationItems.filter(item => item.status === 'pending').length;
  const resolvedCount = moderationItems.filter(item => item.status === 'resolved').length;
  const dismissedCount = moderationItems.filter(item => item.status === 'dismissed').length;

  if (!isAdmin) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600">Accès non autorisé</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <p className="text-slate-600 ml-3">Chargement des signalements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          Modération des signalements
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">En attente</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Résolus</p>
                <p className="text-2xl font-bold">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <X className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Rejetés</p>
                <p className="text-2xl font-bold">{dismissedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Items */}
      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">
                En attente ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Résolus ({resolvedCount})
              </TabsTrigger>
              <TabsTrigger value="dismissed">
                Rejetés ({dismissedCount})
              </TabsTrigger>
            </TabsList>

            {['pending', 'resolved', 'dismissed'].map((status) => (
              <TabsContent key={status} value={status}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Raison</TableHead>
                      <TableHead>Signalé par</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterItems(status).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge variant="outline">
                            {getItemTypeLabel(item.item_type)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {item.reason}
                          </div>
                        </TableCell>
                        <TableCell>
                          {item.profiles?.full_name || item.profiles?.username || 'Utilisateur inconnu'}
                        </TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell>
                          {new Date(item.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {item.status === 'pending' && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleModerationAction(item.id, 'approve')}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleModerationAction(item.id, 'reject')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {item.evidence_url && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => window.open(item.evidence_url, '_blank')}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {filterItems(status).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-500">
                      Aucun signalement {status === 'pending' ? 'en attente' : status === 'resolved' ? 'résolu' : 'rejeté'}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
