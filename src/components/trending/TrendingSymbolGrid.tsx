
import React from 'react';
import { TrendingSymbol } from '@/services/trendingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart } from 'lucide-react';

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
        <p className="text-slate-600">Aucun symbole tendance disponible pour le moment</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {symbols.map((symbol, index) => (
        <Card key={symbol.id} className="hover:shadow-lg transition-all cursor-pointer group">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {symbol.name}
                </CardTitle>
                <p className="text-sm text-slate-500">{symbol.culture} • {symbol.period}</p>
              </div>
              {index < 3 && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  #{index + 1}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {symbol.description && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {symbol.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-slate-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{symbol.view_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{symbol.like_count}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Score: {symbol.trending_score}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
