
import React from 'react';
import { TrendingSymbol } from '@/services/trendingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, TrendingUp } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

interface TrendingSymbolGridProps {
  symbols: TrendingSymbol[];
  isLoading: boolean;
}

export const TrendingSymbolGrid: React.FC<TrendingSymbolGridProps> = ({ symbols, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-slate-200 rounded mb-4"></div>
              <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!symbols || symbols.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="mx-auto h-12 w-12 text-slate-400 mb-4" />
        <p className="text-slate-600 text-lg mb-2">
          <I18nText translationKey="noSymbolsAvailable" ns="trending">
            Aucun symbole tendance disponible pour le moment
          </I18nText>
        </p>
        <p className="text-slate-500 text-sm">
          <I18nText translationKey="checkBackLater" ns="trending">
            Revenez bientôt pour découvrir les dernières tendances
          </I18nText>
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {symbols.map((symbol, index) => (
        <Card key={symbol.id} className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-transparent hover:border-l-amber-400">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                  {symbol.name}
                </CardTitle>
                <p className="text-sm text-slate-500 mt-1">
                  {symbol.culture} • {symbol.period}
                </p>
              </div>
              {index < 3 && (
                <Badge variant="secondary" className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 flex items-center gap-1">
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
                    symbol.trending_score >= 70 ? 'border-amber-200 text-amber-700 bg-amber-50' :
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
  );
};
