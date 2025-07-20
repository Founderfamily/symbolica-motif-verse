
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, Globe, Clock, Tag, ExternalLink, Maximize2, History, Users } from 'lucide-react';

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
  // Nouvelles propriétés enrichies
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

interface Props {
  selectedNode: GraphNode | null;
  connectedNodes: GraphNode[];
  onFullScreen: () => void;
  onNodeSelect: (nodeId: string) => void;
}

const GraphInfoPanel: React.FC<Props> = ({ 
  selectedNode, 
  connectedNodes, 
  onFullScreen,
  onNodeSelect 
}) => {
  if (!selectedNode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-3">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onFullScreen}>
                <Maximize2 className="h-4 w-4 mr-2" />
                Mode plein écran
              </Button>
            </div>
            <Separator />
            <div>• Cliquez sur un nœud pour voir ses détails</div>
            <div>• Glissez-déposez pour repositionner</div>
            <div>• Utilisez la molette pour zoomer</div>
            <div>• Filtrez par type pour explorer</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTaxonomyLabel = (code: string) => {
    const taxonomies: Record<string, string> = {
      'EUR-FRA': 'France', 'ASI-CHI': 'Chine', 'ASI-IND': 'Inde',
      'AFR-EGY': 'Égypte', 'EUR-CEL': 'Celtique', 'AME-NAT': 'Amérindien',
      'ANT': 'Antiquité', 'MED': 'Moyen Âge', 'MOD': 'Moderne', 'CON': 'Contemporain',
      'REL': 'Religieux', 'ART': 'Artistique', 'POL': 'Politique', 'NAT': 'Nature',
      'MYT': 'Mythologique', 'RIT': 'Rituel', 'SOC': 'Social', 'PHI': 'Philosophique'
    };
    return taxonomies[code] || code;
  };

  return (
    <div className="space-y-4 max-h-[800px] overflow-y-auto">
      {/* En-tête avec informations principales */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
              <Badge variant="outline" className="mt-1">
                {selectedNode.type}
              </Badge>
            </div>
            <Button variant="outline" size="sm" onClick={onFullScreen}>
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedNode.description && (
            <p className="text-sm text-muted-foreground">{selectedNode.description}</p>
          )}
          
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            {selectedNode.culture && (
              <div>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  Culture
                </span>
                <p className="text-sm text-muted-foreground">{selectedNode.culture}</p>
              </div>
            )}
            
            {selectedNode.period && (
              <div>
                <span className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Période
                </span>
                <p className="text-sm text-muted-foreground">{selectedNode.period}</p>
              </div>
            )}
          </div>

          {/* Contexte historique enrichi */}
          {selectedNode.historical_context && (
            <div>
              <span className="text-sm font-medium flex items-center gap-1 mb-2">
                <History className="h-4 w-4" />
                Contexte historique
              </span>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                {selectedNode.historical_context}
              </p>
            </div>
          )}

          {/* Signification */}
          {selectedNode.significance && (
            <div>
              <span className="text-sm font-medium mb-2 block">Signification</span>
              <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-md border-l-4 border-blue-200">
                {selectedNode.significance}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Classifications taxonomiques */}
      {(selectedNode.cultural_taxonomy_code || selectedNode.temporal_taxonomy_code || selectedNode.thematic_taxonomy_codes) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classifications UNESCO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedNode.cultural_taxonomy_code && (
              <div>
                <span className="text-sm font-medium">Culturelle</span>
                <Badge variant="secondary" className="ml-2">
                  {getTaxonomyLabel(selectedNode.cultural_taxonomy_code)}
                </Badge>
              </div>
            )}
            
            {selectedNode.temporal_taxonomy_code && (
              <div>
                <span className="text-sm font-medium">Temporelle</span>
                <Badge variant="secondary" className="ml-2">
                  {getTaxonomyLabel(selectedNode.temporal_taxonomy_code)}
                </Badge>
              </div>
            )}
            
            {selectedNode.thematic_taxonomy_codes && selectedNode.thematic_taxonomy_codes.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Thématiques</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.thematic_taxonomy_codes.map(code => (
                    <Badge key={code} variant="outline" className="text-xs">
                      {getTaxonomyLabel(code)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Techniques et médiums */}
      {(selectedNode.technique || selectedNode.medium || selectedNode.function) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Détails techniques</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedNode.technique && selectedNode.technique.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Techniques</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.technique.map(tech => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedNode.medium && selectedNode.medium.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Médiums</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.medium.map(med => (
                    <Badge key={med} variant="outline" className="text-xs">
                      {med}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {selectedNode.function && selectedNode.function.length > 0 && (
              <div>
                <span className="text-sm font-medium mb-2 block">Fonctions</span>
                <div className="flex flex-wrap gap-1">
                  {selectedNode.function.map(func => (
                    <Badge key={func} variant="secondary" className="text-xs">
                      {func}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sources et références */}
      {selectedNode.sources && selectedNode.sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Sources et références
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedNode.sources.map((source, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div>
                    <p className="text-sm font-medium">{source.title}</p>
                    <Badge variant="outline" className="text-xs">{source.type}</Badge>
                  </div>
                  {source.url && (
                    <Button variant="ghost" size="sm" asChild>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Métriques de connexion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Réseau de connexions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total connexions</span>
              <Badge variant="secondary">{selectedNode.connections}</Badge>
            </div>
            
            {/* Répartition par type */}
            {connectedNodes.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <span className="text-sm font-medium">Connecté à ({connectedNodes.length})</span>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {connectedNodes.slice(0, 8).map(node => (
                      <div key={node.id} className="flex items-center justify-between text-xs">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 justify-start"
                          onClick={() => onNodeSelect(node.id)}
                        >
                          <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: node.color }} />
                          {node.name}
                        </Button>
                        <Badge variant="outline" className="text-xs">
                          {node.type}
                        </Badge>
                      </div>
                    ))}
                    {connectedNodes.length > 8 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{connectedNodes.length - 8} autres connexions
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {selectedNode.tags && selectedNode.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Tags associés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {selectedNode.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs cursor-pointer hover:bg-muted">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GraphInfoPanel;
