
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { contributionModerationService, ContributionForModeration } from '@/services/admin/contributionModerationService';
import { useToast } from '@/hooks/use-toast';

const ContributionsModerationPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [contributions, setContributions] = useState<ContributionForModeration[]>([]);
  const [loading, setLoading] = useState(true);

  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    loadContributions();
  }, [activeTab]);

  const loadContributions = async () => {
    try {
      setLoading(true);
      let data: ContributionForModeration[];
      
      if (activeTab === 'pending') {
        data = await contributionModerationService.getPendingContributions();
      } else {
        data = await contributionModerationService.getAllContributions(activeTab);
      }
      
      setContributions(data);
    } catch (error) {
      console.error('Error loading contributions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les contributions",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (contributionId: string, status: 'approved' | 'rejected') => {
    try {
      await contributionModerationService.moderateContribution(contributionId, status);
      toast({
        title: "Succès",
        description: `Contribution ${status === 'approved' ? 'approuvée' : 'rejetée'} avec succès`,
      });
      loadContributions();
    } catch (error) {
      console.error('Error moderating contribution:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modération",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (contributionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette contribution ?')) {
      return;
    }
    
    try {
      await contributionModerationService.deleteContribution(contributionId);
      toast({
        title: "Succès",
        description: "Contribution supprimée avec succès",
      });
      loadContributions();
    } catch (error) {
      console.error('Error deleting contribution:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression",
        variant: "destructive"
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-amber-500" />;
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status === 'pending' && 'En attente'}
        {status === 'approved' && 'Approuvée'}
        {status === 'rejected' && 'Rejetée'}
      </Badge>
    );
  };

  const ContributionCard = ({ contribution }: { contribution: ContributionForModeration }) => (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{contribution.title}</h3>
        {getStatusBadge(contribution.status)}
      </div>
      <p className="text-sm text-slate-600 mb-2">
        Par {contribution.user_profile?.username || contribution.user_profile?.full_name || 'Utilisateur anonyme'} 
        • {new Date(contribution.created_at).toLocaleDateString()}
      </p>
      {contribution.description && (
        <p className="text-slate-700 mb-2 line-clamp-3">{contribution.description}</p>
      )}
      {contribution.cultural_context && (
        <p className="text-sm text-slate-500 mb-2">Culture: {contribution.cultural_context}</p>
      )}
      {contribution.location_name && (
        <p className="text-sm text-slate-500 mb-4">Lieu: {contribution.location_name}</p>
      )}
      <div className="flex gap-2 flex-wrap">
        {contribution.status === 'pending' && (
          <>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => handleModeration(contribution.id, 'approved')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approuver
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleModeration(contribution.id, 'rejected')}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Rejeter
            </Button>
          </>
        )}
        <Button size="sm" variant="outline">
          <Eye className="h-4 w-4 mr-1" />
          Voir détails
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => handleDelete(contribution.id)}
          className="text-red-600 hover:text-red-700"
        >
          Supprimer
        </Button>
      </div>
    </div>
  );

  const getFilteredContributions = () => {
    switch (activeTab) {
      case 'pending':
        return contributions.filter(c => c.status === 'pending');
      case 'approved':
        return contributions.filter(c => c.status === 'approved');
      case 'rejected':
        return contributions.filter(c => c.status === 'rejected');
      default:
        return contributions;
    }
  };

  const filteredContributions = getFilteredContributions();
  const pendingCount = contributions.filter(c => c.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Modération des Contributions
          </h1>
          <p className="text-slate-600 mt-2">
            Gérez et modérez les contributions soumises par la communauté.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">
              En attente {pendingCount > 0 && `(${pendingCount})`}
            </TabsTrigger>
            <TabsTrigger value="approved">Approuvées</TabsTrigger>
            <TabsTrigger value="rejected">Rejetées</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Contributions en attente de modération ({filteredContributions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-slate-600">Chargement...</div>
                  </div>
                ) : filteredContributions.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    Aucune contribution en attente de modération.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContributions.map(contribution => (
                      <ContributionCard key={contribution.id} contribution={contribution} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Contributions approuvées ({filteredContributions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-slate-600">Chargement...</div>
                  </div>
                ) : filteredContributions.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    Aucune contribution approuvée.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContributions.map(contribution => (
                      <ContributionCard key={contribution.id} contribution={contribution} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rejected">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Contributions rejetées ({filteredContributions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="text-slate-600">Chargement...</div>
                  </div>
                ) : filteredContributions.length === 0 ? (
                  <div className="text-center py-8 text-slate-600">
                    Aucune contribution rejetée.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredContributions.map(contribution => (
                      <ContributionCard key={contribution.id} contribution={contribution} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContributionsModerationPage;
