import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { TaxonomyService } from '@/services/taxonomyService';
import { SymbolData } from '@/types/supabase';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';
import { TimelineBreadcrumb } from './TimelineBreadcrumb';
import { ParallaxPeriodHeader } from './ParallaxPeriodHeader';
import { AnimatedSymbolGrid } from './AnimatedSymbolGrid';
import { TimelineNavigation } from './TimelineNavigation';

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
  gradient: string;
  cultures: string[];
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
    { id: 'paleolithique', name: 'Paléolithique', dateRange: '-40,000 à -10,000', description: 'Art pariétal et premiers outils symboliques', color: 'hsl(var(--chart-1))', gradient: 'from-chart-1 to-chart-1/50', cultures: ['Chasseurs-cueilleurs'] },
    { id: 'mesolithique', name: 'Mésolithique', dateRange: '-10,000 à -8,000', description: 'Transition vers la sédentarisation', color: 'hsl(var(--chart-1))', gradient: 'from-chart-1 to-chart-1/60', cultures: ['Chasseurs-cueilleurs'] },
    { id: 'neolithique', name: 'Néolithique', dateRange: '-8,000 à -3,000', description: 'Agriculture et céramique symbolique', color: 'hsl(var(--chart-1))', gradient: 'from-chart-1 to-chart-1/70', cultures: ['Agriculteurs'] },
    { id: 'age-bronze', name: 'Âge du Bronze', dateRange: '-3,000 à -800', description: 'Métallurgie et commerce', color: 'hsl(var(--chart-1))', gradient: 'from-chart-1 to-chart-1/80', cultures: ['Métallurgistes'] }
  ],
  'antiquite': [
    { id: 'grece-archaique', name: 'Grèce archaïque', dateRange: '-800 à -500', description: 'Émergence de la civilisation grecque', color: 'hsl(var(--chart-2))', gradient: 'from-chart-2 to-chart-2/50', cultures: ['Grecs'] },
    { id: 'grece-classique', name: 'Grèce classique', dateRange: '-500 à -300', description: 'Apogée de la culture grecque', color: 'hsl(var(--chart-2))', gradient: 'from-chart-2 to-chart-2/60', cultures: ['Grecs'] },
    { id: 'hellenistique', name: 'Période hellénistique', dateRange: '-300 à -30', description: 'Expansion de la culture grecque', color: 'hsl(var(--chart-2))', gradient: 'from-chart-2 to-chart-2/70', cultures: ['Hellénistique'] },
    { id: 'empire-romain', name: 'Empire romain', dateRange: '-30 à 500', description: 'Domination romaine et syncrétisme', color: 'hsl(var(--chart-2))', gradient: 'from-chart-2 to-chart-2/80', cultures: ['Romains'] }
  ],
  'moyen-age': [
    { id: 'haut-moyen-age', name: 'Haut Moyen Âge', dateRange: '500-1000', description: 'Christianisation et royaumes barbares', color: 'hsl(var(--chart-3))', gradient: 'from-chart-3 to-chart-3/50', cultures: ['Mérovingien', 'Carolingien'] },
    { id: 'moyen-age-central', name: 'Moyen Âge central', dateRange: '1000-1300', description: 'Féodalité et art roman', color: 'hsl(var(--chart-3))', gradient: 'from-chart-3 to-chart-3/60', cultures: ['Féodal', 'Roman'] },
    { id: 'bas-moyen-age', name: 'Bas Moyen Âge', dateRange: '1300-1500', description: 'Art gothique et renaissance urbaine', color: 'hsl(var(--chart-3))', gradient: 'from-chart-3 to-chart-3/70', cultures: ['Gothique'] }
  ],
  'renaissance': [
    { id: 'renaissance-italienne', name: 'Renaissance italienne', dateRange: '1400-1500', description: 'Humanisme et renouveau artistique', color: 'hsl(var(--chart-4))', gradient: 'from-chart-4 to-chart-4/50', cultures: ['Renaissance italienne'] },
    { id: 'renaissance-nord', name: 'Renaissance du Nord', dateRange: '1500-1600', description: 'Diffusion de la Renaissance en Europe', color: 'hsl(var(--chart-4))', gradient: 'from-chart-4 to-chart-4/60', cultures: ['Renaissance nordique'] },
    { id: 'baroque', name: 'Baroque', dateRange: '1600-1700', description: 'Art dramatique et contre-réforme', color: 'hsl(var(--chart-4))', gradient: 'from-chart-4 to-chart-4/70', cultures: ['Baroque'] }
  ],
  'moderne': [
    { id: 'lumieres', name: 'Siècle des Lumières', dateRange: '1700-1800', description: 'Rationalisme et révolutions', color: 'hsl(var(--chart-5))', gradient: 'from-chart-5 to-chart-5/50', cultures: ['Lumières'] },
    { id: '19e-siecle', name: 'XIXe siècle', dateRange: '1800-1900', description: 'Industrialisation et nationalisme', color: 'hsl(var(--chart-5))', gradient: 'from-chart-5 to-chart-5/60', cultures: ['Industriel'] },
    { id: '20e-siecle', name: 'XXe siècle', dateRange: '1900-2000', description: 'Modernité et avant-gardes', color: 'hsl(var(--chart-5))', gradient: 'from-chart-5 to-chart-5/70', cultures: ['Moderne'] },
    { id: '21e-siecle', name: 'XXIe siècle', dateRange: '2000-aujourd\'hui', description: 'Mondialisation numérique', color: 'hsl(var(--chart-5))', gradient: 'from-chart-5 to-chart-5/80', cultures: ['Contemporain'] }
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
        <motion.div
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Enhanced Header with parallax */}
      <motion.div 
        className="text-center space-y-4 relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary/5 to-secondary/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 pattern-dots-lg opacity-5" />
        <motion.h1 
          className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Timeline Interactive des Symboles
        </motion.h1>
        <motion.p 
          className="text-muted-foreground max-w-2xl mx-auto text-lg relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explorez l'évolution des symboles à travers les époques selon la classification UNESCO
        </motion.p>
      </motion.div>

      {/* Breadcrumb */}
      <TimelineBreadcrumb items={breadcrumbItems} />

      {/* Timeline Navigation - Only show if not in sub-period */}
      {!selectedSubPeriod && (
        <TimelineNavigation
          periods={periods}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onNext={nextPeriod}
          onPrev={prevPeriod}
        />
      )}

      {/* Period/Sub-period Details with Parallax */}
      <AnimatePresence mode="wait">
        {currentPeriod && (
          <motion.div
            key={selectedSubPeriod || currentPeriod.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Back Button for Sub-periods */}
            {selectedSubPeriod && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Button variant="outline" onClick={goBackToPeriod} className="mb-6 hover:shadow-md transition-shadow">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour à {currentPeriod.name}
                </Button>
              </motion.div>
            )}

            {/* Parallax Period Header */}
            <ParallaxPeriodHeader 
              period={currentSubPeriod || currentPeriod} 
              isSubPeriod={!!currentSubPeriod}
            />

            {/* Sub-periods Navigation - Only show if in main period */}
            {!selectedSubPeriod && currentPeriod.subPeriods.length > 0 && (
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, staggerChildren: 0.1 }}
              >
                {currentPeriod.subPeriods.map((subPeriod, index) => (
                  <motion.button
                    key={subPeriod.id}
                    onClick={() => goToSubPeriod(subPeriod.id)}
                    className="group p-4 text-left bg-gradient-to-br from-background to-muted/30 border border-muted/50 rounded-lg hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <div className="relative">
                      <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                        {subPeriod.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">{subPeriod.dateRange}</p>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{subPeriod.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs group-hover:border-primary/50">
                          {subPeriod.symbols.length} symboles
                        </Badge>
                        <motion.div
                          className="w-1.5 h-1.5 bg-primary rounded-full opacity-0 group-hover:opacity-100"
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.2 }}
                        />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Enhanced Search and Filters */}
            <motion.div 
              className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un symbole ou une culture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/80 backdrop-blur-sm"
                />
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(true)}
                  className="hover:shadow-md transition-shadow bg-background/80 backdrop-blur-sm"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                  {(filters.cultures.length > 0 || filters.themes.length > 0) && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.cultures.length + filters.themes.length}
                    </Badge>
                  )}
                </Button>
              </motion.div>
            </motion.div>

            {/* Enhanced Symbols Grid */}
            <div className="min-h-[400px]">
              <AnimatedSymbolGrid 
                symbols={filteredSymbols}
                viewMode={filters.viewMode}
                isVisible={true}
              />

              {filteredSymbols.length === 0 && (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground text-lg">
                    Aucun symbole trouvé pour cette période ou cette recherche.
                  </p>
                  <p className="text-muted-foreground/70 text-sm mt-2">
                    Essayez de modifier vos filtres ou votre recherche.
                  </p>
                </motion.div>
              )}
            </div>
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
