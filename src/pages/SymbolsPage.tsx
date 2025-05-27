
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { AdvancedFilters } from '@/components/search/AdvancedFilters';
import { I18nText } from '@/components/ui/i18n-text';
import { Search, FilterX } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

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
  
  // Fetch all symbols
  const { data: symbols, isLoading } = useQuery({
    queryKey: ['symbols'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbols')
        .select('*');
        
      if (error) throw error;
      return (data as unknown) as SymbolData[];
    }
  });
  
  // Extract unique values for filters
  const cultures = [...new Set(symbols?.map(s => s.culture) || [])];
  const periods = [...new Set(symbols?.map(s => s.period) || [])];
  const functions = [...new Set(symbols?.flatMap(s => s.function || []) || [])];
  const techniques = [...new Set(symbols?.flatMap(s => s.technique || []) || [])];
  const mediums = [...new Set(symbols?.flatMap(s => s.medium || []) || [])];
  
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

    // Filter by function
    const matchesFunction = filters.functions.length === 0 ||
      (symbol.function && symbol.function.some(f => filters.functions.includes(f)));

    // Filter by technique
    const matchesTechnique = filters.techniques.length === 0 ||
      (symbol.technique && symbol.technique.some(t => filters.techniques.includes(t)));

    // Filter by medium
    const matchesMedium = filters.mediums.length === 0 ||
      (symbol.medium && symbol.medium.some(m => filters.mediums.includes(m)));
      
    return matchesSearch && matchesCulture && matchesPeriod && matchesFunction && matchesTechnique && matchesMedium;
  });
  
  // Handle filter changes
  const handleFilterChange = (type: keyof typeof filters, value: string[]) => {
    setFilters(prev => ({ ...prev, [type]: value }));
  };
  
  // Clear all filters
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
  
  return (
    <div className="container mx-auto p-4 pt-12 pb-20">
      <Separator className="mb-8 mt-2" />
      
      <div className="flex flex-col justify-between items-start gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            <I18nText translationKey="symbols.page.title">Tous les Symboles</I18nText>
          </h1>
          <p className="text-slate-600">
            <I18nText translationKey="symbols.page.description">
              Explorez notre collection complète de symboles culturels du monde entier
            </I18nText>
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with filters */}
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
              cultures={cultures}
              periods={periods}
              functions={functions}
              techniques={techniques}
              mediums={mediums}
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
                      className="ml-1 text-xs"
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
                    translationKey="symbols.page.resultsCount" 
                    params={{ count: filteredSymbols?.length || 0 }}
                  >
                    {filteredSymbols?.length || 0} symboles trouvés
                  </I18nText>
                </div>
              </div>
              
              <SymbolGrid symbols={filteredSymbols || []} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolsPage;
