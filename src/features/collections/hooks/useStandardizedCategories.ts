/**
 * Hook pour la gestion des catégories standardisées selon les normes mondiales
 */

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CollectionWithTranslations } from '../types/collections';
import { 
  GEOGRAPHIC_CULTURAL_TAXONOMY,
  TEMPORAL_TAXONOMY,
  THEMATIC_TAXONOMY,
  findTaxonomyNode
} from '../taxonomy/WorldTaxonomy';

export type StandardizedCategory = 
  | 'geographic-cultural'
  | 'temporal' 
  | 'thematic'
  | 'all';

export interface StandardizedCategoryGroup {
  id: string;
  code: string;
  label: string;
  description?: string;
  collections: CollectionWithTranslations[];
  count: number;
  conformityScore?: number;
}

export const useStandardizedCategories = (collections: CollectionWithTranslations[] | undefined) => {
  const { i18n } = useTranslation();

  const categorizedCollections = useMemo(() => {
    if (!collections || collections.length === 0) {
      return {
        geographic: [],
        temporal: [],
        thematic: [],
        uncategorized: []
      };
    }

    const geographic: StandardizedCategoryGroup[] = [];
    const temporal: StandardizedCategoryGroup[] = [];
    const thematic: StandardizedCategoryGroup[] = [];
    const uncategorized: CollectionWithTranslations[] = [];

    // Créer des groupes pour chaque catégorie taxonomique
    GEOGRAPHIC_CULTURAL_TAXONOMY.forEach(node => {
      const matchingCollections = collections.filter(collection => 
        isCollectionMatchingTaxonomy(collection, node, 'geographic')
      );

      if (matchingCollections.length > 0) {
        geographic.push({
          id: node.id,
          code: node.code,
          label: node.label[i18n.language] || node.label.fr,
          description: node.description?.[i18n.language] || node.description?.fr,
          collections: matchingCollections,
          count: matchingCollections.length,
          conformityScore: calculateCategoryConformity(matchingCollections, node)
        });
      }
    });

    TEMPORAL_TAXONOMY.forEach(node => {
      const matchingCollections = collections.filter(collection => 
        isCollectionMatchingTaxonomy(collection, node, 'temporal')
      );

      if (matchingCollections.length > 0) {
        temporal.push({
          id: node.id,
          code: node.code,
          label: node.label[i18n.language] || node.label.fr,
          description: node.description?.[i18n.language] || node.description?.fr,
          collections: matchingCollections,
          count: matchingCollections.length,
          conformityScore: calculateCategoryConformity(matchingCollections, node)
        });
      }
    });

    THEMATIC_TAXONOMY.forEach(node => {
      const matchingCollections = collections.filter(collection => 
        isCollectionMatchingTaxonomy(collection, node, 'thematic')
      );

      if (matchingCollections.length > 0) {
        thematic.push({
          id: node.id,
          code: node.code,
          label: node.label[i18n.language] || node.label.fr,
          description: node.description?.[i18n.language] || node.description?.fr,
          collections: matchingCollections,
          count: matchingCollections.length,
          conformityScore: calculateCategoryConformity(matchingCollections, node)
        });
      }
    });

    // Collections non catégorisées
    const categorizedIds = new Set([
      ...geographic.flatMap(g => g.collections.map(c => c.id)),
      ...temporal.flatMap(g => g.collections.map(c => c.id)),
      ...thematic.flatMap(g => g.collections.map(c => c.id))
    ]);

    collections.forEach(collection => {
      if (!categorizedIds.has(collection.id)) {
        uncategorized.push(collection);
      }
    });

    return {
      geographic: geographic.sort((a, b) => b.count - a.count),
      temporal: temporal.sort((a, b) => (a.code.localeCompare(b.code))), // Tri chronologique
      thematic: thematic.sort((a, b) => b.count - a.count),
      uncategorized
    };

  }, [collections, i18n.language]);

  const getCollectionsByCategory = (categoryType: StandardizedCategory, categoryId?: string) => {
    switch (categoryType) {
      case 'geographic-cultural':
        return categoryId 
          ? categorizedCollections.geographic.find(g => g.id === categoryId)?.collections || []
          : categorizedCollections.geographic.flatMap(g => g.collections);
      
      case 'temporal':
        return categoryId 
          ? categorizedCollections.temporal.find(g => g.id === categoryId)?.collections || []
          : categorizedCollections.temporal.flatMap(g => g.collections);
      
      case 'thematic':
        return categoryId 
          ? categorizedCollections.thematic.find(g => g.id === categoryId)?.collections || []
          : categorizedCollections.thematic.flatMap(g => g.collections);
      
      case 'all':
      default:
        return collections || [];
    }
  };

  const getConformityStats = () => {
    const totalCollections = collections?.length || 0;
    const categorized = totalCollections - categorizedCollections.uncategorized.length;
    const conformityRate = totalCollections > 0 ? (categorized / totalCollections) * 100 : 0;

    const averageConformityScore = [
      ...categorizedCollections.geographic,
      ...categorizedCollections.temporal,
      ...categorizedCollections.thematic
    ].reduce((sum, group, index, array) => {
      return sum + (group.conformityScore || 0) / array.length;
    }, 0);

    return {
      totalCollections,
      categorized,
      uncategorized: categorizedCollections.uncategorized.length,
      conformityRate,
      averageConformityScore: isNaN(averageConformityScore) ? 0 : averageConformityScore
    };
  };

  return {
    categorizedCollections,
    getCollectionsByCategory,
    getConformityStats,
    hasStandardizedCategories: collections && collections.length > 0
  };
};

// ========================
// FONCTIONS UTILITAIRES
// ========================

function isCollectionMatchingTaxonomy(
  collection: CollectionWithTranslations, 
  taxonomyNode: any, 
  categoryType: 'geographic' | 'temporal' | 'thematic'
): boolean {
  const slug = collection.slug?.toLowerCase() || '';
  const title = collection.collection_translations?.[0]?.title?.toLowerCase() || '';
  const searchText = `${slug} ${title}`;

  // Recherche par mots-clés
  const keywordMatch = taxonomyNode.keywords.some((keyword: string) => 
    searchText.includes(keyword.toLowerCase())
  );

  if (keywordMatch) return true;

  // Recherche par labels
  const labelMatch = Object.values(taxonomyNode.label).some((label: any) => 
    searchText.includes(label.toLowerCase())
  );

  return labelMatch;
}

function calculateCategoryConformity(
  collections: CollectionWithTranslations[], 
  taxonomyNode: any
): number {
  if (collections.length === 0) return 0;

  // Score basé sur la cohérence du naming et la complétude des métadonnées
  let totalScore = 0;

  collections.forEach(collection => {
    let collectionScore = 0;

    // Slug standardisé (25%)
    if (collection.slug && isStandardizedSlug(collection.slug, taxonomyNode)) {
      collectionScore += 0.25;
    }

    // Traductions complètes (25%)
    if (collection.collection_translations && collection.collection_translations.length >= 2) {
      collectionScore += 0.25;
    }

    // Métadonnées riches (25%)
    const hasDescription = collection.collection_translations?.some(t => t.description);
    if (hasDescription) {
      collectionScore += 0.25;
    }

    // Cohérence thématique (25%)
    if (isThematicallyCoherent(collection, taxonomyNode)) {
      collectionScore += 0.25;
    }

    totalScore += collectionScore;
  });

  return totalScore / collections.length;
}

function isStandardizedSlug(slug: string, taxonomyNode: any): boolean {
  const slugParts = slug.split('-');
  return slugParts.some(part => 
    taxonomyNode.keywords.includes(part) ||
    Object.values(taxonomyNode.label).some((label: any) => 
      label.toLowerCase().includes(part)
    )
  );
}

function isThematicallyCoherent(collection: CollectionWithTranslations, taxonomyNode: any): boolean {
  // Vérification de base - peut être étendue avec des règles plus sophistiquées
  const slug = collection.slug?.toLowerCase() || '';
  const hasConsistentNaming = taxonomyNode.keywords.some((keyword: string) => 
    slug.includes(keyword.toLowerCase())
  );
  
  return hasConsistentNaming;
}