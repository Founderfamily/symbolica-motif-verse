
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, Zap, ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TaxonomyService } from '@/services/taxonomyService';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { Link } from 'react-router-dom';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';
import { TimelineBreadcrumb } from './TimelineBreadcrumb';

interface SymbolWithImages extends SymbolData {
  symbol_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean | null;
  }>;
}

interface SubPeriod {
  id: string;
  name: string;
  dateRange: string;
  description: string;
  color: string;
  symbols: SymbolWithImages[];
}

interface TimelinePeriod {
  id: string;
  name: string;
  period: string;
  dateRange: string;
  description: string;
  unescoCode: string;
  cultures: string[];
  symbols: SymbolWithImages[];
  color: string;
  gradient: string;
  subPeriods: SubPeriod[];
}

const SUB_PERIODS_DATA = {
  'prehistoire': [
    { id: 'paleolithique', name: 'Paléolithique', dateRange: '-40,000 à -10,000', description: 'Art pariétal et premiers outils symboliques', color: 'hsl(var(--chart-1))' },
    { id: 'mesolithique', name: 'Mésolithique', dateRange: '-10,000 à -8,000', description: 'Transition vers la sédentarisation', color: 'hsl(var(--chart-1))' },
    { id: 'neolithique', name: 'Néolithique', dateRange: '-8,000 à -3,000', description: 'Agriculture et céramique symbolique', color: 'hsl(var(--chart-1))' },
    { id: 'age-bronze', name: 'Âge du Bronze', dateRange: '-3,000 à -800', description: 'Métallurgie et commerce', color: 'hsl(var(--chart-1))' }
  ],
  'antiquite': [
    { id: 'grece-archaique', name: 'Grèce archaïque', dateRange: '-800 à -500', description: 'Émergence de la civilisation grecque', color: 'hsl(var(--chart-2))' },
    { id: 'grece-classique', name: 'Grèce classique', dateRange: '-500 à -300', description: 'Apogée de la culture grecque', color: 'hsl(var(--chart-2))' },
    { id: 'hellenistique', name: 'Période hellénistique', dateRange: '-300 à -30', description: 'Expansion de la culture grecque', color: 'hsl(var(--chart-2))' },
    { id: 'empire-romain', name: 'Empire romain', dateRange: '-30 à 500', description: 'Domination romaine et syncrétisme', color: 'hsl(var(--chart-2))' }
  ],
  'moyen-age': [
    { id: 'haut-moyen-age', name: 'Haut Moyen Âge', dateRange: '500-1000', description: 'Christianisation et royaumes barbares', color: 'hsl(var(--chart-3))' },
    { id: 'moyen-age-central', name: 'Moyen Âge central', dateRange: '1000-1300', description: 'Féodalité et art roman', color: 'hsl(var(--chart-3))' },
    { id: 'bas-moyen-age', name: 'Bas Moyen Âge', dateRange: '1300-1500', description: 'Art gothique et renaissance urbaine', color: 'hsl(var(--chart-3))' }
  ],
  'renaissance': [
    { id: 'renaissance-italienne', name: 'Renaissance italienne', dateRange: '1400-1500', description: 'Humanisme et renouveau artistique', color: 'hsl(var(--chart-4))' },
    { id: 'renaissance-nord', name: 'Renaissance du Nord', dateRange: '1500-1600', description: 'Diffusion de la Renaissance en Europe', color: 'hsl(var(--chart-4))' },
    { id: 'baroque', name: 'Baroque', dateRange: '1600-1700', description: 'Art dramatique et contre-réforme', color: 'hsl(var(--chart-4))' }
  ],
  'moderne': [
    { id: 'lumieres', name: 'Siècle des Lumières', dateRange: '1700-1800', description: 'Rationalisme et révolutions', color: 'hsl(var(--chart-5))' },
    { id: '19e-siecle', name: 'XIXe siècle', dateRange: '1800-1900', description: 'Industrialisation et nationalisme', color: 'hsl(var(--chart-5))' },
    { id: '20e-siecle', name: 'XXe siècle', dateRange: '1900-2000', description: 'Modernité et avant-gardes', color: 'hsl(var(--chart-5))' },
    { id: '21e-siecle', name: 'XXIe siècle', dateRange: '2000-aujourd\'hui', description: 'Mondialisation numérique', color: 'hsl(var(--chart-5))' }
  ]
};

const TIMELINE_PERIODS: Omit<TimelinePeriod, 'symbols' | 'subPeriods'>[] = [
  {
    id: 'prehistoire',
    name: 'Préhistoire',
    period: 'PRE',
    dateRange: '-3000 à -800 av. J.-C.',
    description: 'Émergence des premiers symboles et art pariétal',
    unescoCode: TaxonomyService.TEMPORAL_CODES.PRE,
    cultures: ['Néolithique', 'Âge du Bronze', 'Art rupestre'],
    color: 'hsl(var(--chart-1))',
    gradient: 'from-chart-1 to-chart-1/50'
  },
  {
    id: 'antiquite',
    name: 'Antiquité',
    period: 'ANT',
    dateRange: '-800 av. J.-C. à 500 ap. J.-C.',
    description: 'Civilisations antiques et systèmes symboliques complexes',
    unescoCode: TaxonomyService.TEMPORAL_CODES.ANT,
    cultures: ['Égypte', 'Grèce', 'Rome', 'Gaule'],
    color: 'hsl(var(--chart-2))',
    gradient: 'from-chart-2 to-chart-2/50'
  },
  {
    id: 'moyen-age',
    name: 'Moyen Âge',
    period: 'MED',
    dateRange: '500 à 1500 ap. J.-C.',
    description: 'Héraldique, symbolisme religieux et traditions régionales',
    unescoCode: TaxonomyService.TEMPORAL_CODES.MED,
    cultures: ['Byzantin', 'Carolingien', 'Gothique', 'Celtique'],
    color: 'hsl(var(--chart-3))',
    gradient: 'from-chart-3 to-chart-3/50'
  },
  {
    id: 'renaissance',
    name: 'Renaissance',
    period: 'MOD',
    dateRange: '1400 à 1700 ap. J.-C.',
    description: 'Renouveau artistique et humanisme européen',
    unescoCode: TaxonomyService.TEMPORAL_CODES.MOD,
    cultures: ['Renaissance italienne', 'Humanisme', 'Baroque'],
    color: 'hsl(var(--chart-4))',
    gradient: 'from-chart-4 to-chart-4/50'
  },
  {
    id: 'moderne',
    name: 'Époque Moderne',
    period: 'CON',
    dateRange: '1700 à aujourd\'hui',
    description: 'Modernité, industrialisation et mondialisation',
    unescoCode: TaxonomyService.TEMPORAL_CODES.CON,
    cultures: ['Industriel', 'Art nouveau', 'Contemporain'],
    color: 'hsl(var(--chart-5))',
    gradient: 'from-chart-5 to-chart-5/50'
  }
];

export function InteractiveTimeline() {
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [selectedSubPeriod, setSelectedSubPeriod] = useState<string | null>(null);
  const [periods, setPeriods] = useState<TimelinePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cultures: [],
    themes: [],
    sortBy: 'name',
    viewMode: 'grid',
    maxItems: 50
  });

  useEffect(() => {
    loadTimelineData();
  }, []);

  const loadTimelineData = async () => {
    try {
      const periodsWithSymbols = await Promise.all(
        TIMELINE_PERIODS.map(async (period) => {
          const { data: symbols } = await supabase
            .from('symbols')
            .select(`
              id,
              name,
              culture,
              period,
              description,
              created_at,
              updated_at,
              symbol_images!symbol_images_symbol_id_fkey(
                id,
                image_url,
                is_primary
              )
            `)
            .eq('temporal_taxonomy_code', period.period)
            .not('symbol_images.image_url', 'is', null)
            .limit(20);

          // Create sub-periods with symbols
          const subPeriods = SUB_PERIODS_DATA[period.id as keyof typeof SUB_PERIODS_DATA]?.map(subPeriod => ({
            ...subPeriod,
            symbols: (symbols || []).slice(0, Math.floor((symbols || []).length / 4)) as SymbolWithImages[]
          })) || [];

          return {
            ...period,
            symbols: (symbols || []) as SymbolWithImages[],
            subPeriods
          };
        })
      );

      setPeriods(periodsWithSymbols);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPeriod = periods[selectedPeriod];
  const currentSubPeriod = selectedSubPeriod 
    ? currentPeriod?.subPeriods.find(sp => sp.id === selectedSubPeriod)
    : null;

  const nextPeriod = () => {
    setSelectedPeriod((prev) => (prev + 1) % periods.length);
    setSelectedSubPeriod(null);
  };

  const prevPeriod = () => {
    setSelectedPeriod((prev) => (prev - 1 + periods.length) % periods.length);
    setSelectedSubPeriod(null);
  };

  const goToSubPeriod = (subPeriodId: string) => {
    setSelectedSubPeriod(subPeriodId);
  };

  const goBackToPeriod = () => {
    setSelectedSubPeriod(null);
  };

  // Apply filters and search
  const currentSymbols = currentSubPeriod ? currentSubPeriod.symbols : currentPeriod?.symbols || [];
  
  let filteredSymbols = currentSymbols.filter(symbol => {
    // Search filter
    const matchesSearch = !searchQuery || 
      symbol.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.culture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      symbol.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Culture filter
    const matchesCulture = filters.cultures.length === 0 || 
      filters.cultures.some(culture => symbol.culture?.includes(culture));
    
    return matchesSearch && matchesCulture;
  });

  // Apply sorting
  filteredSymbols = filteredSymbols.sort((a, b) => {
    switch (filters.sortBy) {
      case 'culture':
        return (a.culture || '').localeCompare(b.culture || '');
      case 'recent':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      default:
        return (a.name || '').localeCompare(b.name || '');
    }
  });

  // Apply max items limit
  filteredSymbols = filteredSymbols.slice(0, filters.maxItems);

  const breadcrumbItems = [
    { id: 'timeline', name: 'Timeline', onClick: goBackToPeriod },
    ...(currentPeriod ? [{ id: currentPeriod.id, name: currentPeriod.name, onClick: goBackToPeriod }] : []),
    ...(currentSubPeriod ? [{ id: currentSubPeriod.id, name: currentSubPeriod.name, onClick: () => {} }] : [])
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.h1 
          className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Timeline Interactive des Symboles
        </motion.h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explorez l'évolution des symboles à travers les époques selon la classification UNESCO
        </p>
      </div>

      {/* Breadcrumb */}
      <TimelineBreadcrumb items={breadcrumbItems} />

      {/* Timeline Navigation - Only show if not in sub-period */}
      {!selectedSubPeriod && (
        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" size="icon" onClick={prevPeriod}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 mx-4">
              <div className="flex justify-between items-center relative">
                {periods.map((period, index) => (
                  <motion.button
                    key={period.id}
                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                      index === selectedPeriod 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setSelectedPeriod(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-4 h-4 rounded-full mb-2 ${
                      index === selectedPeriod ? 'bg-primary' : 'bg-muted'
                    }`} />
                    <span className="text-sm font-medium">{period.name}</span>
                    <span className="text-xs text-muted-foreground">{period.dateRange}</span>
                    {period.subPeriods.length > 0 && (
                      <ChevronDown className="h-3 w-3 mt-1 text-muted-foreground" />
                    )}
                  </motion.button>
                ))}
                
                {/* Progress Line */}
                <div className="absolute top-6 left-0 w-full h-0.5 bg-muted -z-10">
                  <motion.div 
                    className="h-full bg-primary"
                    style={{ width: `${((selectedPeriod + 1) / periods.length) * 100}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="icon" onClick={nextPeriod}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Period/Sub-period Details */}
      <AnimatePresence mode="wait">
        {currentPeriod && (
          <motion.div
            key={selectedSubPeriod || currentPeriod.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Back Button for Sub-periods */}
            {selectedSubPeriod && (
              <Button variant="outline" onClick={goBackToPeriod} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à {currentPeriod.name}
              </Button>
            )}

            {/* Period/Sub-period Info */}
            <Card className={`bg-gradient-to-r ${currentSubPeriod ? 'from-muted to-muted/50' : currentPeriod.gradient} border-none`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {currentSubPeriod ? currentSubPeriod.name : currentPeriod.name}
                    </h3>
                    <p className="text-sm opacity-90">
                      {currentSubPeriod ? currentSubPeriod.description : currentPeriod.description}
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      {currentSubPeriod ? currentSubPeriod.dateRange : currentPeriod.dateRange}
                    </p>
                  </div>
                  
                  {!currentSubPeriod && (
                    <>
                      <div>
                        <h4 className="font-semibold mb-2">Classification UNESCO</h4>
                        <Badge variant="secondary">{currentPeriod.unescoCode}</Badge>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Cultures Principales</h4>
                        <div className="flex flex-wrap gap-1">
                          {currentPeriod.cultures.map((culture) => (
                            <Badge key={culture} variant="outline" className="text-xs">
                              {culture}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sub-periods Navigation - Only show if in main period */}
            {!selectedSubPeriod && currentPeriod.subPeriods.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentPeriod.subPeriods.map((subPeriod) => (
                  <motion.button
                    key={subPeriod.id}
                    onClick={() => goToSubPeriod(subPeriod.id)}
                    className="p-4 text-left bg-background border rounded-lg hover:shadow-md transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h4 className="font-medium mb-1">{subPeriod.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{subPeriod.dateRange}</p>
                    <p className="text-xs text-muted-foreground">{subPeriod.description}</p>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {subPeriod.symbols.length} symboles
                      </Badge>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un symbole ou une culture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {(filters.cultures.length > 0 || filters.themes.length > 0) && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.cultures.length + filters.themes.length}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Symbols Grid */}
            <div className={`grid gap-4 ${
              filters.viewMode === 'list' ? 'grid-cols-1' :
              filters.viewMode === 'mosaic' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-8' :
              'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
            }`}>
              {filteredSymbols.map((symbol) => (
                <motion.div
                  key={symbol.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/symbols/${symbol.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-200 hover-scale">
                      <CardContent className={filters.viewMode === 'list' ? 'p-4 flex gap-4 items-center' : 'p-3'}>
                        <div className={`bg-muted rounded-lg overflow-hidden ${
                          filters.viewMode === 'list' ? 'w-16 h-16 flex-shrink-0' :
                          filters.viewMode === 'mosaic' ? 'aspect-square' :
                          'aspect-square mb-3'
                        }`}>
                          {symbol.symbol_images?.[0]?.image_url ? (
                            <img
                              src={symbol.symbol_images[0].image_url}
                              alt={symbol.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Zap className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        {filters.viewMode !== 'mosaic' && (
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-1 line-clamp-1">{symbol.name}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">{symbol.culture}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {filteredSymbols.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Aucun symbole trouvé pour cette période ou cette recherche.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters Panel */}
      <AdvancedFiltersPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />
    </div>
  );
}
