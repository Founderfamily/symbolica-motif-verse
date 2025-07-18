
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Edit, Eye } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { UserContribution } from '@/types/contributions';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface MyContributionsProps {
  userId?: string;
}

const MyContributions: React.FC<MyContributionsProps> = ({ userId }) => {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadContributions();
    }
  }, [targetUserId]);

  const loadContributions = async () => {
    if (!targetUserId) return;

    try {
      setLoading(true);
      setError(null);
      
      // Simplified query without the problematic foreign key reference
      const { data, error } = await supabase
        .from('user_contributions')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des contributions:', error);
        setError('Impossible de charger les contributions');
        return;
      }
      
      setContributions(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des contributions:', error);
      setError('Une erreur est survenue lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Accepté</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusDescription = (contribution: any) => {
    if (contribution.status === 'approved') {
      return 'Votre symbole a été approuvé et ajouté à la collection.';
    }
    if (contribution.status === 'rejected') {
      return 'Votre contribution a été rejetée. Consultez les commentaires du modérateur.';
    }
    if (contribution.status === 'pending') {
      return 'Votre contribution est en cours de révision par nos modérateurs.';
    }
    return '';
  };

  const handleCreateNew = () => {
    navigate('/contributions/new');
  };

  const handleViewDetails = (contributionId: string) => {
    navigate(`/contributions/${contributionId}`);
  };

  const handleEdit = (contributionId: string) => {
    // Pour l'instant, rediriger vers la page de création
    // TODO: Implémenter une vraie page d'édition avec pré-remplissage
    navigate(`/contributions/new?edit=${contributionId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={loadContributions} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (contributions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-600 mb-4">Vous n'avez encore soumis aucun symbole.</p>
          <Button onClick={handleCreateNew}>
            <I18nText translationKey="contribute.title">Proposer un symbole</I18nText>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Mes contributions ({contributions.length})</h3>
        <Button variant="outline" size="sm" onClick={handleCreateNew}>
          Proposer un nouveau symbole
        </Button>
      </div>

      {contributions.map((contribution) => (
        <Card key={contribution.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{contribution.title}</CardTitle>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(contribution.created_at), 'dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                  {contribution.location_name && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{contribution.location_name}</span>
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(contribution.status)}
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {contribution.description && (
                <p className="text-gray-700 line-clamp-2">{contribution.description}</p>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  {getStatusDescription(contribution)}
                </div>
                
                <div className="flex items-center space-x-2">
                  {contribution.status === 'pending' && (
                    <Button variant="outline" size="sm" onClick={() => handleEdit(contribution.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(contribution.id)}>
                    <Eye className="h-4 w-4 mr-1" />
                    Voir détails
                  </Button>
                </div>
              </div>

              {contribution.status === 'rejected' && contribution.reviewed_at && (
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-800 font-medium">Commentaire du modérateur :</p>
                  <p className="text-sm text-red-700 mt-2">
                    Votre contribution nécessite des améliorations avant d'être acceptée.
                  </p>
                  <p className="text-xs text-red-600 mt-1">
                    Révisé le {format(new Date(contribution.reviewed_at), 'dd/MM/yyyy')}
                  </p>
                </div>
              )}

              {contribution.status === 'approved' && contribution.reviewed_at && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    ✅ Approuvé le {format(new Date(contribution.reviewed_at), 'dd MMMM yyyy', { locale: fr })}
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

export default MyContributions;
