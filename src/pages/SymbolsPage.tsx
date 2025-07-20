import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { EmptyStateCard } from '@/components/search/EmptyStateCard';
import { Button } from '@/components/ui/button';
import { Filter, BarChart3, AlertCircle, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageStatsWidget } from '@/components/admin/ImageStatsWidget';

import { SymbolCompletenessService, SymbolWithCompleteness } from '@/services/symbolCompletenessService';
import { CompletenessBadge } from '@/components/ui/completeness-badge';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';

const SymbolsPage: React.FC = () => {
  const [showOnlyWithPhotos, setShowOnlyWithPhotos] = useState(false);
  const [selectedCompletenessLevel, setSelectedCompletenessLevel] = useState<'all' | 'complete' | 'well_documented' | 'partially_documented' | 'to_complete'>('all');

  const { data: symbols, isLoading, error } = useQuery({
    queryKey: ['symbols'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching symbols:", error);
        throw error;
      }
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  // Process symbols with completeness scoring
  const processedSymbols = useMemo(() => {
    if (!symbols || symbols.length === 0) return [];
    
    console.log('🔍 [SymbolsPage] Processing symbols with completeness system...');
    
    // Convert SymbolData to TrendingSymbol format for compatibility
    const trendingSymbols = symbols.map((symbol, index) => ({
      id: symbol.id,
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      description: symbol.description,
      created_at: symbol.created_at || '',
      trending_score: Math.max(100 - index * 2, 20), // Base score
      view_count: Math.floor(Math.random() * 200) + 50,
      like_count: Math.floor(Math.random() * 50) + 10,
      // Add fields for completeness evaluation
      significance: symbol.significance,
      historical_context: symbol.historical_context,
      tags: symbol.tags
    }));

    // Enrich with completeness data
    let enriched = SymbolCompletenessService.enrichWithCompleteness(trendingSymbols);
    
    // Apply filters
    if (showOnlyWithPhotos) {
      enriched = enriched.filter(s => s.completeness.hasImage);
    }
    
    if (selectedCompletenessLevel !== 'all') {
      enriched = SymbolCompletenessService.filterByCompletenessLevel(enriched, selectedCompletenessLevel);
    }
    
    // Sort by completeness priority
    const sorted = SymbolCompletenessService.sortByCompleteness(enriched);
    
    console.log('✅ [SymbolsPage] Processed', sorted.length, 'symbols with completeness scoring');
    return sorted;
  }, [symbols, showOnlyWithPhotos, selectedCompletenessLevel]);

  // Calculate completeness statistics
  const completenessStats = useMemo(() => {
    if (processedSymbols.length === 0) return null;
    return SymbolCompletenessService.getCompletenessStats(processedSymbols);
  }, [processedSymbols]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-96 mx-auto animate-pulse"></div>
          </div>
          <EnhancedSymbolGrid symbols={[]} loading={true} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-red-600 mb-2">Erreur lors du chargement des symboles</p>
          <p className="text-slate-600">Veuillez réessayer plus tard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Symboles Culturels
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Découvrez notre collection de symboles, avec un système de chargement d'images optimisé
          </p>
        </div>

        {/* Navigation to Timeline */}
        <div className="mb-6 text-center">
          <Link to="/timeline">
            <Button variant="outline" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Voir la Timeline Historique
            </Button>
          </Link>
        </div>

        {/* Statistics and filters with image stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-blue-900 font-semibold mb-1">
                      {processedSymbols.length} symboles disponibles
                    </p>
                    {completenessStats && (
                      <div className="flex items-center gap-4 text-sm text-blue-700">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          <span>{completenessStats.complete} complets</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          <span>{completenessStats.wellDocumented} bien documentés</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-orange-400"></span> 
                          <span>{completenessStats.partiallyDocumented} partiels</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-red-400"></span>
                          <span>{completenessStats.toComplete} à compléter</span>
                        </div>
                        <div className="text-blue-600 font-medium ml-2">
                          Score moyen: {completenessStats.averageScore}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={showOnlyWithPhotos ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowOnlyWithPhotos(!showOnlyWithPhotos)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  {showOnlyWithPhotos ? "Tous" : "Avec photos"}
                </Button>

                <Select value={selectedCompletenessLevel} onValueChange={(value) => setSelectedCompletenessLevel(value as any)}>
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
          </div>
          
          {/* Image Statistics Widget */}
          <div className="lg:col-span-1">
            <ImageStatsWidget />
          </div>
        </div>

        {/* Symbols Grid with optimized loading */}
        <EnhancedSymbolGrid symbols={processedSymbols} />

        {/* Empty state for filters */}
        {(showOnlyWithPhotos || selectedCompletenessLevel !== 'all') && processedSymbols.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun symbole trouvé avec ces filtres.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Enhanced Symbol Grid component
interface EnhancedSymbolGridProps {
  symbols: SymbolWithCompleteness[];
  loading?: boolean;
}

const EnhancedSymbolGrid: React.FC<EnhancedSymbolGridProps> = ({ symbols, loading }) => {
  if (symbols.length === 0) {
    return <EmptyStateCard />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {symbols.map(symbol => (
        <EnhancedSymbolCardWithCompleteness key={symbol.id} symbol={symbol} />
      ))}
    </div>
  );
};

// Enhanced Symbol Card with completeness
interface EnhancedSymbolCardWithCompletenessProps {
  symbol: SymbolWithCompleteness;
}

const EnhancedSymbolCardWithCompleteness: React.FC<EnhancedSymbolCardWithCompletenessProps> = ({ symbol }) => {
  const { completeness } = symbol;
  
  return (
    <Link to={`/symbols/${symbol.id}`} className="block group">
      <Card className={`
        overflow-hidden shadow-sm hover:shadow-xl border-2 transition-all duration-300
        hover:-translate-y-1
        ${completeness.level === 'complete' ? 'border-green-200 ring-1 ring-green-100' : ''}
        ${completeness.level === 'well_documented' ? 'border-blue-200 ring-1 ring-blue-100' : ''}
        ${completeness.level === 'partially_documented' ? 'border-orange-200 ring-1 ring-orange-100' : ''}
        ${completeness.level === 'to_complete' ? 'opacity-90 border-red-200' : ''}
      `}>
        <AspectRatio ratio={1} className="w-full bg-slate-50 relative overflow-hidden">
          <div className="absolute top-2 left-2 z-20 flex gap-2 flex-wrap max-w-[calc(100%-4rem)]">
            <CompletenessBadge 
              level={completeness.level} 
              size="sm"
              completionPercentage={completeness.completionPercentage}
            />
            {completeness.hasImage && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                📸 Image
              </Badge>
            )}
          </div>

          <img
            src={getSymbolImageSource(symbol)}
            alt={symbol.name}
            className="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
          />
        </AspectRatio>
        
        <div className="p-4 bg-white/90 backdrop-blur-sm relative">
          <h4 className={`text-lg font-serif font-medium truncate mb-2 ${
            completeness.level === 'to_complete' ? 'text-slate-600' : 'text-slate-900'
          }`}>
            {symbol.name}
          </h4>
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500 truncate flex-1">
              {symbol.culture} • {symbol.period}
            </span>
            <Badge variant="outline" className="text-xs ml-2">
              Score: {completeness.score}
            </Badge>
          </div>

          {symbol.description && (
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {symbol.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
            <span>{Math.round(completeness.completionPercentage)}% complété</span>
            <div className="flex items-center gap-2">
              <span>{symbol.view_count} vues</span>
              <span>•</span>
              <span>{symbol.like_count} likes</span>
            </div>
          </div>

          {/* Missing fields encouragement */}
          {completeness.missingFields.length > 0 && (
            <div className="p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              💡 Manque: {completeness.missingFields.slice(0, 2).join(', ')}
              {completeness.missingFields.length > 2 && ` (+${completeness.missingFields.length - 2})`}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};

// Helper function to get image source
function getSymbolImageSource(symbol: SymbolWithCompleteness): string {
  // Use existing image mapping logic or fallback
  const symbolToLocalImage: Record<string, string> = {
    "Triskèle Celtique": "/images/symbols/triskelion.png",
    "Fleur de Lys": "/images/symbols/fleur-de-lys.png", 
    "Méandre Grec": "/images/symbols/greek-meander.png",
    "Mandala": "/images/symbols/mandala.png",
    "Symbole Adinkra": "/images/symbols/adinkra.png",
    "Motif Seigaiha": "/images/symbols/seigaiha.png",
  };
  
  return symbolToLocalImage[symbol.name] || "/placeholder.svg";
}

export default SymbolsPage;
