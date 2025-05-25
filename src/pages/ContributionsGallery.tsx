
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedContributions } from '@/services/contributionService';
import { CompleteContribution } from '@/types/contributions';
import { useTranslation } from '@/i18n/useTranslation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Calendar, 
  User, 
  Eye,
  Grid,
  List 
} from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ContributionsGallery = () => {
  const [contributions, setContributions] = useState<CompleteContribution[]>([]);
  const [filteredContributions, setFilteredContributions] = useState<CompleteContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [cultureFilter, setCultureFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadContributions = async () => {
      setLoading(true);
      const data = await getApprovedContributions();
      setContributions(data);
      setFilteredContributions(data);
      setLoading(false);
    };

    loadContributions();
  }, []);

  // Filtrer les contributions
  useEffect(() => {
    let filtered = contributions;

    if (searchTerm) {
      filtered = filtered.filter(contribution =>
        contribution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contribution.tags.some(tag => tag.tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (cultureFilter !== 'all') {
      filtered = filtered.filter(contribution =>
        contribution.cultural_context?.toLowerCase() === cultureFilter.toLowerCase()
      );
    }

    if (periodFilter !== 'all') {
      filtered = filtered.filter(contribution =>
        contribution.period?.toLowerCase() === periodFilter.toLowerCase()
      );
    }

    setFilteredContributions(filtered);
  }, [searchTerm, cultureFilter, periodFilter, contributions]);

  // Extraire les valeurs uniques pour les filtres
  const cultures = Array.from(new Set(
    contributions
      .map(c => c.cultural_context)
      .filter(Boolean)
  )).sort();

  const periods = Array.from(new Set(
    contributions
      .map(c => c.period)
      .filter(Boolean)
  )).sort();

  const handleViewContribution = (id: string) => {
    navigate(`/contributions/${id}`);
  };

  const ContributionCard = ({ contribution }: { contribution: CompleteContribution }) => {
    const primaryImage = contribution.images.find(img => img.image_type === 'original');

    return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div onClick={() => handleViewContribution(contribution.id)}>
          {primaryImage && (
            <div className="relative">
              <img
                src={primaryImage.image_url}
                alt={contribution.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              <Button
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
                {contribution.title}
              </h3>
              {contribution.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {contribution.description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              {contribution.cultural_context && (
                <Badge variant="secondary">{contribution.cultural_context}</Badge>
              )}
              {contribution.period && (
                <Badge variant="outline">{contribution.period}</Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {contribution.user_profile?.username || 'Anonyme'}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(new Date(contribution.created_at), 'dd/MM/yyyy', { locale: fr })}
              </div>
            </div>

            {contribution.location_name && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{contribution.location_name}</span>
              </div>
            )}

            {contribution.tags.length > 0 && (
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
            )}
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      {/* En-tête */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">
          <I18nText translationKey="contributions.gallery.title" />
        </h1>
        <p className="text-muted-foreground text-lg">
          <I18nText translationKey="contributions.gallery.subtitle" />
        </p>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, description ou tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={cultureFilter} onValueChange={setCultureFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Culture" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les cultures</SelectItem>
                {cultures.map((culture) => (
                  <SelectItem key={culture} value={culture}>{culture}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              {filteredContributions.length} contribution{filteredContributions.length > 1 ? 's' : ''} trouvée{filteredContributions.length > 1 ? 's' : ''}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigate('/contributions/new')}>
              Ajouter une contribution
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Galerie */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredContributions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-medium mb-2">Aucune contribution trouvée</h3>
            <p className="text-muted-foreground mb-4">
              Essayez de modifier vos critères de recherche ou ajoutez la première contribution.
            </p>
            <Button onClick={() => navigate('/contributions/new')}>
              Ajouter une contribution
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        }>
          {filteredContributions.map((contribution) => (
            <ContributionCard key={contribution.id} contribution={contribution} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributionsGallery;
