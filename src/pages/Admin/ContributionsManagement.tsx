
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingContributions } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useAuth } from '@/hooks/useAuth';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContributionsManagement = () => {
  const [pendingContributions, setPendingContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);
      const data = await getPendingContributions();
      setPendingContributions(data);
      setLoading(false);
    };

    if (isAdmin) {
      loadContributions();
    }
  }, [isAdmin]);

  const handleViewContribution = (id: string) => {
    navigate(`/contributions/${id}`);
  };

  if (!isAdmin) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-4">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Accès réservé</h1>
        <p className="text-muted-foreground mb-4">
          Vous devez être administrateur pour accéder à cette page.
        </p>
        <Button onClick={() => navigate('/')}>
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des contributions</h1>
          <p className="text-muted-foreground">
            Gérez les contributions soumises par les utilisateurs
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Contributions en attente ({pendingContributions.length})</CardTitle>
            <CardDescription>
              Contributions nécessitant une validation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-10 text-center">
                <p className="text-muted-foreground">Chargement des contributions...</p>
              </div>
            ) : pendingContributions.length === 0 ? (
              <div className="py-10 text-center border rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2">Aucune contribution en attente</h3>
                <p className="text-muted-foreground">
                  Toutes les contributions ont été traitées.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>Liste des contributions en attente de modération</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Soumis par</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingContributions.map((contribution) => (
                      <TableRow key={contribution.id}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {contribution.title}
                        </TableCell>
                        <TableCell>
                          {contribution.user_profile?.username || contribution.user_id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(contribution.created_at), 'dd/MM/yyyy', { locale: fr })}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {contribution.cultural_context || "Non spécifié"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewContribution(contribution.id)}
                          >
                            <Eye className="h-4 w-4" />
                            <span className="ml-1">Voir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContributionsManagement;
