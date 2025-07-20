
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Filter, Info, Zap, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';
import { useGraphData } from '@/hooks/useGraphData';
import ForceDirectedGraph from '@/components/graph/ForceDirectedGraph';
import { toast } from 'sonner';

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'symbol' | 'culture' | 'period' | 'tag'>('all');
  
  const { data: symbols, isLoading, error } = useAllSymbols();
  const { nodes, links } = useGraphData(symbols || []);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    
    // Trouver le nœud sélectionné et afficher ses informations
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      toast.success(`${node.name} sélectionné - ${node.connections} connexions`);
    }
  };

  const getConnectedNodes = (nodeId: string) => {
    const connectedNodeIds = new Set<string>();
    
    links.forEach(link => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any)?.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any)?.id || link.target;
      
      if (sourceId === nodeId) {
        connectedNodeIds.add(targetId);
      } else if (targetId === nodeId) {
        connectedNodeIds.add(sourceId);
      }
    });
    
    return nodes.filter(node => connectedNodeIds.has(node.id));
  };

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;
  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-lg text-muted-foreground">Chargement du graphe sémantique...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Erreur lors du chargement des données</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Network className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Navigateur de Graphe Sémantique
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explorez les connexions entre symboles, cultures, périodes et tags de manière interactive
          </p>
        </div>

        {/* Filtres */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de Visualisation
              </CardTitle>
              <CardDescription>
                Filtrez les nœuds pour explorer différents aspects du graphe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Tout', count: nodes.length },
                  { key: 'symbol', label: 'Symboles', count: nodes.filter(n => n.type === 'symbol').length },
                  { key: 'culture', label: 'Cultures', count: nodes.filter(n => n.type === 'culture').length },
                  { key: 'period', label: 'Périodes', count: nodes.filter(n => n.type === 'period').length },
                  { key: 'tag', label: 'Tags', count: nodes.filter(n => n.type === 'tag').length }
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

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Graphe principal */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Graphe Interactif
                </CardTitle>
                <CardDescription>
                  {nodes.length} nœuds • {links.length} connexions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ForceDirectedGraph
                  nodes={nodes}
                  links={links}
                  selectedNode={selectedNode}
                  onNodeClick={handleNodeClick}
                  filter={filter}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panneau d'informations */}
          <div className="space-y-6">
            {/* Informations du nœud sélectionné */}
            {selectedNodeData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Nœud Sélectionné
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{selectedNodeData.name}</h3>
                    <Badge variant="outline" className="mt-1">
                      {selectedNodeData.type}
                    </Badge>
                  </div>
                  
                  {selectedNodeData.description && (
                    <p className="text-sm text-gray-600">{selectedNodeData.description}</p>
                  )}
                  
                  {selectedNodeData.culture && (
                    <div>
                      <span className="text-sm font-medium">Culture: </span>
                      <span className="text-sm">{selectedNodeData.culture}</span>
                    </div>
                  )}
                  
                  {selectedNodeData.period && (
                    <div>
                      <span className="text-sm font-medium">Période: </span>
                      <span className="text-sm">{selectedNodeData.period}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <span className="text-sm font-medium">Connexions: </span>
                    <Badge variant="secondary">{selectedNodeData.connections}</Badge>
                  </div>

                  {connectedNodes.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Connecté à:</h4>
                      <div className="flex flex-wrap gap-1">
                        {connectedNodes.slice(0, 10).map(node => (
                          <Badge key={node.id} variant="secondary" className="text-xs">
                            {node.name}
                          </Badge>
                        ))}
                        {connectedNodes.length > 10 && (
                          <Badge variant="secondary" className="text-xs">
                            +{connectedNodes.length - 10} autres
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Instructions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm space-y-2">
                    <p>• Cliquez sur un nœud pour voir ses détails</p>
                    <p>• Glissez-déposez pour repositionner</p>
                    <p>• Utilisez la molette pour zoomer</p>
                    <p>• Filtrez par type pour explorer</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Statistiques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total nœuds</span>
                  <Badge variant="secondary">{nodes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Total connexions</span>
                  <Badge variant="secondary">{links.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Symboles</span>
                  <Badge variant="secondary">{nodes.filter(n => n.type === 'symbol').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cultures</span>
                  <Badge variant="secondary">{nodes.filter(n => n.type === 'culture').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Périodes</span>
                  <Badge variant="secondary">{nodes.filter(n => n.type === 'period').length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tags</span>
                  <Badge variant="secondary">{nodes.filter(n => n.type === 'tag').length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-bold mb-2">
                  Exploration Sémantique Avancée
                </h3>
                <p className="text-sm opacity-80 mb-4">
                  Découvrez les relations cachées entre les symboles culturels
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => toast.success("Fonctionnalité à venir !")}
                >
                  Adopter cette Approche
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GraphPage;
