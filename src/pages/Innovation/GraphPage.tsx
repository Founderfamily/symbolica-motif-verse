
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Zap, Users, TrendingUp, ArrowRight, Play, CheckCircle, Lightbulb, BookOpen, Eye, MousePointer, Sparkles } from 'lucide-react';

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connections, setConnections] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  const mockNodes = [
    { id: 'ankh', name: 'Ankh Égyptien', type: 'symbol', connections: 12, description: 'Symbole de vie éternelle' },
    { id: 'tree', name: 'Arbre de Vie', type: 'concept', connections: 8, description: 'Concept universel de croissance' },
    { id: 'mandala', name: 'Mandala', type: 'symbol', connections: 15, description: 'Cercle sacré tibétain' },
    { id: 'eternal', name: 'Vie Éternelle', type: 'theme', connections: 20, description: 'Thème philosophique central' },
    { id: 'buddhism', name: 'Bouddhisme', type: 'culture', connections: 25, description: 'Tradition spirituelle asiatique' },
  ];

  const mockMetrics = {
    engagement: '+340%',
    discoveryRate: '+180%',
    sessionTime: '+220%',
    userSatisfaction: '9.2/10'
  };

  const tutorialSteps = [
    "Cliquez sur le nœud 'Ankh Égyptien' pour voir ses connexions",
    "Observez les lignes qui apparaissent - chaque ligne est une relation culturelle",
    "Cliquez sur 'Vie Éternelle' pour explorer un autre concept",
    "Voyez comment les symboles se connectent à travers les cultures !"
  ];

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setConnections(prev => prev + Math.floor(Math.random() * 3));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  const handleTutorialNext = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
      if (tutorialStep === 0) setSelectedNode('ankh');
      if (tutorialStep === 2) setSelectedNode('eternal');
    } else {
      setTutorialStep(0);
      setSelectedNode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* What is it? Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Navigateur de Graphe Sémantique
            </h1>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-xl text-muted-foreground">
              <strong>Qu'est-ce que c'est ?</strong> Une nouvelle façon d'explorer les symboles culturels 
              en suivant leurs <span className="text-purple-600 font-semibold">relations naturelles</span> 
              plutôt que des catégories artificielles.
            </p>

            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-6 border border-purple-200">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Navigation Classique
                  </h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Catégories rigides (Religion, Histoire, Art...)</li>
                    <li>• Recherche par mots-clés</li>
                    <li>• Découvertes limitées</li>
                    <li>• Pas de contexte culturel</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Navigation par Graphe
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Connexions sémantiques naturelles</li>
                    <li>• Exploration par associations</li>
                    <li>• Découvertes surprenantes</li>
                    <li>• Contexte culturel riche</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Concrete Example */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <BookOpen className="h-6 w-6" />
                  Exemple Concret : Parcours de Découverte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-amber-700">
                    <strong>Scénario :</strong> Vous explorez l'Ankh égyptien...
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-amber-200">
                    <div className="flex items-center gap-4 text-sm">
                      <span className="bg-purple-500 text-white px-3 py-1 rounded-full">Ankh Égyptien</span>
                      <ArrowRight className="h-4 w-4 text-amber-600" />
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full">Vie Éternelle</span>
                      <ArrowRight className="h-4 w-4 text-amber-600" />
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full">Arbre de Vie</span>
                      <ArrowRight className="h-4 w-4 text-amber-600" />
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full">Bouddhisme</span>
                    </div>
                  </div>
                  <p className="text-amber-700 text-sm">
                    <strong>Résultat :</strong> En 4 clics, vous découvrez comment un symbole égyptien 
                    se connecte aux traditions bouddhistes via le concept universel de vie éternelle !
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tutorial Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <MousePointer className="h-6 w-6" />
                  Tutoriel Interactif
                </CardTitle>
                <CardDescription className="text-green-700">
                  Suivez ces étapes pour comprendre comment ça marche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                        {tutorialStep + 1}
                      </span>
                      <span className="font-medium text-green-800">Étape {tutorialStep + 1}/4</span>
                    </div>
                    <p className="text-green-700 mb-3">{tutorialSteps[tutorialStep]}</p>
                    <Button 
                      onClick={handleTutorialNext}
                      className="bg-green-600 hover:bg-green-700"
                      size="sm"
                    >
                      {tutorialStep < tutorialSteps.length - 1 ? 'Étape Suivante' : 'Recommencer'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Interactive Demo */}
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Démonstration Interactive
              </CardTitle>
              <CardDescription>
                {tutorialStep > 0 ? tutorialSteps[tutorialStep - 1] : "Cliquez sur les nœuds pour explorer les connexions"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-6 min-h-[400px] relative overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-20">
                  <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className="border border-blue-500/20"></div>
                    ))}
                  </div>
                </div>

                {/* Interactive nodes */}
                <div className="relative z-10">
                  {mockNodes.map((node, index) => (
                    <div
                      key={node.id}
                      className={`absolute cursor-pointer transition-all duration-300 ${
                        selectedNode === node.id ? 'scale-110 z-20' : 'hover:scale-105'
                      } ${tutorialStep > 0 && ((tutorialStep === 1 && node.id === 'ankh') || (tutorialStep === 3 && node.id === 'eternal')) ? 'animate-pulse ring-4 ring-yellow-400' : ''}`}
                      style={{
                        left: `${20 + (index * 15)}%`,
                        top: `${30 + (index % 2 === 0 ? 0 : 40)}%`,
                        transform: selectedNode === node.id ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)'
                      }}
                      onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all ${
                        node.type === 'symbol' ? 'bg-purple-500' :
                        node.type === 'concept' ? 'bg-blue-500' : 
                        node.type === 'theme' ? 'bg-green-500' : 'bg-orange-500'
                      } ${selectedNode === node.id ? 'ring-4 ring-yellow-400' : ''}`}>
                        {node.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="text-xs text-center mt-1 text-white font-medium">
                        {node.connections} liens
                      </div>
                    </div>
                  ))}

                  {/* Connection lines */}
                  {selectedNode && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {mockNodes.map((node, index) => {
                        if (node.id === selectedNode) return null;
                        const selectedIndex = mockNodes.findIndex(n => n.id === selectedNode);
                        return (
                          <line
                            key={node.id}
                            x1={`${20 + (selectedIndex * 15)}%`}
                            y1={`${30 + (selectedIndex % 2 === 0 ? 0 : 40)}%`}
                            x2={`${20 + (index * 15)}%`}
                            y2={`${30 + (index % 2 === 0 ? 0 : 40)}%`}
                            stroke="#fbbf24"
                            strokeWidth="2"
                            className="animate-pulse"
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>

                {/* Selected node info */}
                {selectedNode && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-bold text-slate-900">
                      {mockNodes.find(n => n.id === selectedNode)?.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {mockNodes.find(n => n.id === selectedNode)?.description}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Découvrez {mockNodes.find(n => n.id === selectedNode)?.connections} connexions fascinantes
                    </p>
                  </div>
                )}
              </div>

              <Button 
                onClick={() => setIsActive(!isActive)}
                className="w-full mt-4"
                variant={isActive ? "destructive" : "default"}
              >
                {isActive ? "Arrêter la simulation" : "Démarrer la simulation"}
                <Zap className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Why it's Revolutionary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Pourquoi c'est Révolutionnaire ?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      title: "Découvertes Naturelles",
                      desc: "Suivez votre curiosité naturelle au lieu de catégories imposées"
                    },
                    {
                      title: "Apprentissage Contextuel", 
                      desc: "Chaque symbole est présenté dans son réseau de relations culturelles"
                    },
                    {
                      title: "Connexions Surprenantes",
                      desc: "Découvrez des liens inattendus entre cultures et époques"
                    },
                    {
                      title: "Mémorisation Améliorée",
                      desc: "L'information liée en réseau se retient mieux que des faits isolés"
                    }
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-sm text-slate-800">{benefit.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Impact Mesuré
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {key === 'discoveryRate' ? 'Taux de découverte' :
                       key === 'sessionTime' ? 'Temps de session' :
                       key === 'userSatisfaction' ? 'Satisfaction utilisateur' : 'Engagement'}
                    </span>
                    <Badge variant="secondary" className="text-green-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">
                    Connexions Découvertes
                  </h3>
                  <div className="text-3xl font-bold">
                    {connections + 1247}
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    Nouvelles relations explorées ce mois
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Adopter cette Approche
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Transformez votre homepage avec la navigation par graphe sémantique
          </p>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
