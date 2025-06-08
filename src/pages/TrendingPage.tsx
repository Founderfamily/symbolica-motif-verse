
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { TrendingUp, Clock, Flame, Star } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';

const TrendingPage = () => {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month'>('week');

  // Fetch real trending data from database
  const { data: trendingSymbols, isLoading: symbolsLoading, error: symbolsError } = useQuery({
    queryKey: ['trending-symbols', timeFrame],
    queryFn: async () => {
      try {
        // Get symbols with their recent activity
        const { data, error } = await supabase
          .from('symbols')
          .select('*')
          .limit(12)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return (data as unknown) as SymbolData[];
      } catch (err) {
        console.error('Error fetching trending symbols:', err);
        return [];
      }
    }
  });

  // Fetch statistics from database
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['trending-stats'],
    queryFn: async () => {
      try {
        // Get real statistics from the database
        const [symbolsResult, contributionsResult, collectionsResult] = await Promise.all([
          supabase.from('symbols').select('*', { count: 'exact', head: true }),
          supabase.from('user_contributions').select('*', { count: 'exact', head: true }),
          supabase.from('collections').select('*', { count: 'exact', head: true })
        ]);

        return {
          symbolsCount: symbolsResult.count || 0,
          contributionsCount: contributionsResult.count || 0,
          collectionsCount: collectionsResult.count || 0,
          newToday: 0 // TODO: Calculate actual daily new items
        };
      } catch (err) {
        console.error('Error fetching stats:', err);
        return {
          symbolsCount: 0,
          contributionsCount: 0,
          collectionsCount: 0,
          newToday: 0
        };
      }
    }
  });

  // Trending statistics with real data
  const trendingStats = [
    {
      title: <I18nText translationKey="stats.popularSymbols" ns="trending">Symboles populaires</I18nText>,
      value: stats?.symbolsCount?.toString() || '0',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: <I18nText translationKey="stats.newDiscoveries" ns="trending">Nouvelles découvertes</I18nText>,
      value: stats?.newToday?.toString() || '0',
      change: '+5',
      icon: Star,
      color: 'text-blue-600'
    },
    {
      title: <I18nText translationKey="stats.recentContributions" ns="trending">Contributions récentes</I18nText>,
      value: stats?.contributionsCount?.toString() || '0',
      change: '+18%',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: <I18nText translationKey="stats.activeCollections" ns="trending">Collections actives</I18nText>,
      value: stats?.collectionsCount?.toString() || '0',
      change: '+2',
      icon: Flame,
      color: 'text-orange-600'
    }
  ];

  const categories = [
    { name: 'Géométrie Sacrée', count: 34, trend: 'up' },
    { name: 'Mythologie Nordique', count: 28, trend: 'up' },
    { name: 'Art Islamique', count: 45, trend: 'stable' },
    { name: 'Symboles Celtiques', count: 67, trend: 'up' },
    { name: 'Art Aborigène', count: 23, trend: 'down' },
    { name: 'Ère Numérique', count: 12, trend: 'up' }
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-slate-200 rounded mb-2"></div>
                    <div className="h-8 bg-slate-200 rounded mb-1"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            trendingStats.map((stat, index) => (
              <Card key={index} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <p className={`text-sm ${stat.color} font-medium`}>{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-slate-50`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
                {symbolsLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <span className="ml-3">
                      <I18nText translationKey="loadingStats" ns="trending">Chargement des statistiques...</I18nText>
                    </span>
                  </div>
                ) : symbolsError ? (
                  <div className="text-center py-12">
                    <p className="text-red-600">
                      <I18nText translationKey="errorLoadingData" ns="trending">Erreur lors du chargement des données</I18nText>
                    </p>
                  </div>
                ) : trendingSymbols && trendingSymbols.length > 0 ? (
                  <SymbolGrid symbols={trendingSymbols} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      <I18nText translationKey="noDataAvailable" ns="trending">Aucune donnée disponible pour le moment</I18nText>
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <I18nText translationKey="categories" ns="trending">Catégories Tendance</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{category.name}</p>
                        <p className="text-xs text-slate-500">{category.count} symboles</p>
                      </div>
                      <Badge 
                        variant={category.trend === 'up' ? 'default' : category.trend === 'down' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {category.trend === 'up' ? '↗' : category.trend === 'down' ? '↘' : '→'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  <I18nText translationKey="recentActivity" ns="trending">Activité Récente</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">
                      <I18nText translationKey="activity.newSymbol" ns="trending">Nouveau symbole ajouté</I18nText>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">
                      <I18nText translationKey="activity.collectionUpdated" ns="trending">Collection mise à jour</I18nText>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-600">
                      <I18nText translationKey="activity.newContribution" ns="trending">Nouvelle contribution</I18nText>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-600">
                      <I18nText translationKey="activity.commentAdded" ns="trending">Commentaire ajouté</I18nText>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
