
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Zap, TrendingUp, ArrowRight, Play, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const TimelinePage = () => {
  const [currentEra, setCurrentEra] = useState(2);
  const [timelineSpeed, setTimelineSpeed] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [discoveries, setDiscoveries] = useState(156);

  const mockMetrics = {
    engagement: '+380%',
    understanding: '+290%',
    retention: '+340%',
    exploration: '+420%'
  };

  const timelineData = [
    { 
      era: 'Préhistoire', 
      period: '-50,000 av. J.-C.', 
      symbols: ['Peintures rupestres', 'Totems'], 
      color: 'from-stone-400 to-stone-600',
      discoveries: 23
    },
    { 
      era: 'Antiquité', 
      period: '-3000 av. J.-C.', 
      symbols: ['Hiéroglyphes', 'Runes'], 
      color: 'from-amber-400 to-amber-600',
      discoveries: 45
    },
    { 
      era: 'Moyen Âge', 
      period: '500 - 1500', 
      symbols: ['Blasons', 'Enluminures'], 
      color: 'from-blue-400 to-blue-600',
      discoveries: 34
    },
    { 
      era: 'Renaissance', 
      period: '1400 - 1600', 
      symbols: ['Art hermétique', 'Emblèmes'], 
      color: 'from-purple-400 to-purple-600',
      discoveries: 28
    },
    { 
      era: 'Moderne', 
      period: '1800 - 2000', 
      symbols: ['Logos', 'Art moderne'], 
      color: 'from-green-400 to-green-600',
      discoveries: 26
    }
  ];

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setCurrentEra(prev => (prev + 1) % timelineData.length);
        setDiscoveries(prev => prev + Math.floor(Math.random() * 5) + 1);
      }, 2000 / timelineSpeed);
      return () => clearInterval(interval);
    }
  }, [isAnimating, timelineSpeed, timelineData.length]);

  const navigateTimeline = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentEra(prev => (prev - 1 + timelineData.length) % timelineData.length);
    } else {
      setCurrentEra(prev => (prev + 1) % timelineData.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Clock className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Timeline Vivante Interactive
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Naviguez dans l'histoire des symboles culturels. 
            Une timeline intelligente qui s'adapte et révèle les connections temporelles.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Timeline */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Navigateur Temporel
              </CardTitle>
              <CardDescription>
                Explorez l'évolution des symboles à travers les âges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeline Controls */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTimeline('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="text-center">
                  <div className="text-lg font-bold">{timelineData[currentEra].era}</div>
                  <div className="text-sm text-muted-foreground">
                    {timelineData[currentEra].period}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTimeline('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Current Era Display */}
              <div className={`bg-gradient-to-r ${timelineData[currentEra].color} rounded-lg p-6 text-white relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">
                    {timelineData[currentEra].era}
                  </h3>
                  <p className="mb-4 opacity-90">
                    Période: {timelineData[currentEra].period}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Symboles principaux:</div>
                    <div className="flex gap-2 flex-wrap">
                      {timelineData[currentEra].symbols.map((symbol, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/20 text-white">
                          {symbol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    {timelineData[currentEra].discoveries} découvertes disponibles
                  </div>
                </div>
              </div>

              {/* Timeline Progress */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progression temporelle</span>
                  <span className="text-sm text-muted-foreground">
                    {currentEra + 1} / {timelineData.length}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${((currentEra + 1) / timelineData.length) * 100}%` }}
                  ></div>
                </div>
                
                {/* Timeline markers */}
                <div className="flex justify-between text-xs text-muted-foreground">
                  {timelineData.map((era, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer transition-colors ${
                        index === currentEra ? 'text-indigo-600 font-bold' : 'hover:text-indigo-400'
                      }`}
                      onClick={() => setCurrentEra(index)}
                    >
                      {era.era}
                    </div>
                  ))}
                </div>
              </div>

              {/* Animation Controls */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsAnimating(!isAnimating)}
                  variant={isAnimating ? "destructive" : "default"}
                  className="flex-1"
                >
                  {isAnimating ? "Arrêter" : "Démarrer"} l'animation
                  <Zap className="ml-2 h-4 w-4" />
                </Button>
                <select 
                  className="px-3 py-2 border rounded-md text-sm"
                  value={timelineSpeed}
                  onChange={(e) => setTimelineSpeed(Number(e.target.value))}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={2}>2x</option>
                  <option value={3}>3x</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Metrics & Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Impact Pédagogique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {key === 'understanding' ? 'Compréhension' :
                       key === 'retention' ? 'Rétention' :
                       key === 'exploration' ? 'Exploration' : 'Engagement'}
                    </span>
                    <Badge variant="secondary" className="text-indigo-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités Temporelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Navigation chronologique fluide",
                    "Connexions entre époques révélées",
                    "Contexte historique enrichi",
                    "Découvertes séquentielles guidées"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">
                    Découvertes Totales
                  </h3>
                  <div className="text-3xl font-bold">
                    {discoveries.toLocaleString()}
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    Symboles explorés dans l'histoire
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
            Implémenter la Timeline Vivante
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Créez une expérience temporelle immersive pour vos utilisateurs
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
