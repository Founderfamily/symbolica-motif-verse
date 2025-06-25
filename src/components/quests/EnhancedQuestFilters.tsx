
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  X, 
  MapPin, 
  Globe, 
  Building,
  Landmark,
  RefreshCw,
  RotateCcw,
  Plus,
  BookOpen,
  Loader2
} from 'lucide-react';
import { geolocationService } from '@/services/geolocationService';

interface EnhancedQuestFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterDifficulty: string;
  setFilterDifficulty: (difficulty: string) => void;
  filterCountry: string;
  setFilterCountry: (country: string) => void;
  filterRegion: string;
  setFilterRegion: (region: string) => void;
  filterCity: string;
  setFilterCity: (city: string) => void;
  filterZone: string;
  setFilterZone: (zone: string) => void;
  onRefresh: () => void;
  onPopulateQuests: (forceReload: boolean) => void;
  isPopulating: boolean;
  isForceReloading: boolean;
  populationResult: { success: boolean; message: string } | null;
  questCount: number;
  activeQuestCount: number;
}

const EnhancedQuestFilters: React.FC<EnhancedQuestFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterDifficulty,
  setFilterDifficulty,
  filterCountry,
  setFilterCountry,
  filterRegion,
  setFilterRegion,
  filterCity,
  setFilterCity,
  filterZone,
  setFilterZone,
  onRefresh,
  onPopulateQuests,
  isPopulating,
  isForceReloading,
  populationResult,
  questCount,
  activeQuestCount
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Calculer le nombre de filtres actifs
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (filterType !== 'all') count++;
    if (filterDifficulty !== 'all') count++;
    if (filterCountry !== 'all') count++;
    if (filterRegion !== 'all') count++;
    if (filterCity !== 'all') count++;
    if (filterZone !== 'all') count++;
    setActiveFiltersCount(count);
  }, [searchTerm, filterType, filterDifficulty, filterCountry, filterRegion, filterCity, filterZone]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterDifficulty('all');
    setFilterCountry('all');
    setFilterRegion('all');
    setFilterCity('all');
    setFilterZone('all');
  };

  const getZoneLabel = (zone: string) => {
    const labels: { [key: string]: string } = {
      'chateau': 'Châteaux',
      'abbaye': 'Abbayes',
      'forteresse': 'Forteresses',
      'megalithique': 'Sites mégalithiques',
      'centre-historique': 'Centres historiques'
    };
    return labels[zone] || zone;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-sm border border-amber-200/50 shadow-xl mb-8">
      <div className="p-6">
        {/* En-tête avec statistiques */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-semibold text-stone-800">Recherche avancée</h3>
            </div>
            <div className="flex items-center gap-4 text-sm text-stone-600">
              <span className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                {questCount} quêtes
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-green-600" />
                {activeQuestCount} actives
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="w-4 h-4 mr-2" />
                Effacer ({activeFiltersCount})
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-stone-600"
            >
              {isExpanded ? 'Réduire' : 'Plus de filtres'}
            </Button>
          </div>
        </div>

        {/* Barre de recherche principale */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5" />
          <Input
            placeholder="Rechercher par nom, lieu, description... (ex: 'Lyon', 'Templiers', 'Château')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-lg border-2 border-amber-200 focus:border-amber-400"
          />
        </div>

        {/* Filtres rapides */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-amber-200">
              <SelectValue placeholder="Type de quête" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="templar">🏰 Templiers</SelectItem>
              <SelectItem value="lost_civilization">🏛️ Civilisation Perdue</SelectItem>
              <SelectItem value="grail">👑 Quête du Graal</SelectItem>
              <SelectItem value="custom">⚡ Personnalisée</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger className="border-amber-200">
              <SelectValue placeholder="Difficulté" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes difficultés</SelectItem>
              <SelectItem value="beginner">🌟 Accessible</SelectItem>
              <SelectItem value="intermediate">⭐ Intermédiaire</SelectItem>
              <SelectItem value="expert">🔥 Avancé</SelectItem>
              <SelectItem value="master">💎 Expert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="border-amber-200">
              <SelectValue placeholder="Région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes régions</SelectItem>
              {geolocationService.getAvailableRegions().map(region => (
                <SelectItem key={region} value={region}>
                  📍 {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger className="border-amber-200">
              <SelectValue placeholder="Ville" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes villes</SelectItem>
              {geolocationService.getAvailableCities().map(city => (
                <SelectItem key={city} value={city}>
                  🏛️ {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtres avancés (repliables) */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Pays
                </label>
                <Select value={filterCountry} onValueChange={setFilterCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous pays" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous pays</SelectItem>
                    <SelectItem value="france">🇫🇷 France</SelectItem>
                    <SelectItem value="multi">🌍 Multi-pays</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Landmark className="w-4 h-4" />
                  Zone historique
                </label>
                <Select value={filterZone} onValueChange={setFilterZone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes zones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes zones</SelectItem>
                    {geolocationService.getAvailableZones().map(zone => (
                      <SelectItem key={zone} value={zone}>
                        {getZoneLabel(zone)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Actions
                </label>
                <div className="flex gap-2">
                  <Button 
                    onClick={onRefresh}
                    variant="outline"
                    size="sm"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions principales */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-amber-200">
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => onPopulateQuests(false)}
              disabled={isPopulating}
              className="bg-stone-700 hover:bg-stone-800 text-white"
            >
              {isPopulating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Chargement...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Charger Mystères
                </>
              )}
            </Button>

            <Button 
              onClick={() => onPopulateQuests(true)}
              disabled={isForceReloading}
              variant="outline"
              className="border-2 border-red-300 text-red-700 hover:bg-red-50"
            >
              {isForceReloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Rechargement...
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Recharger Tout
                </>
              )}
            </Button>
            
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Proposer une Recherche
            </Button>
          </div>

          {/* Badges de filtres actifs */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Recherche: "{searchTerm}"
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              {filterRegion !== 'all' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  📍 {filterRegion}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => setFilterRegion('all')}
                  />
                </Badge>
              )}
              {filterCity !== 'all' && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  🏛️ {filterCity}
                  <X 
                    className="w-3 h-3 ml-1 cursor-pointer" 
                    onClick={() => setFilterCity('all')}
                  />
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Résultat de population */}
        {populationResult && (
          <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
            populationResult.success 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {populationResult.success ? (
              <div className="w-5 h-5 text-green-600">✓</div>
            ) : (
              <X className="w-5 h-5 text-red-600" />
            )}
            <p className="font-medium">
              {populationResult.message}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default EnhancedQuestFilters;
