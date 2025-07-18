
import React from 'react';
import { Search, Filter, SortAsc, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { SortOption, FilterCategory, FilterStatus } from '../../hooks/useCollectionFilters';

interface CollectionControlsProps {
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  filterCategory: FilterCategory;
  setFilterCategory: (category: FilterCategory) => void;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;
  activeFiltersCount: number;
  totalResults: number;
}

export const CollectionControls: React.FC<CollectionControlsProps> = ({
  sortBy,
  setSortBy,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  resetFilters,
  activeFiltersCount,
  totalResults
}) => {
  // Handler for search input to prevent immediate state updates
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input
          placeholder="Rechercher une collection..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      {/* Controls Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-slate-600" />
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured-first">
                  <I18nText translationKey="collections.sort.featuredFirst">Vedettes d'abord</I18nText>
                </SelectItem>
                <SelectItem value="name-asc">
                  <I18nText translationKey="collections.sort.nameAsc">Nom A-Z</I18nText>
                </SelectItem>
                <SelectItem value="name-desc">
                  <I18nText translationKey="collections.sort.nameDesc">Nom Z-A</I18nText>
                </SelectItem>
                <SelectItem value="date-desc">
                  <I18nText translationKey="collections.sort.dateDesc">Plus récent</I18nText>
                </SelectItem>
                <SelectItem value="date-asc">
                  <I18nText translationKey="collections.sort.dateAsc">Plus ancien</I18nText>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <Select value={filterCategory} onValueChange={(value: FilterCategory) => setFilterCategory(value)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <I18nText translationKey="collections.filters.allCategories">Toutes</I18nText>
                </SelectItem>
                <SelectItem value="ancient">
                  <I18nText translationKey="categories.ancient">Civilisations Antiques</I18nText>
                </SelectItem>
                <SelectItem value="asian">
                  <I18nText translationKey="categories.asian">Traditions Asiatiques</I18nText>
                </SelectItem>
                <SelectItem value="european">
                  <I18nText translationKey="categories.european">Héritages Européens</I18nText>
                </SelectItem>
                <SelectItem value="middle-eastern">
                  <I18nText translationKey="categories.middleEastern">Proche-Orient</I18nText>
                </SelectItem>
                <SelectItem value="others">
                  <I18nText translationKey="categories.others">Autres</I18nText>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <I18nText translationKey="collections.filters.allStatus">Toutes</I18nText>
              </SelectItem>
              <SelectItem value="featured">
                <I18nText translationKey="collections.filters.featured">Vedettes</I18nText>
              </SelectItem>
              <SelectItem value="regular">
                <I18nText translationKey="collections.filters.regular">Régulières</I18nText>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <I18nText translationKey="collections.filters.reset">Réinitialiser</I18nText>
            </Button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {totalResults} <I18nText translationKey="collections.results">résultat(s)</I18nText>
          </Badge>
          {activeFiltersCount > 0 && (
            <Badge variant="outline">
              {activeFiltersCount} <I18nText translationKey="collections.activeFilters">filtre(s) actif(s)</I18nText>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};
