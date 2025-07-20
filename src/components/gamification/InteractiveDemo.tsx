import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Zap, ChevronRight } from 'lucide-react';

interface ConnectionNode {
  id: string;
  label: string;
  connections: number;
  color: string;
  x: number;
  y: number;
  active: boolean;
}

interface InteractiveDemoProps {
  onExplore?: (nodeId: string) => void;
}

export default function InteractiveDemo({ onExplore }: InteractiveDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  const [nodes, setNodes] = useState<ConnectionNode[]>([
    { id: 'AE', label: 'Art Égyptien', connections: 12, color: 'bg-purple-500', x: 15, y: 20, active: false },
    { id: 'AdV', label: 'Art de Vivre', connections: 8, color: 'bg-blue-500', x: 35, y: 30, active: false },
    { id: 'M', label: 'Mythologie', connections: 15, color: 'bg-purple-600', x: 55, y: 15, active: false },
    { id: 'VE', label: 'Vie Éternelle', connections: 20, color: 'bg-green-500', x: 75, y: 25, active: false },
    { id: 'B', label: 'Bouddhisme', connections: 25, color: 'bg-orange-500', x: 85, y: 35, active: false }
  ]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setAnimationFrame(prev => prev + 1);
        setNodes(prevNodes => 
          prevNodes.map(node => ({
            ...node,
            active: Math.random() > 0.7,
            connections: node.connections + (Math.random() > 0.8 ? 1 : 0)
          }))
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onExplore?.(nodeId);
  };

  const getNodeSize = (connections: number) => {
    return Math.max(60, Math.min(100, connections * 3));
  };

  return (
    <Card className="bg-slate-800 border-purple-500/20 overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="h-5 w-5 text-purple-400" />
              Démonstration Interactive
            </CardTitle>
            <CardDescription className="text-purple-200">
              Cliquez sur les nœuds pour explorer les connexions
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsRunning(!isRunning)}
            variant={isRunning ? "destructive" : "default"}
            size="sm"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Arrêter' : 'Démarrer'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Interactive Visualization */}
        <div className="relative bg-slate-900 h-80 overflow-hidden">
          {/* Background grid */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            {nodes.map((node, i) => 
              nodes.slice(i + 1).map((otherNode, j) => {
                const distance = Math.sqrt(
                  Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
                );
                const isConnected = distance < 40 || (node.active && otherNode.active);
                
                if (!isConnected) return null;
                
                return (
                  <line
                    key={`${node.id}-${otherNode.id}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${otherNode.x}%`}
                    y2={`${otherNode.y}%`}
                    stroke="rgb(168, 85, 247)"
                    strokeWidth={node.active && otherNode.active ? "3" : "1"}
                    opacity={node.active && otherNode.active ? "0.8" : "0.3"}
                    className="transition-all duration-500"
                  />
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const size = getNodeSize(node.connections);
            return (
              <div
                key={node.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
                  node.active ? 'scale-110' : 'scale-100'
                } ${selectedNode === node.id ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  width: `${size}px`,
                  height: `${size}px`
                }}
                onClick={() => handleNodeClick(node.id)}
              >
                <div className={`w-full h-full rounded-full ${node.color} flex items-center justify-center text-white font-bold text-sm shadow-lg hover:shadow-xl transition-shadow ${
                  node.active ? 'animate-pulse' : ''
                }`}>
                  <div className="text-center">
                    <div className="font-bold">{node.id}</div>
                    <div className="text-xs opacity-75">{node.connections}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pulse effect for active nodes */}
          {nodes.filter(node => node.active).map((node) => (
            <div
              key={`pulse-${node.id}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`
              }}
            >
              <div className="w-24 h-24 rounded-full border-2 border-purple-400 opacity-50 animate-ping"></div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4">
          <Button 
            className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30"
            onClick={() => setIsRunning(false)}
          >
            {selectedNode ? `Explorer ${selectedNode}` : 'Arrêter la simulation'}
            <Zap className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Node Details */}
        {selectedNode && (
          <div className="p-4 bg-slate-700 border-t border-slate-600">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">
                  {nodes.find(n => n.id === selectedNode)?.label}
                </h4>
                <p className="text-sm text-purple-200">
                  {nodes.find(n => n.id === selectedNode)?.connections} connexions actives
                </p>
              </div>
              <Button size="sm" variant="outline" className="text-purple-300 border-purple-300">
                Explorez en détail
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}