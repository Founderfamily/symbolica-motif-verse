
import { STATIC_SYMBOLS } from '@/data/staticSymbols';

/**
 * Service simplifié pour la recherche de symboles par nom
 * Plus de mapping complexe, utilisation directe des indices statiques
 */
class SymbolMappingService {
  /**
   * Trouve un symbole par son nom (recherche approximative)
   */
  findSymbolByName(name: string): { symbol: any; index: number } | null {
    console.log('Recherche de symbole par nom:', name);
    
    const lowerName = name.toLowerCase();
    
    // Recherche exacte d'abord
    let foundIndex = STATIC_SYMBOLS.findIndex(symbol => 
      symbol.name.toLowerCase() === lowerName
    );
    
    // Si pas trouvé, recherche approximative
    if (foundIndex === -1) {
      foundIndex = STATIC_SYMBOLS.findIndex(symbol => 
        symbol.name.toLowerCase().includes(lowerName) ||
        lowerName.includes(symbol.name.toLowerCase())
      );
    }
    
    if (foundIndex !== -1) {
      console.log('Symbole trouvé:', STATIC_SYMBOLS[foundIndex].name, 'à l\'index', foundIndex);
      return { symbol: STATIC_SYMBOLS[foundIndex], index: foundIndex };
    }
    
    console.log('Aucun symbole trouvé pour:', name);
    return null;
  }

  /**
   * Obtient un symbole par son index statique
   */
  getSymbolByIndex(index: number): any | null {
    if (index >= 0 && index < STATIC_SYMBOLS.length) {
      return STATIC_SYMBOLS[index];
    }
    return null;
  }

  /**
   * Obtient tous les symboles statiques
   */
  getAllStaticSymbols() {
    return STATIC_SYMBOLS;
  }
}

export const symbolMappingService = new SymbolMappingService();
