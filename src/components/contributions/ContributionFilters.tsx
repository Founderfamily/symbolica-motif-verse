
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Calendar, Tag, Globe } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

interface ContributionFiltersProps {
  onFiltersChange: (filters: ContributionFiltersState) => void;
  cultures: string[];
  periods: string[];
}

export interface ContributionFiltersState {
  search: string;
  status: string;
  culture: string;
  period: string;
  dateRange: string;
  tags: string[];
}

const ContributionFilters: React.FC<ContributionFiltersProps> = ({
  onFiltersChange,
  cultures,
  periods
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<ContributionFiltersState>({
    search: '',
    status: 'all',
    culture: 'all',
    period: 'all',
    dateRange: 'all',
    tags: []
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilters = (newFilters: Partial<ContributionFiltersState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: ContributionFiltersState = {
      search: '',
      status: 'all',
      culture: 'all',
      period: 'all',
      dateRange: 'all',
      tags: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || 
    filters.status !== 'all' || 
    filters.culture !== 'all' || 
    filters.period !== 'all' || 
    filters.dateRange !== 'all' ||
    filters.tags.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de recherche
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                Effacer
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Étendre'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos contributions..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters.status === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ status: filters.status === 'pending' ? 'all' : 'pending' })}
          >
            En attente
          </Button>
          <Button
            variant={filters.status === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ status: filters.status === 'approved' ? 'all' : 'approved' })}
          >
            Approuvées
          </Button>
          <Button
            variant={filters.status === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => updateFilters({ status: filters.status === 'rejected' ? 'all' : 'rejected' })}
          >
            Rejetées
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Culture
              </label>
              <Select value={filters.culture} onValueChange={(value) => updateFilters({ culture: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les cultures" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les cultures</SelectItem>
                  {cultures.map((culture) => (
                    <SelectItem key={culture} value={culture}>
                      {culture}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Période
              </label>
              <Select value={filters.period} onValueChange={(value) => updateFilters({ period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les périodes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Date de soumission
              </label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                  <SelectItem value="year">Cette année</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.search && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Recherche: "{filters.search}"
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ search: '' })}
                />
              </Badge>
            )}
            {filters.status !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Statut: {filters.status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ status: 'all' })}
                />
              </Badge>
            )}
            {filters.culture !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Culture: {filters.culture}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => updateFilters({ culture: 'all' })}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContributionFilters;
