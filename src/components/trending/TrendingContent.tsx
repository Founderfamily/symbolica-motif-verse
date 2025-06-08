
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingSymbolGrid } from './TrendingSymbolGrid';
import { TrendingFilters } from './TrendingFilters';
import { TrendingSymbol } from '@/services/trendingService';

interface TrendingContentProps {
  timeFrame: 'day' | 'week' | 'month';
  symbols: TrendingSymbol[] | undefined;
  isLoading: boolean;
  error: any;
}

export const TrendingContent: React.FC<TrendingContentProps> = ({
  timeFrame,
  symbols,
  isLoading,
  error
}) => {
  return (
    <div className="lg:col-span-3">
      <TrendingFilters timeFrame={timeFrame} />
      
      <TabsContent value={timeFrame}>
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">
              <I18nText translationKey="errorLoadingData" ns="trending">Erreur lors du chargement des données</I18nText>
            </p>
            <p className="text-sm text-slate-500">
              Les données de fallback sont affichées ci-dessous.
            </p>
          </div>
        ) : null}
        
        <TrendingSymbolGrid 
          symbols={symbols || []} 
          isLoading={isLoading} 
        />
      </TabsContent>
    </div>
  );
};
