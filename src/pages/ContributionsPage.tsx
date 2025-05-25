
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { CompleteContribution } from '@/types/contributions';
import { getApprovedContributions } from '@/services/contributionService';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Search, Filter, Plus, Eye, MapPin, Calendar, Palette } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ITEMS_PER_PAGE = 12;

const ContributionsPage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cultureFilter, setCultureFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);
      try {
        const data = await getApprovedContributions();
        setContributions(data);
        setFilteredContributions(data);
      } catch (error) {
        console.error('Error loading contributions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContributions();
  }, []);

  useEffect(() => {
    let filtered = [...contributions];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(contribution =>
        contribution.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contribution.description && contribution.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by culture
    if (cultureFilter && cultureFilter !== 'all') {
      filtered = filtered.filter(contribution => contribution.cultural_context === cultureFilter);
    }

    // Filter by period
    if (periodFilter && periodFilter !== 'all') {
      filtered = filtered.filter(contribution => contribution.period === periodFilter);
    }

    setFilteredContributions(filtered);
    setCurrentPage(1);
  }, [contributions, searchQuery, cultureFilter, periodFilter]);

  const totalPages = Math.ceil(filteredContributions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContributions = filteredContributions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const uniqueCultures = Array.from(new Set(contributions.map(c => c.cultural_context).filter(Boolean)));
  const uniquePeriods = Array.from(new Set(contributions.map(c => c.period).filter(Boolean)));

  const handleViewContribution = (id: string) => {
    navigate(`/contributions/${id}`);
  };

  const handleCreateContribution = () => {
    navigate('/contribute');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={`skeleton-${i}`}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-40 w-full mb-4" />
                <Skeleton className="h-3 w-full mb-2" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <I18nText translationKey="contributions.title" />
          </h1>
          <p className="text-muted-foreground">
            <I18nText translationKey="contributions.communityContributions" />
          </p>
        </div>
        {user && (
          <Button onClick={handleCreateContribution}>
            <Plus className="mr-2 h-4 w-4" />
            <I18nText translationKey="contributions.newContribution" />
          </Button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('contributions.search.placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={cultureFilter} onValueChange={setCultureFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t('contributions.filters.culture')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="culture-all" value="all">
              <I18nText translationKey="contributions.filters.allCultures" />
            </SelectItem>
            {uniqueCultures.map(culture => (
              <SelectItem key={`culture-${culture}`} value={culture}>
                {culture}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={periodFilter} onValueChange={setPeriodFilter}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t('contributions.filters.period')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="period-all" value="all">
              <I18nText translationKey="contributions.filters.allPeriods" />
            </SelectItem>
            {uniquePeriods.map(period => (
              <SelectItem key={`period-${period}`} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {filteredContributions.length} {t('contributions.results')}
        </p>
      </div>

      {/* Contributions Grid */}
      {filteredContributions.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-slate-50">
          <h3 className="text-lg font-medium mb-2">
            <I18nText translationKey="contributions.empty" />
          </h3>
          <p className="text-muted-foreground mb-4">
            <I18nText translationKey="contributions.emptyDescription" />
          </p>
          {user && (
            <Button onClick={handleCreateContribution}>
              <Plus className="mr-2 h-4 w-4" />
              <I18nText translationKey="contributions.create" />
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedContributions.map((contribution) => (
              <Card key={contribution.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{contribution.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(contribution.created_at), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  {contribution.images.length > 0 && (
                    <div className="mb-4">
                      <img
                        src={contribution.images[0].image_url}
                        alt={contribution.title}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    </div>
                  )}
                  
                  {contribution.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {contribution.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {contribution.cultural_context && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Palette className="mr-1 h-3 w-3" />
                        {contribution.cultural_context}
                      </div>
                    )}
                    {contribution.period && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="mr-1 h-3 w-3" />
                        {contribution.period}
                      </div>
                    )}
                    {contribution.location_name && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="mr-1 h-3 w-3" />
                        {contribution.location_name}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {contribution.tags.slice(0, 3).map((tag) => (
                      <Badge key={`${contribution.id}-tag-${tag.id}`} variant="secondary" className="text-xs">
                        {tag.tag}
                      </Badge>
                    ))}
                    {contribution.tags.length > 3 && (
                      <Badge key={`${contribution.id}-more-tags`} variant="secondary" className="text-xs">
                        +{contribution.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewContribution(contribution.id)}
                    className="w-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <I18nText translationKey="contributions.viewContribution" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={`page-${page}`}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {totalPages > 5 && (
                  <PaginationItem key="ellipsis">
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default ContributionsPage;
