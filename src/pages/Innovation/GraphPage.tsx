
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Zap, Users, TrendingUp, ArrowRight, Play, CheckCircle, Lightbulb, BookOpen, Eye, MousePointer, Sparkles, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SymbolNode {
  id: string;
  name: string;
  culture: string;
  period: string;
  description: string;
  connections: number;
  tags: string[];
  classification: string;
  type: 'symbol' | 'culture' | 'period' | 'tag';
}

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<SymbolNode[]>([]);
  const [connections, setConnections] = useState<SymbolNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'culture' | 'period' | 'tag'>('all');

  useEffect(() => {
    loadSymbols();
  }, []);

  const loadSymbols = async () => {
    try {
      const { data: symbolsData, error } = await supabase
        .from('symbols')
        .select('id, name, culture, period, description')
        .limit(10);

      if (error) throw error;

      if (symbolsData) {
        const nodes: SymbolNode[] = symbolsData.map(symbol => ({
          id: symbol.id,
          name: symbol.name,
          culture: symbol.culture || 'Inconnu',
          period: symbol.period || 'Indéterminé',
          description: symbol.description || '',
          connections: Math.floor(Math.random() * 20) + 5, // Temporary
          tags: [symbol.culture, symbol.period].filter(Boolean),
          classification: symbol.culture || 'Général',
          type: 'symbol' as const
        }));

        // Add culture and period nodes
        const cultures = [...new Set(symbolsData.map(s => s.culture).filter(Boolean))];
        const periods = [...new Set(symbolsData.map(s => s.period).filter(Boolean))];

        const cultureNodes: SymbolNode[] = cultures.map(culture => ({
          id: `culture-${culture}`,
          name: culture,
          culture,
          period: '',
          description: `Culture ${culture}`,
          connections: symbolsData.filter(s => s.culture === culture).length,
          tags: [culture],
          classification: 'Culture',
          type: 'culture' as const
        }));

        const periodNodes: SymbolNode[] = periods.map(period => ({
          id: `period-${period}`,
          name: period,
          culture: '',
          period,
          description: `Période ${period}`,
          connections: symbolsData.filter(s => s.period === period).length,
          tags: [period],
          classification: 'Période',
          type: 'period' as const
        }));

        setSymbols([...nodes, ...cultureNodes, ...periodNodes]);
      }
    } catch (error) {
      console.error('Error loading symbols:', error);
      toast.error('Erreur lors du chargement des symboles');
    } finally {
      setLoading(false);
    }
  };

  const getConnectedNodes = (nodeId: string) => {
    const selectedSymbol = symbols.find(s => s.id === nodeId);
    if (!selectedSymbol) return [];

    return symbols.filter(symbol => {
      if (symbol.id === nodeId) return false;
      
      // Connect by culture
      if (selectedSymbol.culture && symbol.culture === selectedSymbol.culture) return true;
      
      // Connect by period  
      if (selectedSymbol.period && symbol.period === selectedSymbol.period) return true;
      
      // Connect if same type (culture nodes connect to their symbols)
      if (selectedSymbol.type === 'culture' && symbol.culture === selectedSymbol.name) return true;
      if (selectedSymbol.type === 'period' && symbol.period === selectedSymbol.name) return true;
      if (symbol.type === 'culture' && selectedSymbol.culture === symbol.name) return true;
      if (symbol.type === 'period' && selectedSymbol.period === symbol.name) return true;
      
      return false;
    });
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    setConnections(getConnectedNodes(nodeId));
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'symbol': return 'bg-purple-500';
      case 'culture': return 'bg-blue-500';
      case 'period': return 'bg-green-500';
      case 'tag': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredSymbols = symbols.filter(symbol => {
    if (filter === 'all') return true;
    return symbol.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement des symboles...</p>
        </div>
      </div>
    );
  }

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

        {/* Filtres */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Explorez par Type
                </CardTitle>
                <CardDescription>
                  Filtrez les nœuds pour voir différents types de connexions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'all', label: 'Tout', count: symbols.length },
                    { key: 'symbol', label: 'Symboles', count: symbols.filter(s => s.type === 'symbol').length },
                    { key: 'culture', label: 'Cultures', count: symbols.filter(s => s.type === 'culture').length },
                    { key: 'period', label: 'Périodes', count: symbols.filter(s => s.type === 'period').length }
                  ].map(({ key, label, count }) => (
                    <Button
                      key={key}
                      variant={filter === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter(key as typeof filter)}
                      className="flex items-center gap-2"
                    >
                      {label}
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </Button>
                  ))}
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
                Cliquez sur les nœuds pour explorer les connexions entre symboles, cultures et périodes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900 rounded-lg p-6 min-h-[500px] relative overflow-hidden">
                {/* Interactive nodes */}
                <div className="relative z-10 h-full">
                  {filteredSymbols.map((node, index) => (
                    <div
                      key={node.id}
                      className={`absolute cursor-pointer transition-all duration-300 ${
                        selectedNode === node.id ? 'scale-110 z-20' : 'hover:scale-105'
                      }`}
                      style={{
                        left: `${15 + (index % 5) * 18}%`,
                        top: `${20 + Math.floor(index / 5) * 25}%`,
                        transform: selectedNode === node.id ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%)'
                      }}
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xs transition-all ${
                        getNodeColor(node.type)
                      } ${selectedNode === node.id ? 'ring-4 ring-yellow-400' : ''}`}>
                        {node.name.length > 6 ? 
                          node.name.split(' ').map(w => w[0]).join('').slice(0, 3) :
                          node.name.slice(0, 3)
                        }
                      </div>
                      <div className="text-xs text-center mt-1 text-white font-medium max-w-20 truncate">
                        {node.name}
                      </div>
                      <div className="text-xs text-center text-gray-400">
                        {node.connections} liens
                      </div>
                    </div>
                  ))}

                  {/* Connection lines */}
                  {selectedNode && connections.length > 0 && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {connections.map((connectedNode) => {
                        const selectedIndex = filteredSymbols.findIndex(n => n.id === selectedNode);
                        const connectedIndex = filteredSymbols.findIndex(n => n.id === connectedNode.id);
                        if (selectedIndex === -1 || connectedIndex === -1) return null;
                        
                        return (
                          <line
                            key={connectedNode.id}
                            x1={`${15 + (selectedIndex % 5) * 18}%`}
                            y1={`${20 + Math.floor(selectedIndex / 5) * 25}%`}
                            x2={`${15 + (connectedIndex % 5) * 18}%`}
                            y2={`${20 + Math.floor(connectedIndex / 5) * 25}%`}
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
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                    {(() => {
                      const node = symbols.find(n => n.id === selectedNode);
                      if (!node) return null;
                      
                      return (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-slate-900">{node.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {node.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-2">{node.description}</p>
                          {node.culture && (
                            <p className="text-xs text-slate-500">
                              <strong>Culture:</strong> {node.culture}
                            </p>
                          )}
                          {node.period && (
                            <p className="text-xs text-slate-500">
                              <strong>Période:</strong> {node.period}
                            </p>
                          )}
                          <p className="text-xs text-slate-500 mt-2">
                            <strong>Connexions trouvées:</strong> {connections.length}
                          </p>
                          {connections.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-slate-700 mb-1">Connecté à:</p>
                              <div className="flex flex-wrap gap-1">
                                {connections.slice(0, 5).map(conn => (
                                  <Badge key={conn.id} variant="secondary" className="text-xs">
                                    {conn.name}
                                  </Badge>
                                ))}
                                {connections.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{connections.length - 5} autres
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
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
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Symboles chargés</span>
                  <Badge variant="secondary" className="text-green-600">
                    {symbols.filter(s => s.type === 'symbol').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Cultures représentées</span>
                  <Badge variant="secondary" className="text-green-600">
                    {symbols.filter(s => s.type === 'culture').length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Périodes historiques</span>
                  <Badge variant="secondary" className="text-green-600">
                    {symbols.filter(s => s.type === 'period').length}
                  </Badge>
                </div>
                {selectedNode && (
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Connexions actives</span>
                    <Badge variant="secondary" className="text-blue-600">
                      {connections.length}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
                  <h3 className="text-lg font-bold mb-2">
                    Symboles Connectés
                  </h3>
                  <div className="text-3xl font-bold">
                    {symbols.length}
                  </div>
                  <p className="text-sm opacity-80 mt-2">
                    Symboles dans la base de données
                  </p>
                  {selectedNode && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <p className="text-sm opacity-90">
                        <strong>{connections.length}</strong> connexions trouvées
                      </p>
                    </div>
                  )}
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
