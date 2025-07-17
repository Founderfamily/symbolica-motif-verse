
import React, { useState } from 'react';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { useAllSymbols, useSearchSymbols } from '@/hooks/useSupabaseSymbols';
import { Card } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { REGIONS } from '@/utils/regionGrouper';
import { PERIOD_GROUPS } from '@/utils/periodGrouper';
import { CULTURE_FAMILIES } from '@/utils/cultureGrouper';

const SymbolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriodGroup, setSelectedPeriodGroup] = useState('');
  const [selectedCultureFamily, setSelectedCultureFamily] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Récupérer tous les symboles ou les résultats de recherche
  const { data: allSymbols, isLoading: allSymbolsLoading } = useAllSymbols();
  const { data: searchResults, isLoading: searchLoading } = useSearchSymbols(
    searchQuery || undefined,
    selectedRegion || undefined, 
    selectedPeriodGroup || undefined,
    selectedCultureFamily || undefined,
    selectedTags.length > 0 ? selectedTags : undefined
  );

  // Déterminer quelles données utiliser
  const hasActiveFilters = searchQuery || selectedRegion || selectedPeriodGroup || selectedCultureFamily || selectedTags.length > 0;
  const symbols = hasActiveFilters ? (searchResults || []) : (allSymbols || []);
  const isLoading = hasActiveFilters ? searchLoading : allSymbolsLoading;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedPeriodGroup('');
    setSelectedCultureFamily('');
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="symbols.title">Explorez les Symboles</I18nText>
          </h1>
          <p className="text-slate-600 text-lg">
            <I18nText translationKey="symbols.subtitle">
              Découvrez la richesse des symboles à travers les cultures et les époques
            </I18nText>
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <Card className="mb-8 p-6">
          <div className="space-y-4">
            {/* Recherche principale */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Rechercher un symbole..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters}>
                  Effacer
                </Button>
              )}
            </div>

            {/* Filtres avancés hiérarchiques */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <I18nText translationKey="searchFilters.regions">Région</I18nText>
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">
                      <I18nText translationKey="symbols.page.filters.allRegions">Toutes les régions</I18nText>
                    </option>
                    {REGIONS.map(region => (
                      <option key={region.id} value={region.id}>{region.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <I18nText translationKey="searchFilters.periodGroups">Époque</I18nText>
                  </label>
                  <select
                    value={selectedPeriodGroup}
                    onChange={(e) => setSelectedPeriodGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">
                      <I18nText translationKey="symbols.page.filters.allPeriods">Toutes les époques</I18nText>
                    </option>
                    {PERIOD_GROUPS.map(group => (
                      <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <I18nText translationKey="searchFilters.cultureFamilies">Famille culturelle</I18nText>
                  </label>
                  <select
                    value={selectedCultureFamily}
                    onChange={(e) => setSelectedCultureFamily(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">
                      <I18nText translationKey="symbols.page.filters.allCultures">Toutes les familles</I18nText>
                    </option>
                    {CULTURE_FAMILIES.map(family => (
                      <option key={family.id} value={family.id}>{family.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Résultats */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {hasActiveFilters ? (
                <I18nText translationKey="symbols.searchResults">
                  Résultats de recherche
                </I18nText>
              ) : (
                <I18nText translationKey="symbols.allSymbols">
                  Tous les symboles
                </I18nText>
              )}
            </h2>
            <span className="text-sm text-slate-500">
              {isLoading ? (
                <I18nText translationKey="common.loading">Chargement...</I18nText>
              ) : (
                <>
                  {symbols.length} 
                  {symbols.length <= 1 ? (
                    <I18nText translationKey="symbols.symbolCount.singular"> symbole</I18nText>
                  ) : (
                    <I18nText translationKey="symbols.symbolCount.plural"> symboles</I18nText>
                  )}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Grille de symboles */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <SymbolGrid symbols={symbols} />
        )}

        {/* Statistiques */}
        {!isLoading && symbols.length > 0 && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              <I18nText translationKey="symbols.statistics">Statistiques</I18nText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{symbols.length}</div>
                <div className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.stats.total">Symboles au total</I18nText>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {new Set(symbols.map(s => s.culture)).size}
                </div>
                <div className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.stats.cultures">Cultures représentées</I18nText>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {new Set(symbols.map(s => s.period)).size}
                </div>
                <div className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.stats.periods">Périodes historiques</I18nText>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SymbolsPage;
