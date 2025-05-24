
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

  // Fetch trending symbols (mock data for now)
  const { data: trendingSymbols, isLoading } = useQuery({
    queryKey: ['trending-symbols', timeFrame],
    queryFn: async () => {
      // For now, just get some random symbols as trending
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .limit(12);
        
      if (error) throw error;
      return (data as unknown) as SymbolData[];
    }
  });

  // Mock trending data
  const trendingStats = [
    {
      title: 'Symboles populaires',
      value: '156',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-green-600'
    },
    {
      title: 'Nouvelles découvertes',
      value: '23',
      change: '+5',
      icon: Star,
      color: 'text-blue-600'
    },
    {
      title: 'Contributions récentes',
      value: '47',
      change: '+18%',
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      title: 'Collections actives',
      value: '8',
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
            <I18nText translationKey="trending.title">Tendances</I18nText>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            <I18nText translationKey="trending.description">
              Découvrez les symboles, collections et découvertes les plus populaires de la communauté
            </I18nText>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trendingStats.map((stat, index) => (
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
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as any)}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  <I18nText translationKey="trending.popularSymbols">Symboles Populaires</I18nText>
                </h2>
                <TabsList>
                  <TabsTrigger value="day">24h</TabsTrigger>
                  <TabsTrigger value="week">7j</TabsTrigger>
                  <TabsTrigger value="month">30j</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={timeFrame}>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <SymbolGrid symbols={trendingSymbols || []} />
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
                  <I18nText translationKey="trending.categories">Catégories Tendance</I18nText>
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
                  <I18nText translationKey="trending.recentActivity">Activité Récente</I18nText>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-slate-600">Nouveau symbole ajouté</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-slate-600">Collection mise à jour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-slate-600">Nouvelle contribution</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-slate-600">Commentaire ajouté</span>
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
