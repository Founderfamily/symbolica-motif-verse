
import React, { useState } from 'react';
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
import { Search, Grid, Layout, Map, FilterX } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

const SymbolExplorer: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cultures: [] as string[],
    periods: [] as string[],
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
  
  // Extract unique cultures and periods for filters
  const cultures = [...new Set(symbols?.map(s => s.culture) || [])];
  const periods = [...new Set(symbols?.map(s => s.period) || [])];
  
  // Filter symbols based on search term and filters
  const filteredSymbols = symbols?.filter(symbol => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.period.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by culture
    const matchesCulture = filters.cultures.length === 0 || 
      filters.cultures.includes(symbol.culture);
      
    // Filter by period
    const matchesPeriod = filters.periods.length === 0 || 
      filters.periods.includes(symbol.period);
      
    return matchesSearch && matchesCulture && matchesPeriod;
  });
  
  // Handle filter changes
  const handleFilterChange = (type: 'cultures' | 'periods', value: string[]) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({ cultures: [], periods: [] });
    setSearchTerm('');
  };
  
  return (
    <div className="container mx-auto p-4 pt-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-xl font-medium text-slate-900 mb-1">
            <I18nText translationKey="symbolExplorer.title">Symbol Explorer</I18nText>
          </h1>
          <p className="text-slate-600">
            <I18nText translationKey="symbolExplorer.description">
              Explore our collection of cultural symbols, patterns and motifs
            </I18nText>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grid" className="flex gap-1 items-center">
                <Grid className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.gridView">Grid</I18nText>
              </TabsTrigger>
              <TabsTrigger value="list" className="flex gap-1 items-center">
                <Layout className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.listView">List</I18nText>
              </TabsTrigger>
              <TabsTrigger value="map" className="flex gap-1 items-center">
                <Map className="w-4 h-4" />
                <I18nText translationKey="symbolExplorer.mapView">Map</I18nText>
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
                  <I18nText translationKey="symbolExplorer.filters">Filters</I18nText>
                </h3>
                {(filters.cultures.length > 0 || filters.periods.length > 0) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-xs flex items-center gap-1 text-slate-500"
                  >
                    <FilterX className="w-3 h-3" />
                    <I18nText translationKey="symbolExplorer.clearFilters">Clear all</I18nText>
                  </Button>
                )}
              </div>
              
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={t('symbolExplorer.searchPlaceholder', 'Search symbols...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <SearchFilters 
              cultures={cultures}
              periods={periods}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </Card>
          
          <Card className="p-4 mt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">
                <I18nText translationKey="symbolExplorer.activeFilters">Active Filters</I18nText>
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.cultures.map(culture => (
                <Badge key={`culture-${culture}`} variant="secondary" className="flex gap-1">
                  {culture}
                  <button 
                    onClick={() => handleFilterChange('cultures', filters.cultures.filter(c => c !== culture))}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              
              {filters.periods.map(period => (
                <Badge key={`period-${period}`} variant="secondary" className="flex gap-1">
                  {period}
                  <button 
                    onClick={() => handleFilterChange('periods', filters.periods.filter(p => p !== period))}
                    className="ml-1 text-xs"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              
              {filters.cultures.length === 0 && filters.periods.length === 0 && (
                <span className="text-sm text-slate-500">
                  <I18nText translationKey="symbolExplorer.noFilters">No active filters</I18nText>
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
                  >
                    {filteredSymbols?.length || 0} symbols found
                  </I18nText>
                </div>
              </div>
              
              <Tabs value={view}>
                <TabsContent value="grid" className="m-0">
                  <SymbolGrid symbols={filteredSymbols || []} />
                </TabsContent>
                
                <TabsContent value="list" className="m-0">
                  <Card className="p-4">
                    <div className="space-y-4">
                      {filteredSymbols?.map(symbol => (
                        <div key={symbol.id} className="flex items-center gap-4 p-2 border-b last:border-0">
                          <div className="w-16 h-16 bg-amber-100 rounded-lg"></div>
                          <div>
                            <h3 className="font-medium">{symbol.name}</h3>
                            <div className="flex gap-2 mt-1">
                              <span className="text-xs text-slate-600">{symbol.culture}</span>
                              <span className="text-xs text-slate-500">{symbol.period}</span>
                            </div>
                            {symbol.description && (
                              <p className="text-sm text-slate-700 mt-1 line-clamp-2">{symbol.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {(filteredSymbols?.length || 0) === 0 && (
                        <div className="py-8 text-center text-slate-500">
                          <I18nText translationKey="symbolExplorer.noResults">
                            No symbols match your filter criteria
                          </I18nText>
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
                        <I18nText translationKey="symbolExplorer.mapViewComingSoon">
                          Interactive map view coming soon
                        </I18nText>
                      </h3>
                      <p className="text-slate-500 mt-2 max-w-md">
                        <I18nText translationKey="symbolExplorer.mapViewDescription">
                          Explore symbols based on their geographical origin and distribution
                        </I18nText>
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
