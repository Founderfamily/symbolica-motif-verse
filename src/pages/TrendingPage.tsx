
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { I18nText } from '@/components/ui/i18n-text';
import { TrendingStatsCards } from '@/components/trending/TrendingStatsCards';
import { TrendingSymbolGrid } from '@/components/trending/TrendingSymbolGrid';
import { TrendingSidebar } from '@/components/trending/TrendingSidebar';
import { useTrendingSymbols, useTrendingStats, useTrendingCategories, useRecentActivity } from '@/hooks/useTrending';

const TrendingPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  // Hooks optimisés avec gestion d'erreur et cache
  const { data: trendingSymbols, isLoading: symbolsLoading, error: symbolsError } = useTrendingSymbols({
    timeFrame,
    limit: 12
  });

  const { data: stats, isLoading: statsLoading } = useTrendingStats();
  const { data: categories = [], isLoading: categoriesLoading } = useTrendingCategories();
  const { data: activities = [], isLoading: activitiesLoading } = useRecentActivity();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="title" ns="trending">Tendances</I18nText>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            <I18nText translationKey="description" ns="trending">
              Découvrez les symboles, collections et découvertes les plus populaires de la communauté
            </I18nText>
          </p>
        </div>

        {/* Stats Cards */}
        <TrendingStatsCards stats={stats} isLoading={statsLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
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

              <TabsContent value={timeFrame}>
                {symbolsError ? (
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
                  symbols={trendingSymbols || []} 
                  isLoading={symbolsLoading} 
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TrendingSidebar 
              categories={categories}
              activities={activities}
              isLoadingCategories={categoriesLoading}
              isLoadingActivities={activitiesLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
