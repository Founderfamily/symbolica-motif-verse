
import { TrendingSymbol } from '@/services/trendingService';
import { SymbolData } from '@/types/supabase';

export interface SymbolWithVisibility extends TrendingSymbol {
  hasPhoto: boolean;
  visibilityScore: number;
  displayPriority: number;
}

export class SymbolVisibilityService {
  private static readonly PHOTO_BONUS = 10;
  private static readonly NO_PHOTO_MALUS = 5;

  /**
   * Calcule le score de visibilité d'un symbole
   */
  static calculateVisibilityScore(baseScore: number, hasPhoto: boolean): number {
    if (hasPhoto) {
      return baseScore + this.PHOTO_BONUS;
    }
    return Math.max(0, baseScore - this.NO_PHOTO_MALUS);
  }

  /**
   * Détermine la priorité d'affichage
   */
  static getDisplayPriority(symbol: TrendingSymbol, hasPhoto: boolean): number {
    const baseScore = symbol.trending_score;
    const visibilityScore = this.calculateVisibilityScore(baseScore, hasPhoto);
    
    // Les symboles avec photos ont une priorité légèrement supérieure
    const photoBonus = hasPhoto ? 1000 : 0;
    
    return visibilityScore + photoBonus;
  }

  /**
   * Vérifie si un symbole a une photo
   */
  static hasPhoto(symbol: TrendingSymbol | SymbolData): boolean {
    // Pour les symboles de la base de données, vérifier s'il y a des images
    if ('images' in symbol && symbol.images) {
      return Array.isArray(symbol.images) ? symbol.images.length > 0 : false;
    }
    
    // Pour les symboles statiques, vérifier la présence d'une source d'image valide
    if ('src' in symbol && symbol.src && typeof symbol.src === 'string') {
      return !symbol.src.includes('placeholder.svg');
    }
    
    // Par défaut, considérer qu'il n'y a pas de photo
    return false;
  }

  /**
   * Enrichit une liste de symboles avec les données de visibilité
   */
  static enrichWithVisibility(symbols: TrendingSymbol[]): SymbolWithVisibility[] {
    return symbols.map(symbol => {
      const hasPhoto = this.hasPhoto(symbol);
      const visibilityScore = this.calculateVisibilityScore(symbol.trending_score, hasPhoto);
      const displayPriority = this.getDisplayPriority(symbol, hasPhoto);

      return {
        ...symbol,
        hasPhoto,
        visibilityScore,
        displayPriority
      };
    });
  }

  /**
   * Trie les symboles par priorité d'affichage
   */
  static sortByVisibility(symbols: SymbolWithVisibility[]): SymbolWithVisibility[] {
    return symbols.sort((a, b) => {
      // Tri par priorité d'affichage (décroissant)
      if (b.displayPriority !== a.displayPriority) {
        return b.displayPriority - a.displayPriority;
      }
      
      // En cas d'égalité, prioriser les photos
      if (a.hasPhoto !== b.hasPhoto) {
        return a.hasPhoto ? -1 : 1;
      }
      
      // Enfin, trier par score de tendance
      return b.trending_score - a.trending_score;
    });
  }

  /**
   * Obtient les statistiques des photos
   */
  static getPhotoStats(symbols: TrendingSymbol[]): {
    total: number;
    withPhoto: number;
    withoutPhoto: number;
    percentageWithPhoto: number;
  } {
    const total = symbols.length;
    const withPhoto = symbols.filter(s => this.hasPhoto(s)).length;
    const withoutPhoto = total - withPhoto;
    const percentageWithPhoto = total > 0 ? (withPhoto / total) * 100 : 0;

    return {
      total,
      withPhoto,
      withoutPhoto,
      percentageWithPhoto
    };
  }
}
