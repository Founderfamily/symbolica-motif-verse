
import { useMemo } from 'react';
import { SymbolData } from '@/types/supabase';

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
}

interface GraphLink {
  source: string;
  target: string;
  type: 'culture' | 'period' | 'tag';
}

const getNodeColor = (type: string) => {
  switch (type) {
    case 'symbol': return '#a855f7'; // purple-500
    case 'culture': return '#3b82f6'; // blue-500
    case 'period': return '#10b981'; // green-500
    case 'tag': return '#f97316'; // orange-500
    default: return '#6b7280'; // gray-500
  }
};

export const useGraphData = (symbols: SymbolData[]) => {
  return useMemo(() => {
    if (!symbols || symbols.length === 0) {
      return { nodes: [], links: [] };
    }

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];
    const nodeMap = new Map<string, GraphNode>();

    // Créer les nœuds pour les symboles
    symbols.forEach(symbol => {
      const symbolNode: GraphNode = {
        id: symbol.id,
        name: symbol.name,
        type: 'symbol',
        culture: symbol.culture,
        period: symbol.period,
        description: symbol.description || '',
        connections: 0,
        tags: symbol.tags || [],
        color: getNodeColor('symbol')
      };
      nodes.push(symbolNode);
      nodeMap.set(symbol.id, symbolNode);
    });

    // Créer les nœuds pour les cultures
    const cultures = [...new Set(symbols.map(s => s.culture).filter(Boolean))];
    cultures.forEach(culture => {
      const cultureNode: GraphNode = {
        id: `culture-${culture}`,
        name: culture,
        type: 'culture',
        description: `Culture: ${culture}`,
        connections: 0,
        color: getNodeColor('culture')
      };
      nodes.push(cultureNode);
      nodeMap.set(cultureNode.id, cultureNode);
    });

    // Créer les nœuds pour les périodes
    const periods = [...new Set(symbols.map(s => s.period).filter(Boolean))];
    periods.forEach(period => {
      const periodNode: GraphNode = {
        id: `period-${period}`,
        name: period,
        type: 'period',
        description: `Période: ${period}`,
        connections: 0,
        color: getNodeColor('period')
      };
      nodes.push(periodNode);
      nodeMap.set(periodNode.id, periodNode);
    });

    // Créer les nœuds pour les tags
    const allTags = symbols.flatMap(s => s.tags || []);
    const uniqueTags = [...new Set(allTags)];
    uniqueTags.forEach(tag => {
      const tagNode: GraphNode = {
        id: `tag-${tag}`,
        name: tag,
        type: 'tag',
        description: `Tag: ${tag}`,
        connections: 0,
        color: getNodeColor('tag')
      };
      nodes.push(tagNode);
      nodeMap.set(tagNode.id, tagNode);
    });

    // Créer les liens
    symbols.forEach(symbol => {
      // Lien symbole -> culture
      if (symbol.culture) {
        const cultureId = `culture-${symbol.culture}`;
        links.push({
          source: symbol.id,
          target: cultureId,
          type: 'culture'
        });
      }

      // Lien symbole -> période
      if (symbol.period) {
        const periodId = `period-${symbol.period}`;
        links.push({
          source: symbol.id,
          target: periodId,
          type: 'period'
        });
      }

      // Liens symbole -> tags
      if (symbol.tags) {
        symbol.tags.forEach(tag => {
          const tagId = `tag-${tag}`;
          links.push({
            source: symbol.id,
            target: tagId,
            type: 'tag'
          });
        });
      }
    });

    // Calculer le nombre de connexions pour chaque nœud
    links.forEach(link => {
      const sourceNode = nodeMap.get(typeof link.source === 'string' ? link.source : link.source);
      const targetNode = nodeMap.get(typeof link.target === 'string' ? link.target : link.target);
      
      if (sourceNode) sourceNode.connections++;
      if (targetNode) targetNode.connections++;
    });

    return { nodes, links };
  }, [symbols]);
};
