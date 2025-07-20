
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Zap, Users, TrendingUp, ArrowRight, Play, CheckCircle } from 'lucide-react';

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [connections, setConnections] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);

  const mockNodes = [
    { id: 'ankh', name: 'Ankh Égyptien', type: 'symbol', connections: 12 },
    { id: 'tree', name: 'Arbre de Vie', type: 'concept', connections: 8 },
    { id: 'mandala', name: 'Mandala', type: 'symbol', connections: 15 },
    { id: 'eternal', name: 'Vie Éternelle', type: 'theme', connections: 20 },
    { id: 'buddhism', name: 'Bouddhisme', type: 'culture', connections: 25 },
  ];

  const mockMetrics = {
    engagement: '+340%',
    discoveryRate: '+180%',
    sessionTime: '+220%',
    userSatisfaction: '9.2/10'
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setConnections(prev => prev + Math.floor(Math.random() * 3));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Navigateur de Graphe Sémantique
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les symboles culturels à travers leurs relations naturelles. 
            Découvrez des connexions surprenantes entre les cultures et les époques.
          </p>
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
                Cliquez sur les nœuds pour explorer les connexions
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
                      }`}
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
                      } ${selectedNode === node.id ? 'ring-4 ring-yellow-400 animate-pulse' : ''}`}>
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
                        return (
                          <line
                            key={node.id}
                            x1="50%"
                            y1="50%"
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

          {/* Metrics & Benefits */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Métriques d'Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(mockMetrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <Badge variant="secondary" className="text-green-600">
                      {value}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avantages Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    "Navigation intuitive par relations sémantiques",
                    "Découverte de connexions culturelles cachées",
                    "Apprentissage contextuel personnalisé",
                    "Exploration non-linéaire encouragée"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
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
