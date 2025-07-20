
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Image, AlertCircle, CheckCircle, Clock, Upload } from 'lucide-react';

export const ImageStatsWidget: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['image-stats'],
    queryFn: async () => {
      const [symbolsResult, imagesResult] = await Promise.all([
        supabase.from('symbols').select('id, name, culture').limit(1000),
        supabase.from('symbol_images').select('symbol_id, image_type').limit(1000)
      ]);

      if (symbolsResult.error) throw symbolsResult.error;
      if (imagesResult.error) throw imagesResult.error;

      const symbols = symbolsResult.data || [];
      const images = imagesResult.data || [];
      
      const symbolsWithImages = new Set(images.map(img => img.symbol_id));
      const symbolsWithoutImages = symbols.filter(s => !symbolsWithImages.has(s.id));
      
      // Grouper par culture
      const cultureStats = symbols.reduce((acc, symbol) => {
        if (!acc[symbol.culture]) {
          acc[symbol.culture] = { total: 0, withImages: 0 };
        }
        acc[symbol.culture].total++;
        if (symbolsWithImages.has(symbol.id)) {
          acc[symbol.culture].withImages++;
        }
        return acc;
      }, {} as Record<string, { total: number; withImages: number }>);

      return {
        totalSymbols: symbols.length,
        symbolsWithImages: symbolsWithImages.size,
        symbolsWithoutImages: symbolsWithoutImages.length,
        coveragePercentage: Math.round((symbolsWithImages.size / symbols.length) * 100),
        cultureStats,
        missingImages: symbolsWithoutImages.slice(0, 10) // Top 10 pour l'affichage
      };
    },
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (!stats) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Image className="h-5 w-5" />
          État des Images
        </h3>
        <Badge variant={stats.coveragePercentage > 80 ? "default" : stats.coveragePercentage > 50 ? "secondary" : "destructive"}>
          {stats.coveragePercentage}% couverture
        </Badge>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-green-700">{stats.symbolsWithImages}</div>
          <div className="text-xs text-green-600">Avec images</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <AlertCircle className="h-6 w-6 text-orange-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-orange-700">{stats.symbolsWithoutImages}</div>
          <div className="text-xs text-orange-600">Sans images</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
          <div className="text-2xl font-bold text-blue-700">{stats.totalSymbols}</div>
          <div className="text-xs text-blue-600">Total</div>
        </div>
      </div>

      {/* Top des cultures manquantes */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-3">Cultures avec le plus d'images manquantes:</h4>
        <div className="space-y-2">
          {Object.entries(stats.cultureStats)
            .sort(([,a], [,b]) => (b.total - b.withImages) - (a.total - a.withImages))
            .slice(0, 5)
            .map(([culture, data]) => {
              const missing = data.total - data.withImages;
              if (missing === 0) return null;
              
              return (
                <div key={culture} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{culture}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-600">{missing} manquantes</span>
                    <Badge variant="outline" className="text-xs">
                      {data.withImages}/{data.total}
                    </Badge>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Symboles prioritaires à illustrer */}
      {stats.missingImages.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-2">Symboles prioritaires à illustrer:</h4>
          <div className="space-y-1 mb-3">
            {stats.missingImages.slice(0, 3).map((symbol) => (
              <div key={symbol.id} className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded">
                <span className="font-medium">{symbol.name}</span>
                <span className="text-slate-400 ml-2">({symbol.culture})</span>
              </div>
            ))}
            {stats.missingImages.length > 3 && (
              <div className="text-xs text-slate-400">
                ... et {stats.missingImages.length - 3} autres
              </div>
            )}
          </div>
          
          <Button size="sm" variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Gérer les images manquantes
          </Button>
        </div>
      )}
    </Card>
  );
};
