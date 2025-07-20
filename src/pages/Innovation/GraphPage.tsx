
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network, Filter, Info, Zap, Users, TrendingUp, ArrowRight, Maximize2, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';
import ForceDirectedGraph from '@/components/graph/ForceDirectedGraph';
import GraphInfoPanel from '@/components/graph/GraphInfoPanel';
import FullScreenGraphModal from '@/components/graph/FullScreenGraphModal';
import GraphPreFilters, { GraphFilters } from '@/components/graph/GraphPreFilters';
import { useFilteredGraphData } from '@/hooks/useFilteredGraphData';
import { toast } from 'sonner';

const GraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'symbol' | 'culture' | 'period' | 'tag'>('all');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreFilters, setShowPreFilters] = useState(true);
  const [appliedFilters, setAppliedFilters] = useState<GraphFilters | null>(null);
  
  const { data: symbols, isLoading, error } = useAllSymbols();
  const { nodes, links, totalCount } = useFilteredGraphData(symbols || [], appliedFilters);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNode === nodeId ? null : nodeId);
    
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

  const handleApplyFilters = (filters: GraphFilters) => {
    setAppliedFilters(filters);
    setShowPreFilters(false);
    toast.success(`Graphe généré avec ${nodes.length} nœuds!`);
  };

  const handleResetFilters = () => {
    setAppliedFilters(null);
    setShowPreFilters(true);
    setSelectedNode(null);
  };

  // Recherche intelligente
  const filteredNodes = searchQuery.length > 0 
    ? nodes.filter(node => 
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (node.culture && node.culture.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (node.tags && node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      )
    : nodes;

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

        {/* Mode pré-filtres */}
        {showPreFilters && (
          <div className="max-w-4xl mx-auto">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuration de l'Exploration
                </CardTitle>
                <CardDescription>
                  Avec {symbols?.length || 0} symboles disponibles, configurez vos filtres pour une exploration optimale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GraphPreFilters
                  onApplyFilters={handleApplyFilters}
                  totalSymbols={symbols?.length || 0}
                  estimatedNodes={Math.min(100, (symbols?.length || 0) * 0.3)}
                  estimatedLinks={Math.min(300, (symbols?.length || 0) * 1.5)}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mode graphe actif */}
        {!showPreFilters && appliedFilters && (
          <>
            {/* Contrôles du graphe */}
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Exploration Active
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {nodes.length} nœuds • {links.length} liens
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleResetFilters}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Reconfigurer
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      Plein Écran
                    </Button>
                  </div>

                  {searchQuery && (
                    <div className="text-sm text-muted-foreground">
                      {filteredNodes.length} résultat(s) trouvé(s) pour "{searchQuery}"
                    </div>
                  )}

                  {/* Filtres de vue */}
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
                      {filteredNodes.length} nœuds visibles • {links.length} connexions
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

              {/* Panneau d'informations */}
              <div className="space-y-6">
                <GraphInfoPanel
                  selectedNode={selectedNodeData}
                  connectedNodes={connectedNodes}
                  onFullScreen={() => setIsFullScreen(true)}
                  onNodeSelect={handleNodeClick}
                />

                {/* Statistiques de session */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Session d'Exploration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Nœuds affichés</span>
                      <Badge variant="secondary">{nodes.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Connexions visibles</span>
                      <Badge variant="secondary">{links.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Symboles filtrés</span>
                      <Badge variant="secondary">{totalCount}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mode</span>
                      <Badge variant="outline">{appliedFilters.mode}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

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
    </div>
  );
};

export default GraphPage;
