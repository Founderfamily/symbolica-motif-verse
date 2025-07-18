/**
 * Service de gestion de la taxonomie standardisée mondiale
 * Conforme aux standards UNESCO, CIDOC-CRM et Dublin Core
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  getFullTaxonomy, 
  findTaxonomyNode, 
  normalizeCulturalTerm, 
  normalizeTemporalTerm, 
  normalizeThematicTerm,
  TaxonomyNode,
  GEOGRAPHIC_CULTURAL_TAXONOMY,
  TEMPORAL_TAXONOMY,
  THEMATIC_TAXONOMY
} from '../taxonomy/WorldTaxonomy';
import { logger } from '@/services/logService';

export interface SymbolTaxonomyMapping {
  symbolId: string;
  culture?: { code: string; label: string; confidence: number };
  period?: { code: string; label: string; confidence: number };
  themes?: Array<{ code: string; label: string; confidence: number }>;
  normalizedTerms: {
    originalCulture?: string;
    originalPeriod?: string;
    suggestedCollections?: string[];
  };
}

export interface CollectionTaxonomyMapping {
  collectionId: string;
  slug: string;
  standardizedCategories: {
    geographic?: string;
    temporal?: string;
    thematic?: string[];
  };
  conformityScore: number; // 0-1 score de conformité aux standards
  recommendations?: string[];
}

/**
 * Service principal de taxonomie
 */
export class TaxonomyService {
  
  /**
   * Analyse et normalise les métadonnées d'un symbole selon les standards mondiaux
   */
  async analyzeSymbolTaxonomy(symbolId: string, culture?: string, period?: string): Promise<SymbolTaxonomyMapping> {
    try {
      logger.info('Analyzing symbol taxonomy', { symbolId, culture, period });
      
      const mapping: SymbolTaxonomyMapping = {
        symbolId,
        normalizedTerms: {
          originalCulture: culture,
          originalPeriod: period
        }
      };

      // Normalisation culturelle
      if (culture) {
        const normalized = normalizeCulturalTerm(culture);
        if (normalized) {
          mapping.culture = {
            ...normalized,
            confidence: this.calculateNormalizationConfidence(culture, normalized.label)
          };
        }
      }

      // Normalisation temporelle
      if (period) {
        const normalized = normalizeTemporalTerm(period);
        if (normalized) {
          mapping.period = {
            ...normalized,
            confidence: this.calculateNormalizationConfidence(period, normalized.label)
          };
        }
      }

      // Suggestions de collections basées sur la taxonomie
      mapping.normalizedTerms.suggestedCollections = await this.suggestCollections(mapping);

      return mapping;
    } catch (error) {
      logger.error('Error analyzing symbol taxonomy', { error, symbolId });
      throw error;
    }
  }

  /**
   * Évalue la conformité d'une collection aux standards mondiaux
   */
  async evaluateCollectionConformity(collectionId: string): Promise<CollectionTaxonomyMapping> {
    try {
      // Récupérer les données de la collection
      const { data: collection, error } = await supabase
        .from('collections')
        .select(`
          id, slug,
          collection_translations (language, title, description),
          collection_symbols (
            symbol_id,
            symbols (culture, period, name)
          )
        `)
        .eq('id', collectionId)
        .single();

      if (error) throw error;

      const mapping: CollectionTaxonomyMapping = {
        collectionId,
        slug: collection.slug,
        standardizedCategories: {},
        conformityScore: 0,
        recommendations: []
      };

      // Analyse du slug et du titre pour catégorisation
      const title = collection.collection_translations?.[0]?.title || '';
      const analysisText = `${collection.slug} ${title}`.toLowerCase();

      // Catégorisation géographique/culturelle
      const geographicMatch = this.findBestMatch(analysisText, GEOGRAPHIC_CULTURAL_TAXONOMY);
      if (geographicMatch) {
        mapping.standardizedCategories.geographic = geographicMatch.code;
      }

      // Catégorisation temporelle
      const temporalMatch = this.findBestMatch(analysisText, TEMPORAL_TAXONOMY);
      if (temporalMatch) {
        mapping.standardizedCategories.temporal = temporalMatch.code;
      }

      // Catégorisation thématique
      const thematicMatches = this.findAllMatches(analysisText, THEMATIC_TAXONOMY);
      if (thematicMatches.length > 0) {
        mapping.standardizedCategories.thematic = thematicMatches.map(m => m.code);
      }

      // Calcul du score de conformité
      mapping.conformityScore = this.calculateConformityScore(mapping, collection);

      // Génération de recommandations
      mapping.recommendations = this.generateRecommendations(mapping, collection);

      return mapping;
    } catch (error) {
      logger.error('Error evaluating collection conformity', { error, collectionId });
      throw error;
    }
  }

  /**
   * Génère un rapport de conformité global pour toutes les collections
   */
  async generateGlobalConformityReport(): Promise<{
    totalCollections: number;
    conformityDistribution: Record<string, number>;
    topRecommendations: string[];
    taxonomyGaps: string[];
  }> {
    try {
      const { data: collections, error } = await supabase
        .from('collections')
        .select('id, slug');

      if (error) throw error;

      const evaluations = await Promise.all(
        collections.map(c => this.evaluateCollectionConformity(c.id))
      );

      // Distribution des scores de conformité
      const conformityDistribution = {
        'excellent': 0, // 0.8-1.0
        'good': 0,      // 0.6-0.8
        'fair': 0,      // 0.4-0.6
        'poor': 0       // 0.0-0.4
      };

      evaluations.forEach(evaluation => {
        const score = evaluation.conformityScore;
        if (score >= 0.8) conformityDistribution.excellent++;
        else if (score >= 0.6) conformityDistribution.good++;
        else if (score >= 0.4) conformityDistribution.fair++;
        else conformityDistribution.poor++;
      });

      // Top recommandations
      const allRecommendations = evaluations.flatMap(e => e.recommendations || []);
      const recommendationCounts = this.countFrequency(allRecommendations);
      const topRecommendations = Object.entries(recommendationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([rec]) => rec);

      // Lacunes taxonomiques
      const taxonomyGaps = this.identifyTaxonomyGaps(evaluations);

      return {
        totalCollections: collections.length,
        conformityDistribution,
        topRecommendations,
        taxonomyGaps
      };
    } catch (error) {
      logger.error('Error generating global conformity report', { error });
      throw error;
    }
  }

  /**
   * Migre une collection vers la taxonomie standardisée
   */
  async migrateCollectionToStandardTaxonomy(
    collectionId: string, 
    mapping: CollectionTaxonomyMapping
  ): Promise<boolean> {
    try {
      // Générer un nouveau slug standardisé
      const standardizedSlug = this.generateStandardizedSlug(mapping);
      
      // Mettre à jour la collection
      const { error } = await supabase
        .from('collections')
        .update({
          slug: standardizedSlug,
          updated_at: new Date().toISOString()
        })
        .eq('id', collectionId);

      if (error) throw error;

      logger.info('Collection migrated to standard taxonomy', { 
        collectionId, 
        oldSlug: mapping.slug,
        newSlug: standardizedSlug 
      });

      return true;
    } catch (error) {
      logger.error('Error migrating collection', { error, collectionId });
      return false;
    }
  }

  // ========================
  // MÉTHODES PRIVÉES
  // ========================

  private findBestMatch(text: string, taxonomy: TaxonomyNode[]): TaxonomyNode | null {
    let bestMatch: TaxonomyNode | null = null;
    let bestScore = 0;

    for (const node of taxonomy) {
      const score = this.calculateMatchScore(text, node);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = node;
      }
    }

    return bestScore > 0.3 ? bestMatch : null; // Seuil de confiance
  }

  private findAllMatches(text: string, taxonomy: TaxonomyNode[]): TaxonomyNode[] {
    return taxonomy.filter(node => this.calculateMatchScore(text, node) > 0.3);
  }

  private calculateMatchScore(text: string, node: TaxonomyNode): number {
    let score = 0;
    const textLower = text.toLowerCase();

    // Score basé sur les mots-clés
    for (const keyword of node.keywords) {
      if (textLower.includes(keyword.toLowerCase())) {
        score += 1;
      }
    }

    // Score basé sur les labels
    for (const label of Object.values(node.label)) {
      if (textLower.includes(label.toLowerCase())) {
        score += 2; // Labels valent plus que les mots-clés
      }
    }

    return Math.min(score / (node.keywords.length + Object.keys(node.label).length), 1);
  }

  private calculateNormalizationConfidence(original: string, normalized: string): number {
    const similarity = this.calculateStringSimilarity(original.toLowerCase(), normalized.toLowerCase());
    return Math.max(0.5, similarity); // Confiance minimum de 50%
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private calculateConformityScore(mapping: CollectionTaxonomyMapping, collection: any): number {
    let score = 0;
    let maxScore = 0;

    // Score pour catégorisation géographique (30%)
    maxScore += 0.3;
    if (mapping.standardizedCategories.geographic) {
      score += 0.3;
    }

    // Score pour catégorisation temporelle (30%)
    maxScore += 0.3;
    if (mapping.standardizedCategories.temporal) {
      score += 0.3;
    }

    // Score pour catégorisation thématique (25%)
    maxScore += 0.25;
    if (mapping.standardizedCategories.thematic && mapping.standardizedCategories.thematic.length > 0) {
      score += 0.25;
    }

    // Score pour cohérence des symboles (15%)
    maxScore += 0.15;
    if (collection.collection_symbols && collection.collection_symbols.length > 0) {
      const coherentSymbols = collection.collection_symbols.filter((cs: any) => 
        this.isSymbolCoherent(cs.symbols, mapping)
      );
      score += 0.15 * (coherentSymbols.length / collection.collection_symbols.length);
    }

    return score / maxScore;
  }

  private isSymbolCoherent(symbol: any, mapping: CollectionTaxonomyMapping): boolean {
    if (!symbol) return false;

    // Vérifier la cohérence culturelle
    if (mapping.standardizedCategories.geographic && symbol.culture) {
      const culturalNode = findTaxonomyNode(symbol.culture, GEOGRAPHIC_CULTURAL_TAXONOMY);
      if (culturalNode?.code !== mapping.standardizedCategories.geographic) {
        return false;
      }
    }

    // Vérifier la cohérence temporelle
    if (mapping.standardizedCategories.temporal && symbol.period) {
      const temporalNode = findTaxonomyNode(symbol.period, TEMPORAL_TAXONOMY);
      if (temporalNode?.code !== mapping.standardizedCategories.temporal) {
        return false;
      }
    }

    return true;
  }

  private generateRecommendations(mapping: CollectionTaxonomyMapping, collection: any): string[] {
    const recommendations: string[] = [];

    if (!mapping.standardizedCategories.geographic) {
      recommendations.push('Ajouter une catégorisation géographique/culturelle claire');
    }

    if (!mapping.standardizedCategories.temporal) {
      recommendations.push('Préciser la période historique selon les standards UNESCO');
    }

    if (!mapping.standardizedCategories.thematic || mapping.standardizedCategories.thematic.length === 0) {
      recommendations.push('Définir des catégories thématiques selon Dublin Core');
    }

    if (mapping.conformityScore < 0.6) {
      recommendations.push('Réviser le titre et la description selon les standards CIDOC-CRM');
      recommendations.push('Vérifier la cohérence des symboles avec les catégories définies');
    }

    return recommendations;
  }

  private generateStandardizedSlug(mapping: CollectionTaxonomyMapping): string {
    const parts: string[] = [];

    if (mapping.standardizedCategories.geographic) {
      parts.push(mapping.standardizedCategories.geographic.toLowerCase());
    }

    if (mapping.standardizedCategories.temporal) {
      parts.push(mapping.standardizedCategories.temporal.toLowerCase());
    }

    if (mapping.standardizedCategories.thematic && mapping.standardizedCategories.thematic.length > 0) {
      parts.push(mapping.standardizedCategories.thematic[0].toLowerCase());
    }

    return parts.join('-') || mapping.slug;
  }

  private async suggestCollections(mapping: SymbolTaxonomyMapping): Promise<string[]> {
    const suggestions: string[] = [];

    if (mapping.culture) {
      suggestions.push(`Collection ${mapping.culture.label}`);
    }

    if (mapping.period) {
      suggestions.push(`Collection ${mapping.period.label}`);
    }

    return suggestions;
  }

  private countFrequency(items: string[]): Record<string, number> {
    return items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private identifyTaxonomyGaps(evaluations: CollectionTaxonomyMapping[]): string[] {
    const gaps: string[] = [];
    const allTaxonomy = getFullTaxonomy();
    
    // Identifier les nœuds taxonomiques non utilisés
    const usedCodes = new Set([
      ...evaluations.map(e => e.standardizedCategories.geographic).filter(Boolean),
      ...evaluations.map(e => e.standardizedCategories.temporal).filter(Boolean),
      ...evaluations.flatMap(e => e.standardizedCategories.thematic || [])
    ]);

    for (const node of allTaxonomy) {
      if (!usedCodes.has(node.code)) {
        gaps.push(`Catégorie non représentée: ${node.label.fr} (${node.code})`);
      }
    }

    return gaps.slice(0, 10); // Limiter à 10 principales lacunes
  }
}

export const taxonomyService = new TaxonomyService();