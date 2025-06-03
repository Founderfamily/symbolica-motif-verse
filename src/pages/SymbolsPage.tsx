
import React, { useState } from 'react';
import { SymbolData } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { I18nText } from '@/components/ui/i18n-text';
import { Search, FilterX, Database, Wifi, WifiOff } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useHybridSymbols } from '@/hooks/useHybridSymbols';

const SymbolsPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cultures: [] as string[],
    periods: [] as string[],
    functions: [] as string[],
    techniques: [] as string[],
    mediums: [] as string[],
  });
  
  // Utilisation du système hybride
  const { symbols, isLoading, dataSource, filterValues } = useHybridSymbols();
  
  // Filtrage des symboles
  const filteredSymbols = symbols.filter(symbol => {
    // Recherche textuelle
    const matchesSearch = searchTerm === '' || 
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.period.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filtres
    const matchesCulture = filters.cultures.length === 0 || 
      filters.cultures.includes(symbol.culture);
      
    const matchesPeriod = filters.periods.length === 0 || 
      filters.periods.includes(symbol.period);

    const matchesFunction = filters.functions.length === 0 ||
      (symbol.function && symbol.function.some(f => filters.functions.includes(f)));

    const matchesTechnique = filters.techniques.length === 0 ||
      (symbol.technique && symbol.technique.some(t => filters.techniques.includes(t)));

    const matchesMedium = filters.mediums.length === 0 ||
      (symbol.medium && symbol.medium.some(m => filters.mediums.includes(m)));
      
    return matchesSearch && matchesCulture && matchesPeriod && matchesFunction && matchesTechnique && matchesMedium;
  });
  
  // Gestion des filtres
  const handleFilterChange = (type: keyof typeof filters, value: string[]) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  // Réinitialisation des filtres
  const clearFilters = () => {
    setFilters({ 
      cultures: [], 
      periods: [], 
      functions: [], 
      techniques: [], 
      mediums: [] 
    });
    setSearchTerm('');
  };

  // Indicateur de source de données
  const DataSourceIndicator = () => {
    const getSourceConfig = () => {
      switch (dataSource) {
        case 'static':
          return {
            icon: WifiOff,
            text: 'Données locales',
            color: 'text-amber-600 bg-amber-50',
            description: 'Affichage des données statiques'
          };
        case 'hybrid':
          return {
            icon: Database,
            text: 'Données complètes',
            color: 'text-green-600 bg-green-50',
            description: 'Données locales + base de données'
          };
        case 'api':
          return {
            icon: Wifi,
            text: 'Base de données',
            color: 'text-blue-600 bg-blue-50',
            description: 'Données de la base de données'
          };
      }
    };

    const config = getSourceConfig();
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span>{config.text}</span>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-4 pt-12 pb-20">
      <Separator className="mb-8 mt-2" />
      
      <div className="flex flex-col justify-between items-start gap-6 mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-3xl font-bold text-slate-900">
              <I18nText translationKey="symbols.page.title">Tous les Symboles</I18nText>
            </h1>
            <DataSourceIndicator />
          </div>
          <p className="text-slate-600">
            <I18nText translationKey="symbols.page.description">
              Explorez notre collection complète de symboles culturels du monde entier
            </I18nText>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar avec filtres */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  <I18nText translationKey="symbols.page.filters">Filtres</I18nText>
                </h3>
                {(Object.values(filters).some(arr => arr.length > 0)) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-xs flex items-center gap-1 text-slate-500"
                  >
                    <FilterX className="w-3 h-3" />
                    <I18nText translationKey="symbols.page.clearFilters">Tout effacer</I18nText>
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={t('symbols.page.searchPlaceholder', 'Rechercher des symboles...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <AdvancedFilters 
              cultures={filterValues.cultures}
              periods={filterValues.periods}
              functions={filterValues.functions}
              techniques={filterValues.techniques}
              mediums={filterValues.mediums}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </Card>
          
          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">
                <I18nText translationKey="symbols.page.activeFilters">Filtres actifs</I18nText>
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([type, values]) =>
                values.map(value => (
                  <Badge key={`${type}-${value}`} variant="secondary" className="flex gap-1">
                    {value}
                    <button 
                      onClick={() => handleFilterChange(type as keyof typeof filters, values.filter(v => v !== value))}
                      className="ml-1 text-xs hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))
              )}
              
              {Object.values(filters).every(arr => arr.length === 0) && (
                <span className="text-sm text-slate-500">
                  <I18nText translationKey="symbols.page.noFilters">Aucun filtre actif</I18nText>
                </span>
              )}
            </div>
          </Card>
        </div>
        
        {/* Zone de contenu principal */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600">Chargement des symboles...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 px-2 flex justify-between items-center">
                <div className="text-slate-600">
                  <I18nText 
                    translationKey="symbols.page.resultsCount" 
                    params={{ count: filteredSymbols.length }}
                  >
                    {filteredSymbols.length} symboles trouvés
                  </I18nText>
                </div>
                
                {dataSource === 'static' && (
                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Mode hors ligne
                  </div>
                )}
              </div>
              
              <SymbolGrid symbols={filteredSymbols} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolsPage;
