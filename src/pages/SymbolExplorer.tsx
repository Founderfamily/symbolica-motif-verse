
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { SearchFilters } from '@/components/search/SearchFilters';
import { I18nText } from '@/components/ui/i18n-text';
import { Search, Grid, Layout as LayoutIcon, Map, FilterX } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { FilterCategory, FilterOptions } from '@/types/filters';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const SymbolExplorer: React.FC = () => {
  const { t, currentLanguage } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    cultures: [],
    periods: [],
    medium: [],
    technique: [],
    function: [],
  });
  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  
  // Fetch all symbols
  const { data: symbols, isLoading } = useQuery({
    queryKey: ['symbols'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbols')
        .select('*');
        
      if (error) throw error;
      return data as SymbolData[];
    }
  });
  
  // Create translated filter values from symbols data
  const translatedFilters = useMemo(() => {
    if (!symbols) {
      // Initialize with the correct structure even when symbols is not loaded yet
      return {
        cultures: {},
        periods: {},
        medium: {},
        technique: {},
        function: {}
      } as Record<FilterCategory, Record<string, string>>;
    }
    
    const result: Record<FilterCategory, Record<string, string>> = {
      cultures: {},
      periods: {},
      medium: {},
      technique: {},
      function: {},
    };
    
    symbols.forEach(symbol => {
      // Get translations or fallback to original values
      const translations = symbol.translations || {};
      const langData = translations[currentLanguage];
      
      // Handle culture translations
      if (symbol.culture) {
        const translatedCulture = langData?.culture || symbol.culture;
        result.cultures[symbol.culture] = translatedCulture;
      }
      
      // Handle period translations
      if (symbol.period) {
        const translatedPeriod = langData?.period || symbol.period;
        result.periods[symbol.period] = translatedPeriod;
      }
      
      // Handle medium translations (array)
      symbol.medium?.forEach(m => {
        const translatedMedium = langData?.medium?.find(tm => tm === m) || m;
        result.medium[m] = translatedMedium;
      });
      
      // Handle technique translations (array)
      symbol.technique?.forEach(t => {
        const translatedTechnique = langData?.technique?.find(tt => tt === t) || t;
        result.technique[t] = translatedTechnique;
      });
      
      // Handle function translations (array)
      symbol.function?.forEach(f => {
        const translatedFunction = langData?.function?.find(tf => tf === f) || f;
        result.function[f] = translatedFunction;
      });
    });
    
    return result;
  }, [symbols, currentLanguage]);
  
  // Extract unique filter values for each category
  const availableFilters: FilterOptions = useMemo(() => ({
    cultures: [...new Set(symbols?.map(s => s.culture) || [])],
    periods: [...new Set(symbols?.map(s => s.period) || [])],
    medium: [...new Set(symbols?.flatMap(s => s.medium || []) || [])],
    technique: [...new Set(symbols?.flatMap(s => s.technique || []) || [])],
    function: [...new Set(symbols?.flatMap(s => s.function || []) || [])],
  }), [symbols]);
  
  // Filter symbols based on search term and filters
  const filteredSymbols = useMemo(() => {
    return symbols?.filter(symbol => {
      // Get translations for current language
      const translations = symbol.translations || {};
      const langData = translations[currentLanguage];
      
      // Get translated values or original values as fallback
      const symbolName = langData?.name || symbol.name;
      const symbolDesc = langData?.description || symbol.description;
      const symbolCulture = langData?.culture || symbol.culture;
      const symbolPeriod = langData?.period || symbol.period;
      
      // Text search using translated values when available
      const matchesSearch = searchTerm === '' || 
        symbolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (symbolDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        symbolCulture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        symbolPeriod.toLowerCase().includes(searchTerm.toLowerCase());
        
      // Filter by culture
      const matchesCulture = filters.cultures.length === 0 || 
        filters.cultures.includes(symbol.culture);
        
      // Filter by period
      const matchesPeriod = filters.periods.length === 0 || 
        filters.periods.includes(symbol.period);
        
      // Filter by medium
      const matchesMedium = filters.medium.length === 0 ||
        filters.medium.some(m => symbol.medium?.includes(m));
      
      // Filter by technique
      const matchesTechnique = filters.technique.length === 0 ||
        filters.technique.some(t => symbol.technique?.includes(t));
      
      // Filter by function
      const matchesFunction = filters.function.length === 0 ||
        filters.function.some(f => symbol.function?.includes(f));
        
      return matchesSearch && matchesCulture && matchesPeriod && 
             matchesMedium && matchesTechnique && matchesFunction;
    });
  }, [symbols, searchTerm, filters, currentLanguage]);
  
  // Handle filter changes
  const handleFilterChange = (type: FilterCategory, value: string[]) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      cultures: [],
      periods: [],
      medium: [],
      technique: [],
      function: [],
    });
    setSearchTerm('');
  };

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(filterArray => filterArray.length > 0) || searchTerm !== '';
  
  return (
    <div className="container mx-auto p-4 pt-12 pb-20">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <I18nText translationKey="breadcrumb.home" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <I18nText translationKey="breadcrumb.symbolExplorer" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Enhanced visual separator between header and content */}
      <Separator className="mb-8 mt-2" />
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-lg font-medium text-slate-700 mb-2">
            <I18nText translationKey="symbolExplorer.title" />
          </h1>
          <p className="text-slate-600">
            <I18nText translationKey="symbolExplorer.description" />
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grid" className="flex gap-1 items-center">
                <Grid className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.gridView" />
              </TabsTrigger>
              <TabsTrigger value="list" className="flex gap-1 items-center">
                <LayoutIcon className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.listView" />
              </TabsTrigger>
              <TabsTrigger value="map" className="flex gap-1 items-center">
                <Map className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.mapView" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with filters */}
        <div className="md:col-span-1">
          <Card className="p-4">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-slate-900">
                  <I18nText translationKey="symbolExplorer.filters" />
                </h3>
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-xs flex items-center gap-1 text-slate-500"
                  >
                    <FilterX className="w-3 h-3" />
                    <I18nText translationKey="symbolExplorer.clearFilters" />
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={t('symbolExplorer.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <SearchFilters 
              availableFilters={availableFilters}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              translatedFilters={translatedFilters}
            />
          </Card>
          
          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">
                <I18nText translationKey="symbolExplorer.activeFilters" />
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([category, values]) => 
                values.map(value => {
                  // Get translated filter display value
                  const translatedValue = translatedFilters?.[category as FilterCategory]?.[value] || value;
                  
                  return (
                    <Badge 
                      key={`${category}-${value}`} 
                      variant="secondary" 
                      className="flex gap-1"
                    >
                      <span className="text-xs text-slate-500 mr-1">
                        <I18nText translationKey={`searchFilters.${category}`} />:
                      </span>
                      {translatedValue}
                      <button 
                        onClick={() => handleFilterChange(
                          category as FilterCategory, 
                          filters[category as FilterCategory].filter(v => v !== value)
                        )}
                        className="ml-1 text-xs"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })
              )}
              
              {!hasActiveFilters && (
                <span className="text-sm text-slate-500">
                  <I18nText translationKey="symbolExplorer.noFilters" />
                </span>
              )}
            </div>
          </Card>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="mb-4 px-2 flex justify-between items-center">
                <div className="text-slate-600">
                  <I18nText 
                    translationKey="symbolExplorer.resultsCount" 
                    params={{ count: filteredSymbols?.length || 0 }}
                  />
                </div>
              </div>
              
              <Tabs value={view}>
                <TabsContent value="grid" className="m-0">
                  <SymbolGrid symbols={filteredSymbols || []} />
                </TabsContent>
                
                <TabsContent value="list" className="m-0">
                  <Card className="p-4">
                    <div className="space-y-4">
                      {filteredSymbols?.map(symbol => {
                        // Use translations if available
                        const translations = symbol.translations || {};
                        const langData = translations[currentLanguage];
                        const displayName = langData?.name || symbol.name;
                        const displayCulture = langData?.culture || symbol.culture;
                        const displayPeriod = langData?.period || symbol.period;
                        const displayDescription = langData?.description || symbol.description;
                        
                        return (
                          <div key={symbol.id} className="flex items-center gap-4 p-2 border-b last:border-0">
                            <div className="w-16 h-16 bg-amber-100 rounded-lg"></div>
                            <div>
                              <h3 className="font-medium">{displayName}</h3>
                              <div className="flex gap-2 mt-1">
                                <span className="text-xs text-slate-600">{displayCulture}</span>
                                <span className="text-xs text-slate-500">{displayPeriod}</span>
                              </div>
                              {displayDescription && (
                                <p className="text-sm text-slate-700 mt-1 line-clamp-2">{displayDescription}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      
                      {(filteredSymbols?.length || 0) === 0 && (
                        <div className="py-8 text-center text-slate-500">
                          <I18nText translationKey="symbolExplorer.noResults" />
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="map" className="m-0">
                  <Card className="p-8 flex items-center justify-center h-96 bg-slate-50">
                    <div className="text-center">
                      <Map className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                      <h3 className="font-medium text-slate-700">
                        <I18nText translationKey="symbolExplorer.mapViewComingSoon" />
                      </h3>
                      <p className="text-slate-500 mt-2 max-w-md">
                        <I18nText translationKey="symbolExplorer.mapViewDescription" />
                      </p>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
