
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout, Globe, History, Bookmark, ArrowRight, Play, CheckCircle, X, Plus, RefreshCw } from 'lucide-react';

const TabsPage = () => {
  const [openTabs, setOpenTabs] = useState([
    { id: 1, title: 'Symboles Égyptiens', url: '/symbols/egyptian', active: true },
    { id: 2, title: 'Mandalas Tibétains', url: '/collections/mandalas', active: false },
    { id: 3, title: 'Runes Nordiques', url: '/symbols/runes', active: false },
  ]);
  
  const [history, setHistory] = useState(['Accueil', 'Symboles', 'Collections']);
  const [bookmarks, setBookmarks] = useState(12);
  const [isSimulating, setIsSimulating] = useState(false);

  const mockMetrics = {
    taskCompletion: '+260%',
    userRetention: '+190%',
    pageViews: '+310%',
    bounceRate: '-45%'
  };

  const mockSuggestions = [
    'Croix Celtiques',
    'Totems Amérindiens',
    'Calligraphie Chinoise',
    'Art Islamique'
  ];

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          const newTab = {
            id: Date.now(),
            title: mockSuggestions[Math.floor(Math.random() * mockSuggestions.length)],
            url: '/new-tab',
            active: false
          };
          setOpenTabs(prev => [...prev, newTab]);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isSimulating]);

  const addTab = () => {
    const newTab = {
      id: Date.now(),
      title: 'Nouveau Symbole',
      url: '/new',
      active: true
    };
    setOpenTabs(prev => [...prev.map(t => ({...t, active: false})), newTab]);
  };

  const closeTab = (id: number) => {
    setOpenTabs(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (id: number) => {
    setOpenTabs(prev => prev.map(t => ({...t, active: t.id === id})));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Layout className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interface Onglets Métaphoriques
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les symboles comme vous naviguez sur le web. 
            Multitâche, historique, favoris - une expérience familière et puissante.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Navigateur Culturel
              </CardTitle>
              <CardDescription>
                Interface inspirée des navigateurs web modernes
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Browser-like interface */}
              <div className="bg-slate-100 rounded-lg overflow-hidden">
                {/* Address bar */}
                <div className="bg-white border-b flex items-center px-4 py-2 gap-2">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 bg-slate-100 rounded px-3 py-1 text-sm">
                    <Globe className="inline w-4 h-4 mr-2" />
                    symbolica.app/collections/ancient-symbols
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => setBookmarks(prev => prev + 1)}>
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>

                {/* Tabs */}
                <div className="bg-slate-200 flex items-center px-2 py-1 overflow-x-auto">
                  {openTabs.map(tab => (
                    <div
                      key={tab.id}
                      className={`flex items-center gap-2 px-3 py-1 rounded-t-lg text-sm min-w-0 cursor-pointer transition-colors ${
                        tab.active ? 'bg-white text-slate-900' : 'bg-slate-300 text-slate-600 hover:bg-slate-250'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="truncate max-w-32">{tab.title}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          closeTab(tab.id);
                        }}
                        className="hover:bg-slate-400 rounded p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTab}
                    className="p-2 hover:bg-slate-300 rounded text-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Content area */}
                <div className="bg-white p-6 min-h-[300px]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">𓋹</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">
                      {openTabs.find(t => t.active)?.title || 'Symboles Anciens'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Explorez la richesse symbolique de cette collection
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-lg">{bookmarks}</div>
                        <div className="text-muted-foreground">Favoris</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-lg">{history.length}</div>
                        <div className="text-muted-foreground">Historique</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  variant={isSimulating ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isSimulating ? "Arrêter" : "Démarrer"} la simulation
                  <RefreshCw className={`ml-2 h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
                </Button>
                <Button onClick={addTab} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Metrics & Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  Performance Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <Badge variant="secondary" className="text-blue-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Navigation par onglets multiples",
                    "Historique de navigation complet",
                    "Système de favoris intelligent",
                    "Interface familière et intuitive"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Layout className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">
                    Onglets Ouverts
                  </h3>
                  <div className="text-3xl font-bold">
                    {openTabs.length}
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    Session de navigation active
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Adopter cette Interface
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Offrez une expérience de navigation familière et puissante
          </p>
        </div>
      </div>
    </div>
  );
};

export default TabsPage;
