import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { useAllSymbols, useSearchSymbols } from '@/hooks/useSupabaseSymbols';
import { Card } from '@/components/ui/card';
import { I18nText } from '@/components/ui/i18n-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, Info, Plus, Camera, CameraOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { REGIONS } from '@/utils/regionGrouper';
import { PERIOD_GROUPS } from '@/utils/periodGrouper';
import { CULTURE_FAMILIES } from '@/utils/cultureGrouper';
import { useAuth } from '@/hooks/useAuth';
import { SymbolVisibilityService } from '@/services/symbolVisibilityService';
import { Badge } from '@/components/ui/badge';
import { TrendingSymbol } from '@/services/trendingService';

const SymbolsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriodGroup, setSelectedPeriodGroup] = useState('');
  const [selectedCultureFamily, setSelectedCultureFamily] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyWithPhotos, setShowOnlyWithPhotos] = useState(false);
  const { user } = useAuth();

  // Récupérer tous les symboles ou les résultats de recherche
  const { data: allSymbols, isLoading: allSymbolsLoading } = useAllSymbols();
  const { data: searchResults, isLoading: searchLoading } = useSearchSymbols(
    searchQuery || undefined,
    selectedRegion || undefined, 
    selectedPeriodGroup || undefined,
    selectedCultureFamily || undefined,
    selectedTags.length > 0 ? selectedTags : undefined
  );

  // Déterminer quelles données utiliser et les enrichir avec le système de visibilité
  const hasActiveFilters = searchQuery || selectedRegion || selectedPeriodGroup || selectedCultureFamily || selectedTags.length > 0 || showOnlyWithPhotos;
  const rawSymbols = hasActiveFilters ? (searchResults || []) : (allSymbols || []);
  const isLoading = hasActiveFilters ? searchLoading : allSymbolsLoading;

  // Traiter les symboles avec le système de visibilité et filtrage
  const processedSymbols = React.useMemo(() => {
    if (!rawSymbols || rawSymbols.length === 0) return [];
    
    // Calculer la visibilité pour chaque symbole et créer un tableau avec métadonnées
    const symbolsWithVisibility = rawSymbols.map(symbol => {
      const hasPhoto = SymbolVisibilityService.hasPhoto(symbol);
      const visibilityScore = SymbolVisibilityService.calculateVisibilityScore(0, hasPhoto);
      return {
        symbol,
        hasPhoto,
        visibilityScore
      };
    });
    
    // Filtrer par présence de photos si demandé
    const filteredSymbols = showOnlyWithPhotos 
      ? symbolsWithVisibility.filter(s => s.hasPhoto)
      : symbolsWithVisibility;
    
    // Trier par visibilité (symboles avec photos en premier, puis par nom)
    const sortedSymbols = filteredSymbols.sort((a, b) => {
      // Prioriser les symboles avec photos
      if (a.hasPhoto !== b.hasPhoto) {
        return a.hasPhoto ? -1 : 1;
      }
      // En cas d'égalité, trier par score de visibilité puis par nom
      if (b.visibilityScore !== a.visibilityScore) {
        return b.visibilityScore - a.visibilityScore;
      }
      return a.symbol.name.localeCompare(b.symbol.name);
    });
    
    // Retourner seulement les symboles
    return sortedSymbols.map(s => s.symbol);
  }, [rawSymbols, showOnlyWithPhotos]);

  // Statistiques sur les photos
  const photoStats = React.useMemo(() => {
    if (!rawSymbols || rawSymbols.length === 0) return null;
    
    // Convertir pour les stats
    const trendingSymbols: TrendingSymbol[] = rawSymbols.map(symbol => ({
      ...symbol,
      trending_score: 0,
      view_count: 0,
      like_count: 0
    }));
    
    return SymbolVisibilityService.getPhotoStats(trendingSymbols);
  }, [rawSymbols]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedPeriodGroup('');
    setSelectedCultureFamily('');
    setSelectedTags([]);
    setShowOnlyWithPhotos(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-4xl font-bold text-slate-900">
              <I18nText translationKey="symbols.title">Explorez les Symboles</I18nText>
            </h1>
            {user && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
                      <Link to="/propose-symbol" className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        <I18nText translationKey="symbols.propose">Proposer un symbole</I18nText>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Contribuez à enrichir notre base de données en proposant un nouveau symbole</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
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
              <div className="space-y-4 pt-4 border-t">
                {/* Filtre photo et statistiques */}
                {photoStats && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant={showOnlyWithPhotos ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowOnlyWithPhotos(!showOnlyWithPhotos)}
                        className="flex items-center gap-2"
                      >
                        <Camera className="h-4 w-4" />
                        Avec photos ({photoStats.withPhoto})
                      </Button>
                      
                      <div className="text-sm text-slate-600">
                        <Badge variant="outline" className="mr-2 text-green-600 border-green-200">
                          <Camera className="h-3 w-3 mr-1" />
                          {photoStats.withPhoto} avec photos
                        </Badge>
                        <Badge variant="outline" className="text-orange-600 border-orange-200">
                          <CameraOff className="h-3 w-3 mr-1" />
                          {photoStats.withoutPhoto} sans photos
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-slate-500">
                      {photoStats.percentageWithPhoto.toFixed(1)}% avec photos
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <I18nText translationKey="searchFilters.periodGroups">Époque</I18nText>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-2">
                              <p className="font-medium">Classification Internationale UNESCO</p>
                              <p className="text-sm">
                                Standards académiques mondiaux avec bornes chronologiques précises :
                                Préhistoire, Antiquité, Moyen Âge, Moderne, Contemporain.
                              </p>
                              <p className="text-xs text-slate-400">
                                Algorithme intelligent pour périodes multi-séculaires
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
                  {processedSymbols.length} 
                  {processedSymbols.length <= 1 ? (
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
          <SymbolGrid symbols={processedSymbols} />
        )}

        {/* Statistiques */}
        {!isLoading && processedSymbols.length > 0 && (
          <Card className="mt-8 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              <I18nText translationKey="symbols.statistics">Statistiques</I18nText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-600">{processedSymbols.length}</div>
                <div className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.stats.total">Symboles au total</I18nText>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {new Set(processedSymbols.map(s => s.culture)).size}
                </div>
                <div className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.stats.cultures">Cultures représentées</I18nText>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-600">
                  {new Set(processedSymbols.map(s => s.period)).size}
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
