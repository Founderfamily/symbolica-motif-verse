
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { trendingService } from '@/services/trendingService';
import SymbolTimeline from '@/components/timeline/SymbolTimeline';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';

const TimelinePage: React.FC = () => {
  console.log('🕒 [TimelinePage] Rendering timeline page');

  const { data: symbols = [], isLoading } = useQuery({
    queryKey: ['trending-symbols-timeline'],
    queryFn: () => trendingService.getTrendingSymbols('month', 50), // Plus de symboles pour la timeline
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête de la page */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">
              Timeline des Symboles
            </h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explorez l'évolution des symboles à travers les époques, triés par qualité de documentation et complétude des informations.
          </p>
        </div>

        {/* Cartes d'information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-blue-900 mb-2">Qualité Prioritaire</h3>
              <p className="text-blue-700 text-sm">
                Les symboles les mieux documentés apparaissent en premier
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-green-900 mb-2">Système de Score</h3>
              <p className="text-green-700 text-sm">
                Bonus/malus selon la complétude des informations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-purple-900 mb-2">Navigation Temporelle</h3>
              <p className="text-purple-700 text-sm">
                Filtrez par période historique et culture
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Composant Timeline principal */}
        <SymbolTimeline symbols={symbols} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default TimelinePage;
