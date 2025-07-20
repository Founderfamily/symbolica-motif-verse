
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Maximize2 } from 'lucide-react';
import ForceDirectedGraph from './ForceDirectedGraph';

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
  // Données enrichies
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
  type: 'culture' | 'period' | 'tag' | 'taxonomy';
}

interface FullScreenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
  filter: string;
  onFilterChange: (filter: 'all' | 'symbol' | 'culture' | 'period' | 'tag') => void;
}

const FullScreenGraphModal: React.FC<FullScreenGraphModalProps> = ({
  isOpen,
  onClose,
  nodes,
  links,
  selectedNode,
  onNodeClick,
  filter,
  onFilterChange
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full p-0 gap-0">
        <div className="relative w-full h-full bg-white">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Maximize2 className="h-5 w-5" />
                  <h2 className="text-lg font-semibold">Graphe Sémantique - Mode Plein Écran</h2>
                </div>
                <div className="text-sm text-muted-foreground">
                  {nodes.length} nœuds • {links.length} connexions
                </div>
              </div>

              {/* Filtres rapides */}
              <div className="flex items-center gap-2">
                {[
                  { key: 'all', label: 'Tout' },
                  { key: 'symbol', label: 'Symboles' },
                  { key: 'culture', label: 'Cultures' },
                  { key: 'period', label: 'Périodes' },
                  { key: 'tag', label: 'Tags' }
                ].map(({ key, label }) => (
                  <Button
                    key={key}
                    variant={filter === key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onFilterChange(key as 'all' | 'symbol' | 'culture' | 'period' | 'tag')}
                  >
                    {label}
                  </Button>
                ))}
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Graphe */}
          <div className="w-full h-full pt-20">
            <ForceDirectedGraph
              nodes={nodes}
              links={links}
              selectedNode={selectedNode}
              onNodeClick={onNodeClick}
              filter={filter}
            />
          </div>

          {/* Instructions en plein écran */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="text-sm font-medium text-gray-800 mb-2">Contrôles Plein Écran</div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• Cliquez et glissez pour explorer</div>
              <div>• Molette pour zoomer/dézoomer</div>
              <div>• Sélectionnez un nœud pour voir les détails</div>
              <div>• Utilisez les filtres en haut pour affiner</div>
            </div>
          </div>

          {/* Info nœud sélectionné */}
          {selectedNode && (
            <div className="absolute top-20 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
              {(() => {
                const node = nodes.find(n => n.id === selectedNode);
                if (!node) return null;
                
                return (
                  <div>
                    <div className="text-sm font-medium mb-2">{node.name}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      Type: {node.type} • {node.connections} connexions
                    </div>
                    {node.description && (
                      <div className="text-xs text-gray-600">
                        {node.description.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FullScreenGraphModal;
