
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search, Filter, Maximize2, Navigation, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import ForceDirectedGraph from './ForceDirectedGraph';
import GraphInfoPanel from './GraphInfoPanel';

interface GraphNode {
  id: string;
  name: string;
  type: 'symbol' | 'culture' | 'period' | 'tag';
  culture?: string;
  period?: string;
  description?: string;
  connections: number;
  tags?: string[];
  color: string;
  historical_context?: string;
  significance?: string;
  cultural_taxonomy_code?: string;
  temporal_taxonomy_code?: string;
  thematic_taxonomy_codes?: string[];
  sources?: Array<{ title: string; url: string; type: string }>;
  medium?: string[];
  technique?: string[];
  function?: string[];
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'culture' | 'period' | 'tag';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const FullScreenGraphModal: React.FC<Props> = ({
  isOpen,
  onClose,
  nodes,
  links,
  selectedNode,
  onNodeClick,
  filter,
  onFilterChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showControls, setShowControls] = useState(true);

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null;

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

  const connectedNodes = selectedNode ? getConnectedNodes(selectedNode) : [];

  const filteredNodes = nodes.filter(node => 
    node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (node.culture && node.culture.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (node.tags && node.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 2) {
      const foundNode = nodes.find(node => 
        node.name.toLowerCase().includes(query.toLowerCase())
      );
      if (foundNode) {
        onNodeClick(foundNode.id);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="flex h-full">
          {/* Barre d'outils latérale */}
          <div className={`${showControls ? 'w-80' : 'w-12'} bg-white/90 backdrop-blur-sm border-r transition-all duration-300 flex flex-col`}>
            {/* En-tête des contrôles */}
            <div className="p-4 border-b flex items-center justify-between">
              {showControls && (
                <h2 className="text-lg font-semibold">Contrôles du Graphe</h2>
              )}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowControls(!showControls)}
                >
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showControls && (
              <>
                {/* Recherche */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un symbole..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {filteredNodes.length} résultat(s) trouvé(s)
                    </p>
                  )}
                </div>

                {/* Filtres */}
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium mb-3">Filtres</h3>
                  <div className="flex flex-wrap gap-2">
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
                        onClick={() => onFilterChange(key)}
                        className="text-xs"
                      >
                        {label}
                        <Badge variant="secondary" className="ml-1 text-xs">
                          {count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Contrôles de vue */}
                <div className="p-4 border-b">
                  <h3 className="text-sm font-medium mb-3">Vue</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <ZoomIn className="h-4 w-4 mr-1" />
                      Zoom +
                    </Button>
                    <Button variant="outline" size="sm">
                      <ZoomOut className="h-4 w-4 mr-1" />
                      Zoom -
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-1" />
                      Centrer
                    </Button>
                  </div>
                </div>

                {/* Panneau d'informations */}
                <div className="flex-1 overflow-hidden">
                  <GraphInfoPanel
                    selectedNode={selectedNodeData}
                    connectedNodes={connectedNodes}
                    onFullScreen={() => {}} // Déjà en plein écran
                    onNodeSelect={onNodeClick}
                  />
                </div>
              </>
            )}
          </div>

          {/* Zone principale du graphe */}
          <div className="flex-1 relative">
            <ForceDirectedGraph
              nodes={filteredNodes}
              links={links}
              selectedNode={selectedNode}
              onNodeClick={onNodeClick}
              filter={filter}
            />

            {/* Overlay d'information rapide */}
            {selectedNodeData && (
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
                <h3 className="font-semibold text-lg mb-2">{selectedNodeData.name}</h3>
                <div className="space-y-1 text-sm">
                  {selectedNodeData.culture && (
                    <p><span className="font-medium">Culture:</span> {selectedNodeData.culture}</p>
                  )}
                  {selectedNodeData.period && (
                    <p><span className="font-medium">Période:</span> {selectedNodeData.period}</p>
                  )}
                  <p><span className="font-medium">Connexions:</span> {selectedNodeData.connections}</p>
                </div>
              </div>
            )}

            {/* Légende flottante */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <h4 className="text-sm font-medium mb-2">Légende</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Symboles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Cultures</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Périodes</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span>Tags</span>
                </div>
              </div>
            </div>

            {/* Instructions flottantes */}
            {!selectedNode && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg text-center max-w-md">
                <Maximize2 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="text-lg font-semibold mb-2">Mode Plein Écran Activé</h3>
                <p className="text-sm text-muted-foreground">
                  Explorez le graphe sémantique avec toutes les fonctionnalités avancées. 
                  Cliquez sur un nœud pour découvrir ses connexions et informations détaillées.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenGraphModal;
