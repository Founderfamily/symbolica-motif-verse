import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TaxonomyService } from '@/services/taxonomyService';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { Link } from 'react-router-dom';

interface SymbolWithImages extends SymbolData {
  symbol_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean | null;
  }>;
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
}

const TIMELINE_PERIODS: Omit<TimelinePeriod, 'symbols'>[] = [
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
  const [periods, setPeriods] = useState<TimelinePeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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
            .limit(6);

          return {
            ...period,
            symbols: (symbols || []) as SymbolWithImages[]
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

  const nextPeriod = () => {
    setSelectedPeriod((prev) => (prev + 1) % periods.length);
  };

  const prevPeriod = () => {
    setSelectedPeriod((prev) => (prev - 1 + periods.length) % periods.length);
  };

  const filteredSymbols = currentPeriod?.symbols.filter(symbol =>
    symbol.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symbol.culture?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    symbol.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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

      {/* Timeline Navigation */}
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

      {/* Period Details */}
      <AnimatePresence mode="wait">
        {currentPeriod && (
          <motion.div
            key={currentPeriod.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Period Info */}
            <Card className={`bg-gradient-to-r ${currentPeriod.gradient} border-none`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{currentPeriod.name}</h3>
                    <p className="text-sm opacity-90">{currentPeriod.description}</p>
                  </div>
                  
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
                </div>
              </CardContent>
            </Card>

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
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Symbols Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {filteredSymbols.map((symbol) => (
                <motion.div
                  key={symbol.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to={`/symbols/${symbol.id}`}>
                    <Card className="group hover:shadow-lg transition-all duration-200 hover-scale">
                      <CardContent className="p-3">
                        <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
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
                        <h4 className="font-medium text-sm mb-1 line-clamp-1">{symbol.name}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{symbol.culture}</p>
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
    </div>
  );
}