
import { useMemo } from 'react';
import { SymbolData } from '@/types/supabase';
import { useGraphData } from './useGraphData';
import { GraphFilters } from '@/components/graph/GraphPreFilters';

export const useFilteredGraphData = (symbols: SymbolData[], filters: GraphFilters | null) => {
  const { nodes: allNodes, links: allLinks } = useGraphData(symbols || []);

  return useMemo(() => {
    if (!filters || !symbols.length) {
      return { nodes: [], links: [], totalCount: symbols.length };
    }

    // Étape 1: Filtrer les symboles selon les critères
    let filteredSymbols = symbols;

    // Filtre par région culturelle
    if (filters.culturalRegion !== 'all') {
      filteredSymbols = filteredSymbols.filter(symbol => 
        symbol.cultural_taxonomy_code?.startsWith(filters.culturalRegion)
      );
    }

    // Filtre par période temporelle
    if (filters.temporalPeriod !== 'all') {
      filteredSymbols = filteredSymbols.filter(symbol => 
        symbol.temporal_taxonomy_code === filters.temporalPeriod
      );
    }

    // Filtre par catégorie thématique
    if (filters.thematicCategory !== 'all') {
      filteredSymbols = filteredSymbols.filter(symbol => 
        symbol.thematic_taxonomy_codes?.includes(filters.thematicCategory)
      );
    }

    // Étape 2: Appliquer la logique du mode d'exploration
    let selectedSymbols = filteredSymbols;

    switch (filters.mode) {
      case 'explorer':
        // Prendre les symboles les plus connectés
        selectedSymbols = filteredSymbols
          .sort((a, b) => {
            const aConnections = (a.tags?.length || 0) + (a.thematic_taxonomy_codes?.length || 0);
            const bConnections = (b.tags?.length || 0) + (b.thematic_taxonomy_codes?.length || 0);
            return bConnections - aConnections;
          })
          .slice(0, Math.floor(filters.maxNodes * 0.6)); // 60% de symboles
        break;

      case 'thematic':
        // Grouper par thème et prendre les plus représentatifs
        if (filters.thematicCategory !== 'all') {
          selectedSymbols = filteredSymbols.slice(0, Math.floor(filters.maxNodes * 0.7));
        }
        break;

      case 'cultural':
        // Diversifier par cultures dans la région
        const cultureGroups = new Map<string, SymbolData[]>();
        filteredSymbols.forEach(symbol => {
          const culture = symbol.culture || 'Unknown';
          if (!cultureGroups.has(culture)) {
            cultureGroups.set(culture, []);
          }
          cultureGroups.get(culture)!.push(symbol);
        });
        
        selectedSymbols = [];
        const symbolsPerCulture = Math.floor(filters.maxNodes * 0.6 / cultureGroups.size);
        cultureGroups.forEach(symbols => {
          selectedSymbols.push(...symbols.slice(0, symbolsPerCulture));
        });
        break;

      case 'temporal':
        // Répartir équitablement sur les périodes
        selectedSymbols = filteredSymbols.slice(0, Math.floor(filters.maxNodes * 0.6));
        break;
    }

    // Étape 3: Limiter le nombre total de nœuds
    selectedSymbols = selectedSymbols.slice(0, Math.floor(filters.maxNodes * 0.6));

    // Étape 4: Générer les nœuds et liens filtrés
    const selectedSymbolIds = new Set(selectedSymbols.map(s => s.id));
    
    const filteredNodes = allNodes.filter(node => {
      if (node.type === 'symbol') {
        return selectedSymbolIds.has(node.id);
      }
      // Garder les nœuds de culture/période/tag qui sont connectés aux symboles sélectionnés
      return allLinks.some(link => {
        const sourceId = typeof link.source === 'string' ? link.source : (link.source as any)?.id || link.source;
        const targetId = typeof link.target === 'string' ? link.target : (link.target as any)?.id || link.target;
        
        return (selectedSymbolIds.has(sourceId) && targetId === node.id) ||
               (selectedSymbolIds.has(targetId) && sourceId === node.id);
      });
    }).slice(0, filters.maxNodes);

    const filteredNodeIds = new Set(filteredNodes.map(n => n.id));
    
    const filteredLinks = allLinks.filter(link => {
      const sourceId = typeof link.source === 'string' ? link.source : (link.source as any)?.id || link.source;
      const targetId = typeof link.target === 'string' ? link.target : (link.target as any)?.id || link.target;
      
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    }).filter((link, index, arr) => {
      // Filtrer par force de connexion si spécifié
      if (filters.connectionStrength > 2) {
        // Garder seulement les connexions taxonomiques et directes
        return link.type === 'taxonomy' || link.type === 'culture';
      }
      return true;
    });

    console.log(`Filtres appliqués: ${selectedSymbols.length} symboles → ${filteredNodes.length} nœuds, ${filteredLinks.length} liens`);

    return {
      nodes: filteredNodes,
      links: filteredLinks,
      totalCount: filteredSymbols.length
    };
  }, [allNodes, allLinks, symbols, filters]);
};
