

import { STATIC_SYMBOLS } from '@/data/staticSymbols';

/**
 * Service pour mapper les symboles statiques vers leurs équivalents en base de données
 * et gérer la cohérence entre les différents systèmes d'IDs
 */
class SymbolMappingService {
  // Mapping manuel entre symboles statiques et IDs de la base de données (UUIDs réels)
  private staticToDbMapping: Record<string, string> = {
    // IDs exacts des symboles statiques vers IDs réels de la base de données
    'triskele-1': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Triskèle Celtique
    'fleur-lys-2': '50a5421b-bb53-461e-a17e-c3f2a6b3a89f', // Fleur de Lys
    'mandala-3': 'f59c2eea-7b33-4c1e-8b93-4b3e5f7a9c1d', // Mandala
    'meandre-4': '3b2c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q', // Méandre Grec (à mettre à jour si trouvé en BDD)
    'adinkra-5': 'd128f094-8621-4b02-b3d5-c7648c5f18f4', // Symbole Adinkra
    'seigaiha-6': '5d4e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s', // Motif Seigaiha (à mettre à jour si trouvé en BDD)
    'yin-yang-7': '6e5f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t', // Yin Yang (à mettre à jour si trouvé en BDD)
    'ankh-8': '04e6f7fc-bafe-4331-8629-520c93cbb91a', // Ankh
    'hamsa-9': '8g7h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v', // Hamsa (à mettre à jour si trouvé en BDD)
    'dreamcatcher-10': '9h8i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w', // Attrape-rêves (à mettre à jour si trouvé en BDD)
    
    // Variantes possibles pour le Triskèle
    '0': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Si l'ID numérique est 0
    'triskele': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Sans suffixe
    'triskelion': '788ed8d5-c613-43f3-8bd7-c39ac09c42cd', // Nom alternatif
    
    // Variantes pour l'Ankh
    'ankh': '04e6f7fc-bafe-4331-8629-520c93cbb91a', // Sans suffixe
    '8': '04e6f7fc-bafe-4331-8629-520c93cbb91a', // Index numérique
    
    // Variantes pour Adinkra
    'adinkra': 'd128f094-8621-4b02-b3d5-c7648c5f18f4', // Sans suffixe
    '5': 'd128f094-8621-4b02-b3d5-c7648c5f18f4', // Index numérique
    
    // Variantes pour Fleur de Lys
    'fleur-lys': '50a5421b-bb53-461e-a17e-c3f2a6b3a89f', // Sans suffixe
    'fleur-de-lys': '50a5421b-bb53-461e-a17e-c3f2a6b3a89f', // Avec "de"
    '2': '50a5421b-bb53-461e-a17e-c3f2a6b3a89f', // Index numérique
    
    // Variantes pour Mandala
    'mandala': 'f59c2eea-7b33-4c1e-8b93-4b3e5f7a9c1d', // Sans suffixe
    '3': 'f59c2eea-7b33-4c1e-8b93-4b3e5f7a9c1d', // Index numérique
  };

  // Mapping inverse pour retrouver l'ID statique depuis un UUID
  private dbToStaticMapping: Record<string, string> = {};

  constructor() {
    // Construire le mapping inverse
    Object.entries(this.staticToDbMapping).forEach(([staticId, dbId]) => {
      this.dbToStaticMapping[dbId] = staticId;
    });
  }

  /**
   * Recherche par nom si l'ID n'est pas trouvé dans le mapping
   */
  private findByName(symbolName: string): string | null {
    console.log('findByName - searching for:', symbolName);
    
    // Recherche exacte par nom dans les symboles statiques
    const staticSymbol = STATIC_SYMBOLS.find(symbol => 
      symbol.name.toLowerCase() === symbolName.toLowerCase()
    );
    
    if (staticSymbol) {
      const mappedId = this.staticToDbMapping[staticSymbol.id];
      console.log('findByName - found static symbol:', staticSymbol.id, '-> mapped to:', mappedId);
      return mappedId || null;
    }
    
    return null;
  }

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
   * Vérifie si un ID correspond à un UUID de base de données
   */
  isDatabaseSymbol(symbolId: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(symbolId);
  }

  /**
   * Obtient l'ID de la base de données correspondant à un symbole statique
   */
  getDbIdForStaticSymbol(staticId: string): string | null {
    console.log('getDbIdForStaticSymbol - searching for:', staticId);
    console.log('Available mappings:', Object.keys(this.staticToDbMapping));
    
    // Recherche directe dans le mapping
    let result = this.staticToDbMapping[staticId];
    
    // Si pas trouvé, essayer de chercher par nom
    if (!result) {
      // Trouver le symbole statique correspondant
      const staticSymbol = STATIC_SYMBOLS.find(symbol => symbol.id === staticId);
      if (staticSymbol) {
        result = this.findByName(staticSymbol.name);
      }
    }
    
    console.log('getDbIdForStaticSymbol result:', result);
    
    return result;
  }

  /**
   * Obtient l'ID statique correspondant à un UUID de base de données
   */
  getStaticIdForDbSymbol(dbId: string): string | null {
    return this.dbToStaticMapping[dbId] || null;
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
   * Normalise un ID de symbole pour la navigation
   * Retourne toujours un ID qui peut être utilisé dans l'URL
   */
  normalizeSymbolId(symbolId: string | number, preferDatabase = true): string {
    const idStr = symbolId.toString();
    
    if (preferDatabase && this.isStaticSymbol(idStr)) {
      const dbId = this.getDbIdForStaticSymbol(idStr);
      return dbId || idStr;
    }
    
    return idStr;
  }

  /**
   * Obtient les informations d'un symbole statique
   */
  getStaticSymbolInfo(staticId: string) {
    return STATIC_SYMBOLS.find(symbol => symbol.id === staticId);
  }

  /**
   * Met à jour le mapping entre un symbole statique et un symbole de base de données
   */
  updateMapping(staticId: string, dbId: string) {
    this.staticToDbMapping[staticId] = dbId;
    this.dbToStaticMapping[dbId] = staticId;
  }

  /**
   * Méthode de debug pour exposer le mapping
   */
  getAvailableMappings(): Record<string, string> {
    return { ...this.staticToDbMapping };
  }
}

export const symbolMappingService = new SymbolMappingService();

