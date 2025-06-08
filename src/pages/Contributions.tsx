
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
import { Plus, Eye, FileText, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const Contributions = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContributions = async () => {
      if (!user) {
        console.log('👤 [Contributions] No user, skipping contribution loading');
        return;
      }
      
      console.log('🔄 [Contributions] Starting to load contributions for user:', user.id);
      setLoading(true);
      setError(null);

      try {
        const data = await getUserContributions(user.id);
        console.log('✅ [Contributions] Loaded contributions:', data.length);
        setContributions(data);
        setError(null);
      } catch (err) {
        console.error('❌ [Contributions] Error loading contributions:', err);
        setError('Erreur lors du chargement des contributions');
        setContributions([]);
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, [user]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">{t('contributions.status.pending', 'En attente')}</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">{t('contributions.status.approved', 'Approuvée')}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">{t('contributions.status.rejected', 'Rejetée')}</Badge>;
      default:
        return <Badge variant="outline">{t('contributions.status.unknown', 'Inconnu')}</Badge>;
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
        <div className="text-center py-16">
          <FileText className="mx-auto h-16 w-16 text-slate-400 mb-6" />
          <h1 className="text-2xl font-bold mb-4">{t('auth.loginTitle', 'Connexion requise')}</h1>
          <p className="text-slate-600 mb-6">
            Vous devez être connecté pour voir vos contributions.
          </p>
          <Button onClick={() => navigate('/auth')}>
            {t('auth.login', 'Se connecter')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">{t('contributions.title', 'Mes Contributions')}</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" /> {t('contributions.new', 'Nouvelle contribution')}
        </Button>
      </div>

      {loading ? (
        <div className="py-10">
          <div className="flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-blue-500 animate-pulse mr-3" />
            <span className="text-lg">Chargement de vos contributions...</span>
          </div>
          <Progress value={45} className="w-full" />
          <p className="text-center mt-4 text-muted-foreground">{t('contributions.loading', 'Récupération des données...')}</p>
        </div>
      ) : error ? (
        <Card className="text-center py-12 border-amber-200 bg-amber-50">
          <CardContent>
            <FileText className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-amber-900 mb-2">
              Problème de chargement
            </h3>
            <p className="text-amber-700 mb-4">
              {error}. Vos contributions seront disponibles prochainement.
            </p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : contributions.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="mx-auto h-16 w-16 text-blue-500 mb-6" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {t('contributions.empty', 'Prêt à commencer ?')}
          </h3>
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto">
            {t('contributions.emptyDescription', 'Vous n\'avez pas encore de contributions. Partagez vos découvertes de symboles et aidez à enrichir notre base de connaissances collaborative !')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-blue-900 text-lg">Partagez</p>
                  <p className="text-blue-700">Vos découvertes de symboles</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-full">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-green-900 text-lg">Collaborez</p>
                  <p className="text-green-700">Avec la communauté</p>
                </div>
              </div>
            </Card>
          </div>

          <Button onClick={handleCreateNew} size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-5 w-5" /> {t('contributions.create', 'Créer ma première contribution')}
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableCaption>{t('contributions.list', 'Liste de vos contributions')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contributions.table.title', 'Titre')}</TableHead>
                <TableHead>{t('contributions.table.submissionDate', 'Date de soumission')}</TableHead>
                <TableHead>{t('contributions.table.status', 'Statut')}</TableHead>
                <TableHead>{t('contributions.table.tags', 'Tags')}</TableHead>
                <TableHead className="text-right">{t('contributions.table.actions', 'Actions')}</TableHead>
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
