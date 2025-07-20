import React from 'react';
import { TrendingSymbol } from '@/services/trendingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PhotoStatusBadge } from '@/components/ui/photo-status-badge';
import { Eye, Heart, TrendingUp, Plus, Sparkles, Image, Filter } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolVisibilityService, SymbolWithVisibility } from '@/services/symbolVisibilityService';
import { Button } from '@/components/ui/button';

interface TrendingSymbolGridProps {
  symbols: TrendingSymbol[];
  isLoading: boolean;
}

export const TrendingSymbolGrid: React.FC<TrendingSymbolGridProps> = ({ symbols, isLoading }) => {
  const [showOnlyWithPhotos, setShowOnlyWithPhotos] = React.useState(false);
  
  console.log('🎨 [TrendingSymbolGrid] Rendering with:', { symbolsCount: symbols?.length, isLoading });

  // Enrichir les symboles avec les données de visibilité
  const enrichedSymbols = React.useMemo(() => {
    if (!symbols || symbols.length === 0) return [];
    
    const withVisibility = SymbolVisibilityService.enrichWithVisibility(symbols);
    const sorted = SymbolVisibilityService.sortByVisibility(withVisibility);
    
    // Filtrer par présence de photos si nécessaire
    if (showOnlyWithPhotos) {
      return sorted.filter(s => s.hasPhoto);
    }
    
    return sorted;
  }, [symbols, showOnlyWithPhotos]);

  // Statistiques des photos
  const photoStats = React.useMemo(() => {
    if (!symbols || symbols.length === 0) return null;
    return SymbolVisibilityService.getPhotoStats(symbols);
  }, [symbols]);

  if (isLoading) {
    console.log('⏳ [TrendingSymbolGrid] Showing loading skeletons');
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-16 bg-slate-200 rounded mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!symbols || symbols.length === 0) {
    console.log('📭 [TrendingSymbolGrid] No symbols to display - showing community growth message');
    return (
      <div className="text-center py-16">
        <Sparkles className="mx-auto h-16 w-16 text-blue-500 mb-6" />
        <h3 className="text-2xl font-bold text-slate-900 mb-4">
          Communauté en construction
        </h3>
        <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto">
          Nous avons actuellement <strong>20 symboles</strong> et <strong>48 collections</strong> qui vous attendent ! 
          Soyez parmi les premiers à explorer et contribuer à cette base de connaissances unique.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-blue-900 text-lg">20 Symboles</p>
                <p className="text-blue-700">À découvrir dès maintenant</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-purple-900 text-lg">48 Collections</p>
                <p className="text-purple-700">Organisées par thème</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <Plus className="h-8 w-8 text-green-600 bg-green-100 rounded-full p-1.5" />
              <div className="text-left">
                <p className="font-semibold text-green-900">Contribuer</p>
                <p className="text-sm text-green-700">Partagez vos découvertes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-amber-600 bg-amber-100 rounded-full p-1.5" />
              <div className="text-left">
                <p className="font-semibold text-amber-900">Explorer</p>
                <p className="text-sm text-amber-700">Découvrez les symboles</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  console.log('✅ [TrendingSymbolGrid] Displaying', enrichedSymbols.length, 'symbols with visibility system');

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques et filtres */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-blue-900 font-semibold mb-1">
                {enrichedSymbols.length} symboles tendance
              </p>
              {photoStats && (
                <div className="flex items-center gap-4 text-sm text-blue-700">
                  <div className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    <span>{photoStats.withPhoto} avec photos</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{photoStats.withoutPhoto} sans photos</span>
                  </div>
                  <div className="text-blue-600 font-medium">
                    ({photoStats.percentageWithPhoto.toFixed(1)}% illustrés)
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Filtre photo */}
          <Button
            variant={showOnlyWithPhotos ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyWithPhotos(!showOnlyWithPhotos)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showOnlyWithPhotos ? "Tous" : "Avec photos"}
          </Button>
        </div>
      </div>

      {/* Grille des symboles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {enrichedSymbols.map((symbol, index) => (
          <SymbolVisibilityCard 
            key={symbol.id} 
            symbol={symbol} 
            index={index}
          />
        ))}
      </div>

      {/* Message si filtrage et aucun résultat */}
      {showOnlyWithPhotos && enrichedSymbols.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun symbole avec photo trouvé dans cette sélection.</p>
        </div>
      )}
    </div>
  );
};

// Composant pour une carte de symbole avec système de visibilité
interface SymbolVisibilityCardProps {
  symbol: SymbolWithVisibility;
  index: number;
}

const SymbolVisibilityCard: React.FC<SymbolVisibilityCardProps> = ({ symbol, index }) => {
  const isTopRanked = index < 3;
  const hasPhotoBonus = symbol.hasPhoto;
  
  return (
    <Card 
      className={`hover:shadow-lg transition-all cursor-pointer group border-l-4 ${
        hasPhotoBonus 
          ? 'border-l-green-400 hover:border-l-green-500' 
          : 'border-l-orange-300 hover:border-l-orange-400'
      } ${!hasPhotoBonus ? 'opacity-90' : ''}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg font-semibold transition-colors line-clamp-1 ${
              hasPhotoBonus 
                ? 'text-slate-900 group-hover:text-green-600' 
                : 'text-slate-700 group-hover:text-orange-600'
            }`}>
              {symbol.name}
            </CardTitle>
            <p className="text-sm text-slate-500 mt-1">
              {symbol.culture} • {symbol.period}
            </p>
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            {/* Badge de rang */}
            {isTopRanked && (
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                #{index + 1}
              </Badge>
            )}
            
            {/* Badge photo */}
            <PhotoStatusBadge hasPhoto={symbol.hasPhoto} />
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {symbol.description && (
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
              {symbol.description}
            </p>
          )}
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                <Eye className="w-4 h-4" />
                <span>{symbol.view_count.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1 hover:text-red-600 transition-colors">
                <Heart className="w-4 h-4" />
                <span>{symbol.like_count.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Score de visibilité */}
              <Badge 
                variant="outline" 
                className={`text-xs font-medium ${
                  symbol.visibilityScore >= 90 ? 'border-green-200 text-green-700 bg-green-50' :
                  symbol.visibilityScore >= 70 ? 'border-blue-200 text-blue-700 bg-blue-50' :
                  'border-slate-200 text-slate-600 bg-slate-50'
                }`}
              >
                {symbol.visibilityScore.toFixed(1)}
              </Badge>
              
              {/* Indicateur de bonus/malus */}
              {hasPhotoBonus && (
                <div className="w-2 h-2 rounded-full bg-green-400" title="Bonus photo" />
              )}
              {!hasPhotoBonus && (
                <div className="w-2 h-2 rounded-full bg-orange-400" title="Malus sans photo" />
              )}
            </div>
          </div>
          
          {/* Message d'encouragement pour les symboles sans photo */}
          {!hasPhotoBonus && (
            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              💡 Ajoutez une photo pour améliorer la visibilité de ce symbole
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
