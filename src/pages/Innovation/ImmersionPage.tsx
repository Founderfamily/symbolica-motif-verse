
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, Eye, Layers, MousePointer, ArrowRight, Play, CheckCircle, Sparkles, ChevronRight } from 'lucide-react';

const ImmersionPage = () => {
  const [currentDepth, setCurrentDepth] = useState(0);
  const [discoveries, setDiscoveries] = useState(0);
  const [isExploring, setIsExploring] = useState(false);
  const [currentPath, setCurrentPath] = useState(['Accueil']);

  const mockMetrics = {
    sessionTime: '+450%',
    discovery: '+320%',
    engagement: '+280%',
    retention: '+210%'
  };

  const rabbitHole = [
    { level: 0, title: 'Symboles Anciens', content: 'Point de départ de votre exploration', color: 'from-blue-400 to-blue-600' },
    { level: 1, title: 'Ankh Égyptien', content: 'Symbole de vie éternelle', color: 'from-purple-400 to-purple-600' },
    { level: 2, title: 'Mythologie Égyptienne', content: 'Osiris et le cycle de renaissance', color: 'from-green-400 to-green-600' },
    { level: 3, title: 'Cultes à Mystères', content: 'Rituels initiatiques antiques', color: 'from-orange-400 to-orange-600' },
    { level: 4, title: 'Hermétisme', content: 'Traditions ésotériques occidentales', color: 'from-red-400 to-red-600' },
    { level: 5, title: 'Alchimie Médiévale', content: 'Transmutation spirituelle', color: 'from-indigo-400 to-indigo-600' },
  ];

  useEffect(() => {
    if (isExploring) {
      const interval = setInterval(() => {
        setDiscoveries(prev => prev + Math.floor(Math.random() * 3) + 1);
        
        if (Math.random() > 0.6 && currentDepth < rabbitHole.length - 1) {
          setCurrentDepth(prev => prev + 1);
          setCurrentPath(prev => [...prev, rabbitHole[currentDepth + 1]?.title || 'Découverte']);
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isExploring, currentDepth]);

  const dive = () => {
    if (currentDepth < rabbitHole.length - 1) {
      setCurrentDepth(prev => prev + 1);
      setCurrentPath(prev => [...prev, rabbitHole[currentDepth + 1]?.title]);
    }
  };

  const surface = () => {
    setCurrentDepth(0);
    setCurrentPath(['Accueil']);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Compass className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Exploration Immersive - Terrier de Lapin
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Plongez dans les profondeurs de la connaissance culturelle. 
            Chaque découverte ouvre de nouvelles voies d'exploration infinies.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden bg-slate-800 border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Play className="h-5 w-5" />
                Terrier de Lapin Interactif
              </CardTitle>
              <CardDescription className="text-purple-200">
                Explorez les connexions profondes entre les concepts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Breadcrumb/Path */}
              <div className="flex items-center gap-1 flex-wrap p-3 bg-slate-700 rounded-lg">
                {currentPath.map((step, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <span className="text-sm text-purple-300 px-2 py-1 bg-slate-600 rounded">
                      {step}
                    </span>
                    {index < currentPath.length - 1 && (
                      <ChevronRight className="h-3 w-3 text-purple-400" />
                    )}
                  </div>
                ))}
              </div>

              {/* Current Level */}
              <div className={`bg-gradient-to-r ${rabbitHole[currentDepth]?.color || 'from-blue-400 to-blue-600'} rounded-lg p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">
                      {rabbitHole[currentDepth]?.title}
                    </h3>
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      Niveau {currentDepth}
                    </Badge>
                  </div>
                  <p className="mb-4 opacity-90">
                    {rabbitHole[currentDepth]?.content}
                  </p>
                  
                  {/* Depth indicator */}
                  <div className="flex items-center gap-2 mb-4">
                    <Layers className="h-4 w-4" />
                    <div className="flex gap-1">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i <= currentDepth ? 'bg-white' : 'bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={dive} 
                      disabled={currentDepth >= rabbitHole.length - 1}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      Plonger plus profond
                      <Eye className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={surface}
                      size="sm"
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30"
                    >
                      Remonter
                    </Button>
                  </div>
                </div>
              </div>

              {/* Exploration Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-4 text-center text-white">
                  <div className="text-2xl font-bold text-purple-400">{discoveries}</div>
                  <div className="text-sm text-purple-200">Découvertes</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center text-white">
                  <div className="text-2xl font-bold text-pink-400">{currentDepth}</div>
                  <div className="text-sm text-pink-200">Profondeur</div>
                </div>
              </div>

              <Button 
                onClick={() => setIsExploring(!isExploring)}
                className="w-full"
                variant={isExploring ? "destructive" : "default"}
              >
                {isExploring ? "Arrêter" : "Démarrer"} l'exploration automatique
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Metrics & Benefits */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MousePointer className="h-5 w-5 text-purple-400" />
                  Impact sur l'Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize text-purple-200">
                      {key === 'sessionTime' ? 'Temps de session' :
                       key === 'discovery' ? 'Taux de découverte' :
                       key === 'engagement' ? 'Engagement' : 'Rétention'}
                    </span>
                    <Badge variant="secondary" className="text-purple-400 bg-purple-500/20">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Expérience Immersive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Navigation contextuelle progressive",
                    "Découvertes sérendipiteuses encouragées",
                    "Connexions conceptuelles révélées",
                    "Parcours personnalisés adaptatifs"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-purple-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Compass className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">
                    Profondeur Atteinte
                  </h3>
                  <div className="text-3xl font-bold">
                    Niveau {currentDepth}
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    Dans votre exploration actuelle
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Créer l'Expérience Immersive
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-purple-300 mt-4">
            Transformez la navigation en aventure de découverte infinie
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImmersionPage;
