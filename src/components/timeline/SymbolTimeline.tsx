
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CompletenessBadge } from '@/components/ui/completeness-badge';
import { SymbolCompletenessService, SymbolWithCompleteness, CompletenessLevel } from '@/services/symbolCompletenessService';
import { TrendingSymbol } from '@/services/trendingService';
import { Clock, Filter, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SymbolTimelineProps {
  symbols: TrendingSymbol[];
  isLoading?: boolean;
}

const HISTORICAL_PERIODS = [
  { key: 'all', label: 'Toutes les périodes', order: 0 },
  { key: 'Néolithique', label: 'Néolithique', order: 1 },
  { key: 'Antiquité', label: 'Antiquité', order: 2 },
  { key: 'Moyen Âge', label: 'Moyen Âge', order: 3 },
  { key: 'Renaissance', label: 'Renaissance', order: 4 },
  { key: 'Époque moderne', label: 'Époque moderne', order: 5 },
  { key: 'Contemporain', label: 'Contemporain', order: 6 }
];

const CULTURES = [
  'all', 'Celtique', 'Grecque', 'Romaine', 'Nordique', 'Japonaise', 
  'Chinoise', 'Indienne', 'Africaine', 'Egyptienne', 'Aztèque', 'Maya'
];

export const SymbolTimeline: React.FC<SymbolTimelineProps> = ({ symbols, isLoading }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedCulture, setSelectedCulture] = useState<string>('all');
  const [selectedCompletenessLevel, setSelectedCompletenessLevel] = useState<CompletenessLevel | 'all'>('all');
  const [showStats, setShowStats] = useState(false);

  // Enrichissement des symboles avec les données de complétude
  const enrichedSymbols = useMemo(() => {
    if (!symbols) return [];
    const enriched = SymbolCompletenessService.enrichWithCompleteness(symbols);
    return SymbolCompletenessService.sortByCompleteness(enriched);
  }, [symbols]);

  // Filtrage des symboles
  const filteredSymbols = useMemo(() => {
    let filtered = enrichedSymbols;

    if (selectedPeriod !== 'all') {
      filtered = filtered.filter(symbol => symbol.period === selectedPeriod);
    }

    if (selectedCulture !== 'all') {
      filtered = filtered.filter(symbol => symbol.culture === selectedCulture);
    }

    if (selectedCompletenessLevel !== 'all') {
      filtered = SymbolCompletenessService.filterByCompletenessLevel(filtered, selectedCompletenessLevel);
    }

    return filtered;
  }, [enrichedSymbols, selectedPeriod, selectedCulture, selectedCompletenessLevel]);

  // Statistiques
  const stats = useMemo(() => {
    return SymbolCompletenessService.getCompletenessStats(filteredSymbols);
  }, [filteredSymbols]);

  // Groupement par période pour la timeline
  const symbolsByPeriod = useMemo(() => {
    const grouped = filteredSymbols.reduce((acc, symbol) => {
      const period = symbol.period || 'Non spécifié';
      if (!acc[period]) {
        acc[period] = [];
      }
      acc[period].push(symbol);
      return acc;
    }, {} as Record<string, SymbolWithCompleteness[]>);

    // Trier les périodes par ordre historique
    const sortedPeriods = Object.keys(grouped).sort((a, b) => {
      const periodA = HISTORICAL_PERIODS.find(p => p.key === a) || { order: 999 };
      const periodB = HISTORICAL_PERIODS.find(p => p.key === b) || { order: 999 };
      return periodA.order - periodB.order;
    });

    return sortedPeriods.map(period => ({
      period,
      symbols: grouped[period]
    }));
  }, [filteredSymbols]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec filtres et statistiques */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Timeline des Symboles
              </h2>
              <p className="text-blue-700 text-sm">
                {filteredSymbols.length} symboles • Score moyen: {stats.averageScore} • Complétude: {stats.averageCompletion}%
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            {showStats ? 'Masquer' : 'Statistiques'}
          </Button>
        </div>

        {/* Statistiques détaillées */}
        {showStats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 p-4 bg-white/60 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.complete}</div>
              <div className="text-xs text-green-700">Complets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.wellDocumented}</div>
              <div className="text-xs text-blue-700">Bien documentés</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.partiallyDocumented}</div>
              <div className="text-xs text-orange-700">Partiellement</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.toComplete}</div>
              <div className="text-xs text-red-700">À compléter</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-600">{stats.total}</div>
              <div className="text-xs text-slate-700">Total</div>
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Période historique" />
            </SelectTrigger>
            <SelectContent>
              {HISTORICAL_PERIODS.map(period => (
                <SelectItem key={period.key} value={period.key}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCulture} onValueChange={setSelectedCulture}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Culture" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les cultures</SelectItem>
              {CULTURES.slice(1).map(culture => (
                <SelectItem key={culture} value={culture}>
                  {culture}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCompletenessLevel} onValueChange={(value) => setSelectedCompletenessLevel(value as CompletenessLevel | 'all')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Niveau de complétude" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les niveaux</SelectItem>
              <SelectItem value="complete">Complets</SelectItem>
              <SelectItem value="well_documented">Bien documentés</SelectItem>
              <SelectItem value="partially_documented">Partiellement documentés</SelectItem>
              <SelectItem value="to_complete">À compléter</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Timeline par période */}
      {symbolsByPeriod.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun symbole trouvé avec ces filtres.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {symbolsByPeriod.map(({ period, symbols: periodSymbols }) => (
            <div key={period} className="relative">
              {/* Ligne de timeline */}
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-400 to-transparent"></div>
              
              {/* En-tête de période */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg z-10">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">{period}</h3>
                  <p className="text-slate-600">
                    {periodSymbols.length} symbole{periodSymbols.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Grille des symboles */}
              <div className="ml-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {periodSymbols.map((symbol) => (
                  <SymbolTimelineCard key={symbol.id} symbol={symbol} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Composant carte pour un symbole dans la timeline
interface SymbolTimelineCardProps {
  symbol: SymbolWithCompleteness;
}

const SymbolTimelineCard: React.FC<SymbolTimelineCardProps> = ({ symbol }) => {
  const { completeness } = symbol;
  
  return (
    <Link to={`/symbols/${symbol.id}`} className="block group">
      <Card className={`
        overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        ${completeness.level === 'to_complete' ? 'opacity-75 border-red-200' : ''}
        ${completeness.level === 'complete' ? 'border-green-200 ring-1 ring-green-100' : ''}
        ${completeness.level === 'well_documented' ? 'border-blue-200 ring-1 ring-blue-100' : ''}
      `}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className={`text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors ${
                completeness.level === 'to_complete' ? 'text-slate-600' : 'text-slate-900'
              }`}>
                {symbol.name}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                {symbol.culture} • {symbol.period}
              </p>
            </div>
            
            <div className="flex flex-col gap-2 items-end">
              <CompletenessBadge level={completeness.level} size="sm" />
              {completeness.score > 0 && (
                <Badge variant="outline" className="text-xs">
                  Score: {completeness.score}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {symbol.description && (
            <p className="text-sm text-slate-600 line-clamp-3 mb-3">
              {symbol.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{Math.round(completeness.completionPercentage)}% complété</span>
            <div className="flex items-center gap-2">
              <span>{symbol.view_count} vues</span>
              <span>•</span>
              <span>{symbol.like_count} likes</span>
            </div>
          </div>
          
          {completeness.missingFields.length > 0 && (
            <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              💡 Manque: {completeness.missingFields.join(', ')}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default SymbolTimeline;
