
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Badge } from '@/components/ui/badge';

interface GraphNode extends d3.SimulationNodeDatum {
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

interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  source: string | GraphNode;
  target: string | GraphNode;
  type: 'culture' | 'period' | 'tag' | 'taxonomy';
}

interface Props {
  nodes: GraphNode[];
  links: GraphLink[];
  selectedNode: string | null;
  onNodeClick: (nodeId: string) => void;
  filter: string;
}

const ForceDirectedGraph: React.FC<Props> = ({ 
  nodes, 
  links, 
  selectedNode, 
  onNodeClick,
  filter 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink>>();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Filtrer les nœuds selon le filtre actuel
    const filteredNodes = filter === 'all' ? nodes : nodes.filter(n => n.type === filter);
    const filteredLinks = links.filter(l => {
      const sourceId = typeof l.source === 'string' ? l.source : l.source.id;
      const targetId = typeof l.target === 'string' ? l.target : l.target.id;
      return filteredNodes.some(n => n.id === sourceId) && filteredNodes.some(n => n.id === targetId);
    });

    // Créer la simulation de force
    const simulation = d3.forceSimulation<GraphNode>(filteredNodes)
      .force("link", d3.forceLink<GraphNode, GraphLink>(filteredLinks).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(40));

    simulationRef.current = simulation;

    // Créer les liens
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(filteredLinks)
      .enter().append("line")
      .attr("stroke", d => {
        switch(d.type) {
          case 'culture': return '#3b82f6';
          case 'period': return '#10b981';
          case 'tag': return '#f97316';
          case 'taxonomy': return '#ec4899';
          default: return '#94a3b8';
        }
      })
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Créer les nœuds
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(filteredNodes)
      .enter().append("circle")
      .attr("r", d => Math.max(20, Math.min(40, d.connections * 2)))
      .attr("fill", d => d.color)
      .attr("stroke", d => selectedNode === d.id ? "#fbbf24" : "#ffffff")
      .attr("stroke-width", d => selectedNode === d.id ? 4 : 2)
      .style("cursor", "pointer")
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
      .on("click", (event, d) => {
        event.stopPropagation();
        onNodeClick(d.id);
      });

    // Ajouter les labels
    const labels = svg.append("g")
      .attr("class", "labels")
      .selectAll("text")
      .data(filteredNodes)
      .enter().append("text")
      .text(d => d.name.length > 12 ? d.name.substring(0, 12) + "..." : d.name)
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .attr("fill", "#1e293b")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("pointer-events", "none");

    // Mise à jour des positions
    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as GraphNode).x!)
        .attr("y1", d => (d.source as GraphNode).y!)
        .attr("x2", d => (d.target as GraphNode).x!)
        .attr("y2", d => (d.target as GraphNode).y!);

      node
        .attr("cx", d => d.x!)
        .attr("cy", d => d.y!);

      labels
        .attr("x", d => d.x!)
        .attr("y", d => d.y!);
    });

    // Fonctions de drag
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>, d: GraphNode) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGCircleElement, GraphNode, GraphNode>, d: GraphNode) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom et pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        svg.select("g").attr("transform", event.transform);
      });

    svg.call(zoom);

    return () => {
      simulation.stop();
    };
  }, [nodes, links, selectedNode, onNodeClick, filter, dimensions]);

  return (
    <div className="w-full h-full relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="border border-gray-200 rounded-lg bg-white"
      >
        <g />
      </svg>
      
      {/* Instructions */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-800 mb-2">Contrôles</div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• Cliquez sur un nœud pour voir les connexions</div>
          <div>• Glissez-déposez pour déplacer</div>
          <div>• Molette pour zoomer</div>
        </div>
      </div>

      {/* Légende enrichie */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-sm font-medium text-gray-800 mb-2">Types & Connexions</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            <span className="text-xs">Symboles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-xs">Cultures</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-xs">Périodes</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span className="text-xs">Tags</span>
          </div>
          <hr className="my-2" />
          <div className="text-xs text-gray-600">Liens :</div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500"></div>
            <span className="text-xs">Culture</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500"></div>
            <span className="text-xs">Période</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500"></div>
            <span className="text-xs">Tag</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-pink-500"></div>
            <span className="text-xs">Taxonomie</span>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="text-xs text-gray-600">
          {nodes.length} nœuds • {links.length} liens
        </div>
      </div>
    </div>
  );
};

export default ForceDirectedGraph;
