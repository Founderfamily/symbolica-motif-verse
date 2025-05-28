
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { contributionModerationService, ContributionForModeration } from '@/services/admin/contributionModerationService';
import { CheckCircle, XCircle, Clock, Eye, Trash2, Search, Filter, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const ContributionsModerationPage = () => {
  const [contributions, setContributions] = useState<ContributionForModeration[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContribution, setSelectedContribution] = useState<ContributionForModeration | null>(null);
  const [moderationReason, setModerationReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      loadContributions();
    }
  }, [isAdmin, statusFilter]);

  const loadContributions = async () => {
    try {
      setLoading(true);
      const data = await contributionModerationService.getAllContributions(statusFilter);
      setContributions(data);
    } catch (error) {
      console.error('Error loading contributions:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les contributions.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (contributionId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      await contributionModerationService.moderateContribution(
        contributionId, 
        status, 
        moderationReason
      );
      
      setContributions(prev => prev.map(contribution => 
        contribution.id === contributionId 
          ? { ...contribution, status }
          : contribution
      ));

      toast({
        title: "Modération réussie",
        description: `La contribution a été ${status === 'approved' ? 'approuvée' : status === 'rejected' ? 'rejetée' : 'remise en attente'}.`,
      });

      setSelectedContribution(null);
      setModerationReason('');
    } catch (error) {
      console.error('Error moderating contribution:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de modérer la contribution.",
      });
    }
  };

  const handleDelete = async (contributionId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette contribution ?')) {
      return;
    }

    try {
      await contributionModerationService.deleteContribution(contributionId);
      setContributions(prev => prev.filter(c => c.id !== contributionId));
      
      toast({
        title: "Contribution supprimée",
        description: "La contribution a été supprimée avec succès.",
      });
    } catch (error) {
      console.error('Error deleting contribution:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la contribution.",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejetée</Badge>;
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredContributions = contributions.filter(contribution =>
    contribution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contribution.user_profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contribution.cultural_context?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground">
          Vous devez être administrateur pour accéder à cette page.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Modération des contributions</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et modérez les contributions des utilisateurs
          </p>
        </div>
        <Button onClick={loadContributions} variant="outline" disabled={loading}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">En attente</p>
                <p className="text-2xl font-bold">
                  {contributions.filter(c => c.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Approuvées</p>
                <p className="text-2xl font-bold">
                  {contributions.filter(c => c.status === 'approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Rejetées</p>
                <p className="text-2xl font-bold">
                  {contributions.filter(c => c.status === 'rejected').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-500">Total</p>
                <p className="text-2xl font-bold">{contributions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, utilisateur ou contexte..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvées</SelectItem>
                <SelectItem value="rejected">Rejetées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table des contributions */}
      <Card>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Contexte culturel</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContributions.map((contribution) => (
                  <TableRow key={contribution.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {contribution.title}
                    </TableCell>
                    <TableCell>
                      {contribution.user_profile?.username || 'Utilisateur inconnu'}
                    </TableCell>
                    <TableCell>{getStatusBadge(contribution.status)}</TableCell>
                    <TableCell>{contribution.cultural_context || 'Non spécifié'}</TableCell>
                    <TableCell>
                      {new Date(contribution.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedContribution(contribution)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Modérer la contribution</DialogTitle>
                              <DialogDescription>
                                Examinez et modérez cette contribution
                              </DialogDescription>
                            </DialogHeader>
                            
                            {selectedContribution && (
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold">{selectedContribution.title}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Par {selectedContribution.user_profile?.username || 'Utilisateur inconnu'}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium">Description</h4>
                                  <p className="text-sm">{selectedContribution.description || 'Aucune description'}</p>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium">Contexte culturel</h4>
                                  <p className="text-sm">{selectedContribution.cultural_context || 'Non spécifié'}</p>
                                </div>
                                
                                <Textarea
                                  placeholder="Raison de la modération (optionnel)"
                                  value={moderationReason}
                                  onChange={(e) => setModerationReason(e.target.value)}
                                />
                                
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleModeration(selectedContribution.id, 'approved')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approuver
                                  </Button>
                                  <Button
                                    onClick={() => handleModeration(selectedContribution.id, 'rejected')}
                                    variant="destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rejeter
                                  </Button>
                                  <Button
                                    onClick={() => handleModeration(selectedContribution.id, 'pending')}
                                    variant="outline"
                                  >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Remettre en attente
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contribution.id)}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionsModerationPage;
