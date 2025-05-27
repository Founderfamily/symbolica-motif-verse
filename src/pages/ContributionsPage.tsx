
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CompleteContribution } from '@/types/contributions';
import { getUserContributions } from '@/services/contributionService';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Plus, Eye, Grid, List, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import ContributionStats from '@/components/contributions/ContributionStats';
import ContributionFilters, { ContributionFilters } from '@/components/contributions/ContributionFilters';
import ContributionGridView from '@/components/contributions/ContributionGridView';

const ContributionsPage = () => {
  const { user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  useEffect(() => {
    const loadContributions = async () => {
      if (!user) return;
      
      setLoading(true);
      const data = await getUserContributions(user.id);
      setContributions(data);
      setFilteredContributions(data);
      setLoading(false);
    };

    loadContributions();
  }, [user]);

  const handleFiltersChange = (filters: ContributionFilters) => {
    let filtered = [...contributions];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(contribution =>
        contribution.title.toLowerCase().includes(searchLower) ||
        contribution.description?.toLowerCase().includes(searchLower) ||
        contribution.cultural_context?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(contribution => contribution.status === filters.status);
    }

    // Culture filter
    if (filters.culture !== 'all') {
      filtered = filtered.filter(contribution => contribution.cultural_context === filters.culture);
    }

    // Period filter
    if (filters.period !== 'all') {
      filtered = filtered.filter(contribution => contribution.period === filters.period);
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(contribution => 
        new Date(contribution.created_at) >= filterDate
      );
    }

    setFilteredContributions(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-300">{t('contributions.status.pending')}</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-800 border-green-300">{t('contributions.status.approved')}</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-800 border-red-300">{t('contributions.status.rejected')}</Badge>;
      default:
        return <Badge variant="outline">{t('contributions.status.unknown')}</Badge>;
    }
  };

  const handleCreateNew = () => {
    navigate('/contribute');
  };

  const handleViewDetail = (id: string) => {
    navigate(`/contributions/${id}`);
  };

  // Extract unique cultures and periods for filters
  const cultures = [...new Set(contributions.map(c => c.cultural_context).filter(Boolean))];
  const periods = [...new Set(contributions.map(c => c.period).filter(Boolean))];

  if (!user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">{t('auth.loginTitle')}</h1>
        <Button onClick={() => navigate('/auth')}>{t('auth.login')}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{t('contributions.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Gérez et suivez toutes vos contributions
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> {t('contributions.new')}
        </Button>
      </div>

      {loading ? (
        <div className="py-10">
          <Progress value={45} className="w-full" />
          <p className="text-center mt-4 text-muted-foreground">{t('contributions.loading')}</p>
        </div>
      ) : (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Vue d'ensemble
            </TabsTrigger>
            <TabsTrigger value="contributions" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Mes contributions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <ContributionStats contributions={contributions} />
            
            {contributions.length === 0 ? (
              <div className="text-center py-10 border rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2">{t('contributions.empty')}</h3>
                <p className="text-muted-foreground mb-4">
                  {t('contributions.emptyDescription')}
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" /> {t('contributions.create')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contributions récentes</h3>
                <ContributionGridView
                  contributions={contributions.slice(0, 6)}
                  onViewDetail={handleViewDetail}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="contributions" className="space-y-6">
            <ContributionFilters
              onFiltersChange={handleFiltersChange}
              cultures={cultures}
              periods={periods}
            />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredContributions.length} {t('contributions.results')}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <ContributionGridView
                contributions={filteredContributions}
                onViewDetail={handleViewDetail}
              />
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{t('contributions.list')}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('contributions.table.title')}</TableHead>
                      <TableHead>{t('contributions.table.submissionDate')}</TableHead>
                      <TableHead>{t('contributions.table.status')}</TableHead>
                      <TableHead>{t('contributions.table.tags')}</TableHead>
                      <TableHead className="text-right">{t('contributions.table.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContributions.map((contribution) => (
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
          </TabsContent>

          <TabsContent value="analytics">
            <ContributionStats contributions={contributions} />
            {/* Additional analytics components can be added here */}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ContributionsPage;
