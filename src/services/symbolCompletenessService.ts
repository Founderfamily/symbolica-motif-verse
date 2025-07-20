
import { SymbolData } from '@/types/supabase';
import { TrendingSymbol } from './trendingService';

export type CompletenessLevel = 'complete' | 'well_documented' | 'partially_documented' | 'to_complete';

export interface SymbolCompleteness {
  level: CompletenessLevel;
  score: number;
  missingFields: string[];
  hasImage: boolean;
  hasDescription: boolean;
  hasSignificance: boolean;
  hasHistoricalContext: boolean;
  hasTags: boolean;
  completionPercentage: number;
}

export interface SymbolWithCompleteness extends TrendingSymbol {
  completeness: SymbolCompleteness;
  displayPriority: number;
}

export class SymbolCompletenessService {
  // Scoring constants
  private static readonly BONUS_IMAGE = 10;
  private static readonly BONUS_DESCRIPTION = 5;
  private static readonly BONUS_SIGNIFICANCE = 4;
  private static readonly BONUS_HISTORICAL_CONTEXT = 4;
  private static readonly BONUS_TAGS = 3;

  private static readonly MALUS_NO_IMAGE = -5;
  private static readonly MALUS_NO_DESCRIPTION = -8;
  private static readonly MALUS_NO_SIGNIFICANCE = -6;
  private static readonly MALUS_NO_HISTORICAL_CONTEXT = -6;
  private static readonly MALUS_NO_TAGS = -4;

  /**
   * Évalue la complétude d'un symbole
   */
  static evaluateCompleteness(symbol: TrendingSymbol | SymbolData): SymbolCompleteness {
    const hasImage = this.hasImage(symbol);
    const hasDescription = this.hasDescription(symbol);
    const hasSignificance = this.hasSignificance(symbol);
    const hasHistoricalContext = this.hasHistoricalContext(symbol);
    const hasTags = this.hasTags(symbol);

    const missingFields = [];
    let score = 50; // Score de base

    // Calcul des bonus/malus
    if (hasImage) {
      score += this.BONUS_IMAGE;
    } else {
      score += this.MALUS_NO_IMAGE;
      missingFields.push('image');
    }

    if (hasDescription) {
      score += this.BONUS_DESCRIPTION;
    } else {
      score += this.MALUS_NO_DESCRIPTION;
      missingFields.push('description');
    }

    if (hasSignificance) {
      score += this.BONUS_SIGNIFICANCE;
    } else {
      score += this.MALUS_NO_SIGNIFICANCE;
      missingFields.push('significance');
    }

    if (hasHistoricalContext) {
      score += this.BONUS_HISTORICAL_CONTEXT;
    } else {
      score += this.MALUS_NO_HISTORICAL_CONTEXT;
      missingFields.push('historical_context');
    }

    if (hasTags) {
      score += this.BONUS_TAGS;
    } else {
      score += this.MALUS_NO_TAGS;
      missingFields.push('tags');
    }

    // S'assurer que le score ne soit pas négatif
    score = Math.max(0, score);

    // Calcul du pourcentage de complétion
    const totalFields = 5;
    const completedFields = totalFields - missingFields.length;
    const completionPercentage = (completedFields / totalFields) * 100;

    // Détermination du niveau de complétude
    const level = this.determineCompletenessLevel(missingFields.length, hasImage, hasDescription);

    return {
      level,
      score,
      missingFields,
      hasImage,
      hasDescription,
      hasSignificance,
      hasHistoricalContext,
      hasTags,
      completionPercentage
    };
  }

  /**
   * Détermine le niveau de complétude
   */
  private static determineCompletenessLevel(
    missingFieldsCount: number, 
    hasImage: boolean, 
    hasDescription: boolean
  ): CompletenessLevel {
    if (missingFieldsCount === 0) {
      return 'complete';
    }
    
    if (missingFieldsCount === 1 && hasImage && hasDescription) {
      return 'well_documented';
    }
    
    if (missingFieldsCount <= 2 && hasDescription) {
      return 'partially_documented';
    }
    
    return 'to_complete';
  }

  /**
   * Vérifie si un symbole a une image
   */
  private static hasImage(symbol: TrendingSymbol | SymbolData): boolean {
    if ('images' in symbol && symbol.images) {
      return Array.isArray(symbol.images) ? symbol.images.length > 0 : false;
    }
    
    if ('src' in symbol && symbol.src && typeof symbol.src === 'string') {
      return !symbol.src.includes('placeholder.svg');
    }
    
    return false;
  }

  /**
   * Vérifie si un symbole a une description
   */
  private static hasDescription(symbol: TrendingSymbol | SymbolData): boolean {
    return !!(symbol.description && symbol.description.trim().length > 0);
  }

  /**
   * Vérifie si un symbole a une signification
   */
  private static hasSignificance(symbol: TrendingSymbol | SymbolData): boolean {
    if ('significance' in symbol) {
      return !!(symbol.significance && symbol.significance.trim().length > 0);
    }
    return false;
  }

  /**
   * Vérifie si un symbole a un contexte historique
   */
  private static hasHistoricalContext(symbol: TrendingSymbol | SymbolData): boolean {
    if ('historical_context' in symbol) {
      return !!(symbol.historical_context && symbol.historical_context.trim().length > 0);
    }
    return false;
  }

  /**
   * Vérifie si un symbole a des tags
   */
  private static hasTags(symbol: TrendingSymbol | SymbolData): boolean {
    if ('tags' in symbol && symbol.tags) {
      return Array.isArray(symbol.tags) ? symbol.tags.length > 0 : false;
    }
    return false;
  }

  /**
   * Enrichit une liste de symboles avec les données de complétude
   */
  static enrichWithCompleteness(symbols: TrendingSymbol[]): SymbolWithCompleteness[] {
    return symbols.map(symbol => {
      const completeness = this.evaluateCompleteness(symbol);
      const displayPriority = this.calculateDisplayPriority(symbol, completeness);

      return {
        ...symbol,
        completeness,
        displayPriority
      };
    });
  }

  /**
   * Calcule la priorité d'affichage
   */
  private static calculateDisplayPriority(symbol: TrendingSymbol, completeness: SymbolCompleteness): number {
    let priority = completeness.score;
    
    // Bonus pour les symboles complets avec images
    if (completeness.level === 'complete') {
      priority += 1000;
    } else if (completeness.level === 'well_documented') {
      priority += 800;
    } else if (completeness.level === 'partially_documented') {
      priority += 500;
    }
    
    // Petit bonus pour le score de tendance original
    priority += symbol.trending_score * 0.1;
    
    return Math.round(priority);
  }

  /**
   * Trie les symboles par priorité d'affichage
   */
  static sortByCompleteness(symbols: SymbolWithCompleteness[]): SymbolWithCompleteness[] {
    return symbols.sort((a, b) => {
      if (b.displayPriority !== a.displayPriority) {
        return b.displayPriority - a.displayPriority;
      }
      
      // En cas d'égalité, trier par niveau de complétude
      const levelOrder = { complete: 4, well_documented: 3, partially_documented: 2, to_complete: 1 };
      if (levelOrder[a.completeness.level] !== levelOrder[b.completeness.level]) {
        return levelOrder[b.completeness.level] - levelOrder[a.completeness.level];
      }
      
      // Enfin, trier par score de tendance original
      return b.trending_score - a.trending_score;
    });
  }

  /**
   * Obtient les statistiques de complétude
   */
  static getCompletenessStats(symbols: SymbolWithCompleteness[]): {
    total: number;
    complete: number;
    wellDocumented: number;
    partiallyDocumented: number;
    toComplete: number;
    averageScore: number;
    averageCompletion: number;
  } {
    const total = symbols.length;
    const complete = symbols.filter(s => s.completeness.level === 'complete').length;
    const wellDocumented = symbols.filter(s => s.completeness.level === 'well_documented').length;
    const partiallyDocumented = symbols.filter(s => s.completeness.level === 'partially_documented').length;
    const toComplete = symbols.filter(s => s.completeness.level === 'to_complete').length;
    
    const averageScore = total > 0 ? symbols.reduce((sum, s) => sum + s.completeness.score, 0) / total : 0;
    const averageCompletion = total > 0 ? symbols.reduce((sum, s) => sum + s.completeness.completionPercentage, 0) / total : 0;

    return {
      total,
      complete,
      wellDocumented,
      partiallyDocumented,
      toComplete,
      averageScore: Math.round(averageScore),
      averageCompletion: Math.round(averageCompletion)
    };
  }

  /**
   * Filtre les symboles par niveau de complétude
   */
  static filterByCompletenessLevel(
    symbols: SymbolWithCompleteness[], 
    level: CompletenessLevel | 'all'
  ): SymbolWithCompleteness[] {
    if (level === 'all') return symbols;
    return symbols.filter(s => s.completeness.level === level);
  }
}
