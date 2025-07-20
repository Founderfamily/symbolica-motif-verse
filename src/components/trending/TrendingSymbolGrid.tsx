
import React from 'react';
import { TrendingSymbol } from '@/services/trendingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, TrendingUp, Plus, Sparkles } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface TrendingSymbolGridProps {
  symbols: TrendingSymbol[];
  isLoading: boolean;
}

export const TrendingSymbolGrid: React.FC<TrendingSymbolGridProps> = ({ symbols, isLoading }) => {
  console.log('🎨 [TrendingSymbolGrid] Rendering with:', { symbolsCount: symbols?.length, isLoading });

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

  console.log('✅ [TrendingSymbolGrid] Displaying', symbols.length, 'symbols');

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-blue-900 font-semibold mb-1">
              {symbols.length} symboles tendance
            </p>
            <p className="text-blue-700 text-sm">
              Découvrez les symboles les plus récents et populaires de notre collection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {symbols.map((symbol, index) => (
          <Card key={symbol.id} className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-blue-400">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {symbol.name}
                  </CardTitle>
                  <p className="text-sm text-slate-500 mt-1">
                    {symbol.culture} • {symbol.period}
                  </p>
                </div>
                {index < 3 && (
                  <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    #{index + 1}
                  </Badge>
                )}
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
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium ${
                      symbol.trending_score >= 90 ? 'border-green-200 text-green-700 bg-green-50' :
                      symbol.trending_score >= 70 ? 'border-blue-200 text-blue-700 bg-blue-50' :
                      'border-slate-200 text-slate-600 bg-slate-50'
                    }`}
                  >
                    {symbol.trending_score.toFixed(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
