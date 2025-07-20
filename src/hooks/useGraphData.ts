
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

interface GraphLink {
  source: string;
  target: string;
  type: 'culture' | 'period' | 'tag' | 'taxonomy';
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

    // Créer les nœuds pour les symboles avec données enrichies
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
        color: getNodeColor('symbol'),
        // Données enrichies
        historical_context: symbol.historical_context || undefined,
        significance: symbol.significance || undefined,
        cultural_taxonomy_code: symbol.cultural_taxonomy_code || undefined,
        temporal_taxonomy_code: symbol.temporal_taxonomy_code || undefined,
        thematic_taxonomy_codes: symbol.thematic_taxonomy_codes || undefined,
        sources: Array.isArray(symbol.sources) ? symbol.sources as Array<{ title: string; url: string; type: string }> : undefined,
        medium: symbol.medium || undefined,
        technique: symbol.technique || undefined,
        function: symbol.function || undefined,
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

    // Créer les nœuds pour les classifications taxonomiques
    const culturalTaxonomies = [...new Set(symbols.map(s => s.cultural_taxonomy_code).filter(Boolean))];
    culturalTaxonomies.forEach(taxonomy => {
      if (!nodeMap.has(`taxonomy-${taxonomy}`)) {
        const taxonomyNode: GraphNode = {
          id: `taxonomy-${taxonomy}`,
          name: `Classification: ${taxonomy}`,
          type: 'tag',
          description: `Classification culturelle: ${taxonomy}`,
          connections: 0,
          color: '#ec4899' // rose-500 pour différencier
        };
        nodes.push(taxonomyNode);
        nodeMap.set(taxonomyNode.id, taxonomyNode);
      }
    });

    // Créer les liens traditionnels
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

      // Liens taxonomiques (nouveaux)
      if (symbol.cultural_taxonomy_code) {
        const taxonomyId = `taxonomy-${symbol.cultural_taxonomy_code}`;
        links.push({
          source: symbol.id,
          target: taxonomyId,
          type: 'taxonomy'
        });
      }
    });

    // Créer des connexions intelligentes entre symboles
    symbols.forEach((symbol, index) => {
      symbols.slice(index + 1).forEach(otherSymbol => {
        let connectionStrength = 0;
        
        // Connexion par classification culturelle
        if (symbol.cultural_taxonomy_code && symbol.cultural_taxonomy_code === otherSymbol.cultural_taxonomy_code) {
          connectionStrength += 3;
        }
        
        // Connexion par période temporelle
        if (symbol.temporal_taxonomy_code && symbol.temporal_taxonomy_code === otherSymbol.temporal_taxonomy_code) {
          connectionStrength += 2;
        }
        
        // Connexion par tags thématiques partagés
        if (symbol.thematic_taxonomy_codes && otherSymbol.thematic_taxonomy_codes) {
          const sharedThemes = symbol.thematic_taxonomy_codes.filter(theme =>
            otherSymbol.thematic_taxonomy_codes?.includes(theme)
          );
          connectionStrength += sharedThemes.length;
        }
        
        // Connexion par tags partagés
        if (symbol.tags && otherSymbol.tags) {
          const sharedTags = symbol.tags.filter(tag => otherSymbol.tags?.includes(tag));
          connectionStrength += sharedTags.length * 0.5;
        }
        
        // Créer un lien si suffisamment de connexions
        if (connectionStrength >= 2) {
          links.push({
            source: symbol.id,
            target: otherSymbol.id,
            type: 'taxonomy'
          });
        }
      });
    });

    // Calculer le nombre de connexions pour chaque nœud
    links.forEach(link => {
      const sourceNode = nodeMap.get(typeof link.source === 'string' ? link.source : link.source);
      const targetNode = nodeMap.get(typeof link.target === 'string' ? link.target : link.target);
      
      if (sourceNode) sourceNode.connections++;
      if (targetNode) targetNode.connections++;
    });

    console.log(`Graphe généré: ${nodes.length} nœuds, ${links.length} liens`);
    console.log(`Symboles enrichis: ${symbols.filter(s => s.historical_context || s.significance).length}`);

    return { nodes, links };
  }, [symbols]);
};
