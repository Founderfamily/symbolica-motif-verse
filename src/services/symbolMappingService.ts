
import { STATIC_SYMBOLS } from '@/data/staticSymbols';

/**
 * Service pour mapper les symboles statiques vers leurs équivalents en base de données
 */
class SymbolMappingService {
  // Mapping manuel entre symboles statiques et IDs de la base de données
  private staticToDbMapping: Record<string, string> = {
    // ID exact du symbole statique vers ID de la base de données
    'triskele-1': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Triskèle Celtique
    'fleur-lys-2': '9b8f7a6e-5d4c-3b2a-1f9e-8c7d6b5a4321', // Fleur de Lys (exemple)
    'mandala-3': '2a1b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p', // Mandala (exemple)
    'meandre-4': '3b2c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', // Méandre Grec (exemple)
    'adinkra-5': '4c3d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r', // Symbole Adinkra (exemple)
    'seigaiha-6': '5d4e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', // Motif Seigaiha (exemple)
    'yin-yang-7': '6e5f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', // Yin Yang (exemple)
    'ankh-8': '7f6g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u', // Ankh (exemple)
    'hamsa-9': '8g7h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v', // Hamsa (exemple)
    'dreamcatcher-10': '9h8i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w', // Attrape-rêves (exemple)
    
    // Variantes possibles pour le Triskèle
    '0': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Si l'ID numérique est 0
    'triskele': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Sans suffixe
    'triskelion': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Nom alternatif
  };

  /**
   * Vérifie si un ID correspond à un symbole statique
   */
  isStaticSymbol(symbolId: string | number): boolean {
    const idStr = symbolId.toString();
    
    console.log('isStaticSymbol - checking:', idStr);
    
    // 1. Vérifier si l'ID est dans les symboles statiques
    const isInStaticSymbols = STATIC_SYMBOLS.some(symbol => symbol.id === idStr);
    console.log('isInStaticSymbols:', isInStaticSymbols);
    
    // 2. Vérifier si l'ID commence par une lettre (heuristique)
    const startsWithLetter = /^[a-zA-Z]/.test(idStr);
    console.log('startsWithLetter:', startsWithLetter);
    
    // 3. Vérifier si l'ID est un petit nombre (probablement un index de symbole statique)
    const isSmallNumber = /^\d+$/.test(idStr) && parseInt(idStr, 10) < 20;
    console.log('isSmallNumber:', isSmallNumber);
    
    // 4. Vérifier si on a un mapping explicite
    const hasMapping = this.staticToDbMapping[idStr] !== undefined;
    console.log('hasMapping:', hasMapping);
    
    const result = isInStaticSymbols || startsWithLetter || isSmallNumber || hasMapping;
    console.log('isStaticSymbol result:', result);
    
    return result;
  }

  /**
   * Obtient l'ID de la base de données correspondant à un symbole statique
   */
  getDbIdForStaticSymbol(staticId: string): string | null {
    console.log('getDbIdForStaticSymbol - searching for:', staticId);
    console.log('Available mappings:', Object.keys(this.staticToDbMapping));
    
    const result = this.staticToDbMapping[staticId] || null;
    console.log('getDbIdForStaticSymbol result:', result);
    
    return result;
  }

  /**
   * Obtient l'ID à utiliser pour les requêtes de collections
   * - Si c'est un symbole statique, retourne l'ID DB mappé
   * - Sinon, retourne l'ID original
   */
  getCollectionQueryId(symbolId: string | number): string | null {
    const idStr = symbolId.toString();
    
    console.log('getCollectionQueryId - input:', idStr);
    
    if (this.isStaticSymbol(idStr)) {
      const mappedId = this.getDbIdForStaticSymbol(idStr);
      console.log('getCollectionQueryId - mapped result:', mappedId);
      return mappedId;
    }
    
    console.log('getCollectionQueryId - direct result:', idStr);
    return idStr;
  }

  /**
   * Obtient les informations d'un symbole statique
   */
  getStaticSymbolInfo(staticId: string) {
    return STATIC_SYMBOLS.find(symbol => symbol.id === staticId);
  }

  /**
   * Méthode de debug pour exposer le mapping
   */
  getAvailableMappings(): Record<string, string> {
    return { ...this.staticToDbMapping };
  }
}

export const symbolMappingService = new SymbolMappingService();
