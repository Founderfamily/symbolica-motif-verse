/**
 * Hook pour les filtres standardisés selon les taxonomies mondiales
 */

import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CollectionWithTranslations } from '../types/collections';
import { 
  GEOGRAPHIC_CULTURAL_TAXONOMY,
  TEMPORAL_TAXONOMY,
  THEMATIC_TAXONOMY,
  findTaxonomyNode
} from '../taxonomy/WorldTaxonomy';

export interface StandardizedFilter {
  id: string;
  code: string;
  label: string;
  category: 'geographic' | 'temporal' | 'thematic';
  count: number;
  level: number; // Niveau hiérarchique (0 = racine, 1 = enfant, etc.)
  parent?: string;
}

export interface FilterState {
  geographic: string[];
  temporal: string[];
  thematic: string[];
  searchQuery: string;
  conformityLevel: 'all' | 'excellent' | 'good' | 'needs-improvement';
}

export const useStandardizedFilters = (collections: CollectionWithTranslations[] | undefined) => {
  const { i18n } = useTranslation();
  
  const [filters, setFilters] = useState<FilterState>({
    geographic: [],
    temporal: [],
    thematic: [],
    searchQuery: '',
    conformityLevel: 'all'
  });

  // Génération des options de filtre basées sur la taxonomie standardisée
  const filterOptions = useMemo(() => {
    if (!collections || collections.length === 0) {
      return {
        geographic: [],
        temporal: [],
        thematic: []
      };
    }

    const geographic = generateFilterOptions(collections, GEOGRAPHIC_CULTURAL_TAXONOMY, 'geographic', i18n.language);
    const temporal = generateFilterOptions(collections, TEMPORAL_TAXONOMY, 'temporal', i18n.language);
    const thematic = generateFilterOptions(collections, THEMATIC_TAXONOMY, 'thematic', i18n.language);

    return { geographic, temporal, thematic };
  }, [collections, i18n.language]);

  // Application des filtres
  const filteredCollections = useMemo(() => {
    if (!collections) return [];

    let result = [...collections];

    // Filtre par recherche textuelle
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(collection => {
        const title = collection.collection_translations?.[0]?.title?.toLowerCase() || '';
        const description = collection.collection_translations?.[0]?.description?.toLowerCase() || '';
        const slug = collection.slug?.toLowerCase() || '';
        
        return title.includes(query) || 
               description.includes(query) || 
               slug.includes(query);
      });
    }

    // Filtre géographique/culturel
    if (filters.geographic.length > 0) {
      result = result.filter(collection => 
        filters.geographic.some(geoCode => 
          isCollectionMatchingFilter(collection, geoCode, GEOGRAPHIC_CULTURAL_TAXONOMY)
        )
      );
    }

    // Filtre temporel
    if (filters.temporal.length > 0) {
      result = result.filter(collection => 
        filters.temporal.some(tempCode => 
          isCollectionMatchingFilter(collection, tempCode, TEMPORAL_TAXONOMY)
        )
      );
    }

    // Filtre thématique
    if (filters.thematic.length > 0) {
      result = result.filter(collection => 
        filters.thematic.some(themeCode => 
          isCollectionMatchingFilter(collection, themeCode, THEMATIC_TAXONOMY)
        )
      );
    }

    // Filtre par niveau de conformité
    if (filters.conformityLevel !== 'all') {
      result = result.filter(collection => {
        const conformityScore = calculateCollectionConformityScore(collection);
        switch (filters.conformityLevel) {
          case 'excellent':
            return conformityScore >= 0.8;
          case 'good':
            return conformityScore >= 0.6 && conformityScore < 0.8;
          case 'needs-improvement':
            return conformityScore < 0.6;
          default:
            return true;
        }
      });
    }

    return result;
  }, [collections, filters]);

  // Mise à jour des filtres
  const updateFilter = (category: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const addFilter = (category: 'geographic' | 'temporal' | 'thematic', code: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: [...prev[category], code]
    }));
  };

  const removeFilter = (category: 'geographic' | 'temporal' | 'thematic', code: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].filter(c => c !== code)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      geographic: [],
      temporal: [],
      thematic: [],
      searchQuery: '',
      conformityLevel: 'all'
    });
  };

  const getActiveFiltersCount = () => {
    return filters.geographic.length + 
           filters.temporal.length + 
           filters.thematic.length + 
           (filters.searchQuery ? 1 : 0) + 
           (filters.conformityLevel !== 'all' ? 1 : 0);
  };

  // Suggestions de filtres basées sur les collections visibles
  const getFilterSuggestions = () => {
    if (!collections || collections.length === 0) return [];

    const suggestions: string[] = [];
    
    // Analyser les collections pour suggérer des filtres pertinents
    const culturalTerms = new Set<string>();
    const temporalTerms = new Set<string>();
    
    collections.forEach(collection => {
      const slug = collection.slug?.toLowerCase() || '';
      const title = collection.collection_translations?.[0]?.title?.toLowerCase() || '';
      const text = `${slug} ${title}`;

      // Rechercher des correspondances taxonomiques
      GEOGRAPHIC_CULTURAL_TAXONOMY.forEach(node => {
        if (node.keywords.some(k => text.includes(k.toLowerCase()))) {
          culturalTerms.add(node.label[i18n.language] || node.label.fr);
        }
      });

      TEMPORAL_TAXONOMY.forEach(node => {
        if (node.keywords.some(k => text.includes(k.toLowerCase()))) {
          temporalTerms.add(node.label[i18n.language] || node.label.fr);
        }
      });
    });

    if (culturalTerms.size > 0) {
      suggestions.push(`Explorez les cultures: ${Array.from(culturalTerms).slice(0, 3).join(', ')}`);
    }
    
    if (temporalTerms.size > 0) {
      suggestions.push(`Découvrez les époques: ${Array.from(temporalTerms).slice(0, 3).join(', ')}`);
    }

    return suggestions;
  };

  return {
    filters,
    filterOptions,
    filteredCollections,
    updateFilter,
    addFilter,
    removeFilter,
    clearAllFilters,
    getActiveFiltersCount,
    getFilterSuggestions,
    hasActiveFilters: getActiveFiltersCount() > 0
  };
};

// ========================
// FONCTIONS UTILITAIRES
// ========================

function generateFilterOptions(
  collections: CollectionWithTranslations[],
  taxonomy: any[],
  category: 'geographic' | 'temporal' | 'thematic',
  language: string
): StandardizedFilter[] {
  const options: StandardizedFilter[] = [];

  taxonomy.forEach(node => {
    const matchingCollections = collections.filter(collection => 
      isCollectionMatchingFilter(collection, node.code, taxonomy)
    );

    if (matchingCollections.length > 0) {
      options.push({
        id: node.id,
        code: node.code,
        label: node.label[language] || node.label.fr,
        category,
        count: matchingCollections.length,
        level: node.parent ? 1 : 0,
        parent: node.parent
      });
    }
  });

  return options.sort((a, b) => {
    // Tri par niveau hiérarchique puis par nombre de collections
    if (a.level !== b.level) return a.level - b.level;
    return b.count - a.count;
  });
}

function isCollectionMatchingFilter(
  collection: CollectionWithTranslations,
  taxonomyCode: string,
  taxonomy: any[]
): boolean {
  const node = taxonomy.find(n => n.code === taxonomyCode);
  if (!node) return false;

  const slug = collection.slug?.toLowerCase() || '';
  const title = collection.collection_translations?.[0]?.title?.toLowerCase() || '';
  const searchText = `${slug} ${title}`;

  // Vérifier les mots-clés
  const keywordMatch = node.keywords.some((keyword: string) => 
    searchText.includes(keyword.toLowerCase())
  );

  // Vérifier les labels
  const labelMatch = Object.values(node.label).some((label: any) => 
    searchText.includes(label.toLowerCase())
  );

  return keywordMatch || labelMatch;
}

function calculateCollectionConformityScore(collection: CollectionWithTranslations): number {
  let score = 0;
  let maxScore = 1;

  // Vérifier le slug standardisé (30%)
  if (collection.slug && isSlugStandardized(collection.slug)) {
    score += 0.3;
  }

  // Vérifier les traductions complètes (25%)
  if (collection.collection_translations && collection.collection_translations.length >= 2) {
    const hasCompleteTranslations = collection.collection_translations.every(t => 
      t.title && t.title.trim().length > 0
    );
    if (hasCompleteTranslations) {
      score += 0.25;
    }
  }

  // Vérifier les descriptions (25%)
  if (collection.collection_translations) {
    const hasDescriptions = collection.collection_translations.some(t => 
      t.description && t.description.trim().length > 0
    );
    if (hasDescriptions) {
      score += 0.25;
    }
  }

  // Vérifier la cohérence taxonomique (20%)
  if (isCollectionTaxonomicallyCoherent(collection)) {
    score += 0.2;
  }

  return score / maxScore;
}

function isSlugStandardized(slug: string): boolean {
  // Un slug standardisé suit le pattern: [geographic]-[temporal]-[thematic]
  const parts = slug.split('-');
  return parts.length >= 2 && parts.every(part => 
    part.length > 2 && /^[a-z]+$/.test(part)
  );
}

function isCollectionTaxonomicallyCoherent(collection: CollectionWithTranslations): boolean {
  const slug = collection.slug?.toLowerCase() || '';
  
  // Vérifier si la collection correspond à au moins une catégorie taxonomique
  const hasGeographicMatch = GEOGRAPHIC_CULTURAL_TAXONOMY.some(node => 
    node.keywords.some(k => slug.includes(k.toLowerCase()))
  );
  
  const hasTemporalMatch = TEMPORAL_TAXONOMY.some(node => 
    node.keywords.some(k => slug.includes(k.toLowerCase()))
  );
  
  const hasThematicMatch = THEMATIC_TAXONOMY.some(node => 
    node.keywords.some(k => slug.includes(k.toLowerCase()))
  );

  return hasGeographicMatch || hasTemporalMatch || hasThematicMatch;
}