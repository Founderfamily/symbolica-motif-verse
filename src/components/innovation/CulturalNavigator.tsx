import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, History, Bookmark, Search, Filter, MapPin, Clock, 
  ArrowLeft, ArrowRight, RefreshCw, Star, Share, Download,
  Palette, Mountain, Users, Calendar, Tag, Eye,
  ChevronDown, MoreHorizontal, Play, Pause, Volume2,
  Maximize2, X, Plus, Settings, Grid3X3, List,
  Heart, MessageCircle, Sparkles, Zap, Compass
} from 'lucide-react';

interface CulturalTab {
  id: string;
  title: string;
  url: string;
  culture: string;
  period: string;
  thumbnail: string;
  active: boolean;
  isLoading?: boolean;
  bookmarked?: boolean;
  lastVisited?: Date;
  tags: string[];
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: Date;
  culture: string;
  thumbnail: string;
}

interface CulturalBookmark {
  id: string;
  title: string;
  url: string;
  culture: string;
  tags: string[];
  addedAt: Date;
  category: string;
}

const CulturalNavigator = () => {
  const [tabs, setTabs] = useState<CulturalTab[]>([
    {
      id: '1',
      title: 'Symboles Égyptiens Anciens',
      url: '/symbols/egyptian/hieroglyphs',
      culture: 'Égyptienne',
      period: 'Antique',
      thumbnail: '𓋹',
      active: true,
      bookmarked: true,
      lastVisited: new Date(),
      tags: ['hiéroglyphes', 'pharaons', 'divinités']
    },
    {
      id: '2',
      title: 'Mandalas Tibétains Sacrés',
      url: '/collections/mandalas/tibetan',
      culture: 'Tibétaine',
      period: 'Médiéval',
      thumbnail: '☸',
      active: false,
      lastVisited: new Date(Date.now() - 86400000),
      tags: ['bouddhisme', 'méditation', 'géométrie']
    },
    {
      id: '3',
      title: 'Runes Nordiques Divinatoires',
      url: '/symbols/nordic/runes',
      culture: 'Nordique',
      period: 'Médiéval',
      thumbnail: 'ᚱ',
      active: false,
      bookmarked: true,
      lastVisited: new Date(Date.now() - 172800000),
      tags: ['divination', 'vikings', 'magie']
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'grid' | 'list'>('grid');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<HistoryItem[]>([]);
  const [bookmarks, setBookmarks] = useState<CulturalBookmark[]>([]);

  const autoPlayRef = useRef<NodeJS.Timeout>();

  // Données d'exemple pour la démonstration
  const culturalSuggestions = [
    { title: 'Art Japonais Zen', culture: 'Japonaise', icon: '🌸' },
    { title: 'Totems Amérindiens', culture: 'Amérindienne', icon: '🦅' },
    { title: 'Calligraphie Arabe', culture: 'Arabe', icon: '✍' },
    { title: 'Symboles Celtiques', culture: 'Celtique', icon: '🍀' },
    { title: 'Art Aboriginal', culture: 'Aborigène', icon: '🎨' },
    { title: 'Iconographie Orthodoxe', culture: 'Byzantine', icon: '☦' }
  ];

  const filterOptions = [
    { category: 'Culture', options: ['Égyptienne', 'Tibétaine', 'Nordique', 'Japonaise', 'Amérindienne'] },
    { category: 'Période', options: ['Antique', 'Médiéval', 'Renaissance', 'Moderne', 'Contemporain'] },
    { category: 'Type', options: ['Symboles', 'Art', 'Architecture', 'Textile', 'Céramique'] },
    { category: 'Thème', options: ['Religion', 'Nature', 'Pouvoir', 'Amour', 'Guerre', 'Paix'] }
  ];

  useEffect(() => {
    if (isPlaying) {
      autoPlayRef.current = setInterval(() => {
        setTabs(prev => {
          const activeIndex = prev.findIndex(tab => tab.active);
          const nextIndex = (activeIndex + 1) % prev.length;
          return prev.map((tab, index) => ({
            ...tab,
            active: index === nextIndex
          }));
        });
      }, 4000);
    } else {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isPlaying]);

  const addNewTab = (suggestion?: any) => {
    const newTab: CulturalTab = {
      id: Date.now().toString(),
      title: suggestion?.title || 'Nouvelle Exploration',
      url: '/new-exploration',
      culture: suggestion?.culture || 'Inconnue',
      period: 'Contemporain',
      thumbnail: suggestion?.icon || '🔍',
      active: true,
      isLoading: true,
      lastVisited: new Date(),
      tags: []
    };

    setTabs(prev => [
      ...prev.map(tab => ({ ...tab, active: false })),
      newTab
    ]);

    // Simuler le chargement
    setTimeout(() => {
      setTabs(prev => prev.map(tab => 
        tab.id === newTab.id ? { ...tab, isLoading: false } : tab
      ));
    }, 2000);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTabs(prev => {
      const filteredTabs = prev.filter(tab => tab.id !== tabId);
      if (filteredTabs.length === 0) return prev;
      
      const wasActive = prev.find(tab => tab.id === tabId)?.active;
      if (wasActive && filteredTabs.length > 0) {
        filteredTabs[0].active = true;
      }
      return filteredTabs;
    });
  };

  const setActiveTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      active: tab.id === tabId
    })));
  };

  const toggleBookmark = (tabId: string) => {
    setTabs(prev => prev.map(tab => 
      tab.id === tabId ? { ...tab, bookmarked: !tab.bookmarked } : tab
    ));
  };

  const activeTab = tabs.find(tab => tab.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-8 w-8 text-amber-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
              Navigateur Culturel Avancé
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez le patrimoine mondial avec un navigateur intelligent qui comprend les connexions culturelles
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Navigateur Principal */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Navigateur Culturel
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant={isPlaying ? "destructive" : "outline"}
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Barre de navigation */}
                <div className="bg-slate-100 p-3 border-b">
                  <div className="flex items-center gap-2 mb-3">
                    <Button size="sm" variant="ghost">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Rechercher dans le patrimoine culturel..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => setShowBookmarks(!showBookmarks)}>
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setShowHistory(!showHistory)}>
                      <History className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Filtres rapides */}
                  <div className="flex items-center gap-2 overflow-x-auto">
                    <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    {filterOptions[0].options.slice(0, 5).map(option => (
                      <Badge
                        key={option}
                        variant={selectedFilters.includes(option) ? "default" : "outline"}
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => {
                          setSelectedFilters(prev =>
                            prev.includes(option)
                              ? prev.filter(f => f !== option)
                              : [...prev, option]
                          );
                        }}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Onglets */}
                <div className="bg-slate-200 px-2 py-1 border-b overflow-x-auto">
                  <div className="flex items-center gap-1">
                    {tabs.map(tab => (
                      <div
                        key={tab.id}
                        className={`group flex items-center gap-2 px-3 py-2 rounded-t-lg cursor-pointer transition-all min-w-0 max-w-60 ${
                          tab.active 
                            ? 'bg-white text-slate-900 shadow-sm' 
                            : 'bg-slate-300 text-slate-600 hover:bg-slate-250'
                        }`}
                        onClick={() => setActiveTab(tab.id)}
                      >
                        <span className="text-lg flex-shrink-0">{tab.thumbnail}</span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{tab.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {tab.culture} • {tab.period}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(tab.id);
                            }}
                          >
                            <Star className={`h-3 w-3 ${tab.bookmarked ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={(e) => closeTab(tab.id, e)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {tab.isLoading && (
                          <div className="animate-spin h-3 w-3 border-2 border-slate-400 border-t-transparent rounded-full" />
                        )}
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => addNewTab()}
                      className="flex-shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Contenu de l'onglet actif */}
                <div className="p-6 bg-white min-h-[400px]">
                  {activeTab && (
                    <div className="space-y-6">
                      {/* En-tête du contenu */}
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-4xl">{activeTab.thumbnail}</span>
                            <div>
                              <h2 className="text-2xl font-bold">{activeTab.title}</h2>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>Culture {activeTab.culture}</span>
                                <Separator orientation="vertical" className="h-4" />
                                <Clock className="h-4 w-4" />
                                <span>Période {activeTab.period}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {activeTab.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline">
                            <Share className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Contenu d'exemple */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Analyse Symbolique
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Les symboles de cette culture représentent une vision complexe du monde, 
                            intégrant spiritualité, nature et société dans un système cohérent de significations.
                          </p>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-amber-600">47</div>
                              <div className="text-xs text-muted-foreground">Symboles</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-amber-600">12</div>
                              <div className="text-xs text-muted-foreground">Variantes</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-amber-600">8</div>
                              <div className="text-xs text-muted-foreground">Régions</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h3 className="font-semibold flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Contexte Culturel
                          </h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Utilisé entre 3000 av. J.-C. et 400 ap. J.-C.</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mountain className="h-4 w-4 text-muted-foreground" />
                              <span>Région du Nil et delta</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span>Fonction religieuse et administrative</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions d'engagement */}
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            <Heart className="h-4 w-4 mr-1" />
                            287 appréciations
                          </Button>
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            43 commentaires
                          </Button>
                          <Button variant="ghost" size="sm" className="p-0 h-auto">
                            <Eye className="h-4 w-4 mr-1" />
                            1.2k vues
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm">
                            Contribuer
                            <Sparkles className="h-4 w-4 ml-1" />
                          </Button>
                          <Button size="sm" variant="outline">
                            Explorer Similaires
                            <Zap className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Suggestions d'exploration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Suggestions d'Exploration</CardTitle>
                <CardDescription>
                  Découvertes recommandées basées sur vos intérêts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {culturalSuggestions.slice(0, 4).map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      onClick={() => addNewTab(suggestion)}
                    >
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{suggestion.title}</div>
                        <div className="text-xs text-muted-foreground">{suggestion.culture}</div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contrôles de vue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contrôles de Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mode d'affichage</span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={currentView === 'grid' ? 'default' : 'outline'}
                      onClick={() => setCurrentView('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={currentView === 'list' ? 'default' : 'outline'}
                      onClick={() => setCurrentView('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Lecture automatique</span>
                  <Button
                    size="sm"
                    variant={isPlaying ? 'default' : 'outline'}
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Onglets ouverts</span>
                  <Badge variant="secondary">{tabs.length}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Favoris</span>
                  <Badge variant="secondary">{tabs.filter(t => t.bookmarked).length}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Session statistiques */}
            <Card className="bg-gradient-to-r from-amber-500 to-red-500 text-white">
              <CardContent className="pt-6 text-center">
                <Compass className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-bold mb-2">Session Active</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-2xl font-bold">{tabs.length}</div>
                    <div className="opacity-80">Explorations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {tabs.reduce((acc, tab) => acc + (tab.tags?.length || 0), 0)}
                    </div>
                    <div className="opacity-80">Tags</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700">
            Intégrer ce Navigateur
            <Compass className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Offrez une expérience de découverte culturelle intelligente et immersive
          </p>
        </div>
      </div>
    </div>
  );
};

export default CulturalNavigator;