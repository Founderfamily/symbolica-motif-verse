
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { I18nText } from '@/components/ui/i18n-text';

interface TrendingFiltersProps {
  timeFrame: 'day' | 'week' | 'month';
}

export const TrendingFilters: React.FC<TrendingFiltersProps> = ({ timeFrame }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-slate-900">
        <I18nText translationKey="popularSymbols" ns="trending">Symboles Populaires</I18nText>
      </h2>
      <TabsList>
        <TabsTrigger value="day">
          <I18nText translationKey="timeframes.day" ns="trending">24h</I18nText>
        </TabsTrigger>
        <TabsTrigger value="week">
          <I18nText translationKey="timeframes.week" ns="trending">7j</I18nText>
        </TabsTrigger>
        <TabsTrigger value="month">
          <I18nText translationKey="timeframes.month" ns="trending">30j</I18nText>
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
