
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CompleteContribution } from '@/types/contributions';
import { getUserContributions } from '@/services/contributionService';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Plus, Eye, BarChart2, Map } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Contributions = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadContributions = async () => {
      if (!user) return;
      
      setLoading(true);
      const data = await getUserContributions(user.id);
      setContributions(data);
      setLoading(false);
    };

    loadContributions();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">Approuvé</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">Rejeté</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleCreateNew = () => {
    navigate('/contributions/new');
  };

  const handleViewDetail = (id: string) => {
    navigate(`/contributions/${id}`);
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Vous devez être connecté pour voir vos contributions</h1>
        <Button onClick={() => navigate('/auth')}>Se connecter</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Mes Contributions</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle contribution
        </Button>
      </div>

      {loading ? (
        <div className="py-10">
          <Progress value={45} className="w-full" />
          <p className="text-center mt-4 text-muted-foreground">Chargement des contributions...</p>
        </div>
      ) : contributions.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-medium mb-2">Aucune contribution trouvée</h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore soumis de contribution. Commencez par en créer une nouvelle.
          </p>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" /> Créer ma première contribution
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>Liste de vos contributions au projet Symbolica</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Date de soumission</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell className="font-medium">{contribution.title}</TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(contribution.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(contribution.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contribution.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag.id} variant="secondary" className="text-xs">
                          {tag.tag}
                        </Badge>
                      ))}
                      {contribution.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{contribution.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetail(contribution.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Contributions;
