
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Filter, Info, Zap, Users, TrendingUp, ArrowRight, Maximize2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';
import { useGraphData } from '@/hooks/useGraphData';
import ForceDirectedGraph from '@/components/graph/ForceDirectedGraph';
import GraphInfoPanel from '@/components/graph/GraphInfoPanel';
import FullScreenGraphModal from '@/components/graph/FullScreenGraphModal';
import { toast } from 'sonner';

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'symbol' | 'culture' | 'period' | 'tag'>('all');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Filtrage intelligent par recherche
  const filteredNodes = searchQuery.length > 0 
    ? nodes.filter(node => 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.culture && node.culture.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.tags && node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : nodes;

  // Recherche intelligente avec auto-sélection
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const foundNode = filteredNodes.find(node => 
        node.name.toLowerCase().includes(query.toLowerCase())
      );
      if (foundNode && foundNode.id !== selectedNode) {
        setSelectedNode(foundNode.id);
        toast.success(`Symbole trouvé: ${foundNode.name}`);
      }
    }
  };

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

        {/* Recherche et contrôles rapides */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Recherche et Navigation
              </CardTitle>
              <CardDescription>
                Trouvez rapidement un symbole ou explorez par catégories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recherche intelligente */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un symbole, culture, tag..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={() => setIsFullScreen(true)}
                  className="flex items-center gap-2"
                >
                  <Maximize2 className="h-4 w-4" />
                  Mode Plein Écran
                </Button>
              </div>

              {searchQuery && (
                <div className="text-sm text-muted-foreground">
                  {filteredNodes.length} résultat(s) trouvé(s) pour "{searchQuery}"
                </div>
              )}
            </CardContent>
          </Card>
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
                  { key: 'all', label: 'Tout', count: filteredNodes.length },
                  { key: 'symbol', label: 'Symboles', count: filteredNodes.filter(n => n.type === 'symbol').length },
                  { key: 'culture', label: 'Cultures', count: filteredNodes.filter(n => n.type === 'culture').length },
                  { key: 'period', label: 'Périodes', count: filteredNodes.filter(n => n.type === 'period').length },
                  { key: 'tag', label: 'Tags', count: filteredNodes.filter(n => n.type === 'tag').length }
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
                  {filteredNodes.length} nœuds • {links.length} connexions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ForceDirectedGraph
                  nodes={filteredNodes}
                  links={links}
                  selectedNode={selectedNode}
                  onNodeClick={handleNodeClick}
                  filter={filter}
                />
              </CardContent>
            </Card>
          </div>

          {/* Panneau d'informations enrichi */}
          <div className="space-y-6">
            <GraphInfoPanel
              selectedNode={selectedNodeData}
              connectedNodes={connectedNodes}
              onFullScreen={() => setIsFullScreen(true)}
              onNodeSelect={handleNodeClick}
            />

            {/* Statistiques enrichies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Statistiques du Réseau
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total nœuds</span>
                  <Badge variant="secondary">{nodes.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Connexions totales</span>
                  <Badge variant="secondary">{links.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Symboles enrichis</span>
                  <Badge variant="secondary">
                    {symbols?.filter(s => s.historical_context || s.significance).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Classifications UNESCO</span>
                  <Badge variant="secondary">
                    {symbols?.filter(s => s.cultural_taxonomy_code).length || 0}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Avec sources</span>
                  <Badge variant="secondary">
                    {symbols?.filter(s => s.sources && Array.isArray(s.sources) && s.sources.length > 0).length || 0}
                  </Badge>
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
                  Découvrez les relations cachées entre les symboles culturels avec notre interface enrichie
                </p>
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={() => setIsFullScreen(true)}
                >
                  Explorer en Plein Écran
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal plein écran */}
      <FullScreenGraphModal
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        nodes={nodes}
        links={links}
        selectedNode={selectedNode}
        onNodeClick={handleNodeClick}
        filter={filter}
        onFilterChange={setFilter}
      />
    </div>
  );
};

export default GraphPage;
