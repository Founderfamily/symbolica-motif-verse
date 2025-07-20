
interface ImageCacheEntry {
  url: string;
  isValid: boolean;
  timestamp: number;
  retryCount: number;
}

// Cache en mémoire pour les URLs d'images
const imageCache = new Map<string, ImageCacheEntry>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MAX_RETRY_COUNT = 3;

// Mapping amélioré des images locales avec plus de variations
const symbolToLocalImageEnhanced: Record<string, string> = {
  // Variations pour Triskèle
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Triskelion": "/images/symbols/triskelion.png",
  "Triskell": "/images/symbols/triskelion.png",
  "Triskell celtique": "/images/symbols/triskelion.png",
  
  // Variations pour Fleur de Lys
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Fleur-de-lys": "/images/symbols/fleur-de-lys.png",
  
  // Variations pour Méandre
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Greek Meander": "/images/symbols/greek-meander.png",
  "Meander": "/images/symbols/greek-meander.png",
  
  // Variations pour Mandala
  "Mandala": "/images/symbols/mandala.png",
  "Mandala Indien": "/images/symbols/mandala.png",
  "Mandala indien": "/images/symbols/mandala.png",
  "Mandala Bouddhiste": "/images/symbols/mandala.png",
  
  // Variations pour Adinkra
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Adinkra Symbol": "/images/symbols/adinkra.png",
  
  // Variations pour Seigaiha
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Vagues Japonaises": "/images/symbols/seigaiha.png",
  
  // Symboles spirituels
  "Hamsa": "/images/symbols/mandala.png",
  "Main de Fatma": "/images/symbols/mandala.png",
  "Khamsa": "/images/symbols/mandala.png",
  "Yin Yang": "/images/symbols/mandala.png",
  "Yin et Yang": "/images/symbols/mandala.png",
  "Om": "/images/symbols/mandala.png",
  "Aum": "/images/symbols/mandala.png",
  
  // Symboles égyptiens
  "Ankh": "/images/symbols/adinkra.png",
  "Croix de Vie": "/images/symbols/adinkra.png",
  "Œil d'Horus": "/images/symbols/adinkra.png",
  
  // Symboles nordiques/vikings
  "Mjöllnir": "/images/symbols/viking.png",
  "Marteau de Thor": "/images/symbols/viking.png",
  "Valknut": "/images/symbols/viking.png",
  "Runes": "/images/symbols/viking.png",
  "Motif viking": "/images/symbols/viking.png",
  "Rune Viking": "/images/symbols/viking.png",
  
  // Symboles amérindiens
  "Attrape-rêves": "/images/symbols/aboriginal.png",
  "Dreamcatcher": "/images/symbols/aboriginal.png",
  "Plume Sacrée": "/images/symbols/aboriginal.png",
  "Art aborigène": "/images/symbols/aboriginal.png",
  
  // Symboles aztèques/mayas
  "Quetzalcoatl": "/images/symbols/aztec.png",
  "Calendrier Aztèque": "/images/symbols/aztec.png",
  "Serpent à Plumes": "/images/symbols/aztec.png",
  "Motif aztèque": "/images/symbols/aztec.png",
  
  // Symboles islamiques
  "Arabesque": "/images/symbols/arabesque.png",
  "Calligraphie Arabe": "/images/symbols/arabesque.png",
  "Géométrie Islamique": "/images/symbols/arabesque.png"
};

// Fallbacks par culture
const culturalFallbacks: Record<string, string> = {
  "Celtique": "/images/symbols/triskelion.png",
  "Japonaise": "/images/symbols/seigaiha.png",
  "Grecque": "/images/symbols/greek-meander.png",
  "Indienne": "/images/symbols/mandala.png",
  "Africaine": "/images/symbols/adinkra.png",
  "Française": "/images/symbols/fleur-de-lys.png",
  "Nordique": "/images/symbols/viking.png",
  "Aztèque": "/images/symbols/aztec.png",
  "Islamique": "/images/symbols/arabesque.png",
  "Chinoise": "/images/symbols/mandala.png",
  "Égyptienne": "/images/symbols/adinkra.png",
  "Moyen-Orientale": "/images/symbols/arabesque.png",
  "Amérindienne": "/images/symbols/aboriginal.png"
};

export class ImageService {
  /**
   * Trouve la meilleure image locale pour un symbole
   */
  static findBestLocalImage(symbolName: string, culture: string): string {
    console.log(`🔍 [ImageService] Recherche image pour "${symbolName}" (culture: ${culture})`);
    
    // 1. Recherche exacte par nom
    if (symbolToLocalImageEnhanced[symbolName]) {
      console.log(`✅ [ImageService] Image trouvée par nom exact: ${symbolToLocalImageEnhanced[symbolName]}`);
      return symbolToLocalImageEnhanced[symbolName];
    }
    
    // 2. Recherche par nom normalisé (sans accents, casse)
    const normalizedName = this.normalizeString(symbolName);
    for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
      if (this.normalizeString(key) === normalizedName) {
        console.log(`✅ [ImageService] Image trouvée par nom normalisé: ${value}`);
        return value;
      }
    }
    
    // 3. Recherche partielle dans le nom
    for (const [key, value] of Object.entries(symbolToLocalImageEnhanced)) {
      if (key.toLowerCase().includes(symbolName.toLowerCase()) || 
          symbolName.toLowerCase().includes(key.toLowerCase())) {
        console.log(`✅ [ImageService] Image trouvée par correspondance partielle: ${value}`);
        return value;
      }
    }
    
    // 4. Fallback par culture
    if (culturalFallbacks[culture]) {
      console.log(`✅ [ImageService] Image trouvée par fallback culturel: ${culturalFallbacks[culture]}`);
      return culturalFallbacks[culture];
    }
    
    // 5. Placeholder par défaut
    console.log(`⚠️ [ImageService] Utilisation du placeholder pour "${symbolName}"`);
    return "/placeholder.svg";
  }
  
  /**
   * Normalise une chaîne pour la comparaison
   */
  private static normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^\w\s]/g, '') // Supprime la ponctuation
      .trim();
  }
  
  /**
   * Vérifie si une URL d'image est en cache et valide
   */
  static getCachedImageUrl(key: string): string | null {
    const cached = imageCache.get(key);
    if (!cached) return null;
    
    const now = Date.now();
    if (now - cached.timestamp > CACHE_DURATION) {
      imageCache.delete(key);
      return null;
    }
    
    return cached.isValid ? cached.url : null;
  }
  
  /**
   * Met en cache le résultat d'une vérification d'URL
   */
  static setCachedImageUrl(key: string, url: string, isValid: boolean): void {
    imageCache.set(key, {
      url,
      isValid,
      timestamp: Date.now(),
      retryCount: 0
    });
  }
  
  /**
   * Précharge une image de manière asynchrone
   */
  static async preloadImage(url: string): Promise<boolean> {
    if (!url || url === "/placeholder.svg") return true;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
      
      // Timeout de 8 secondes pour le preloading
      setTimeout(() => resolve(false), 8000);
    });
  }
  
  /**
   * Vérifie si une URL d'image est accessible avec retry
   */
  static async verifyImageUrl(url: string, maxRetries: number = MAX_RETRY_COUNT): Promise<boolean> {
    if (!url || url.startsWith('/')) return true; // Images locales supposées valides
    
    const cacheKey = `verify_${url}`;
    const cached = this.getCachedImageUrl(cacheKey);
    if (cached !== null) return true;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const success = await this.preloadImage(url);
        if (success) {
          this.setCachedImageUrl(cacheKey, url, true);
          return true;
        }
      } catch (error) {
        console.warn(`[ImageService] Tentative ${attempt + 1}/${maxRetries} échouée pour ${url}:`, error);
      }
      
      // Attendre avant le prochain essai (backoff exponentiel)
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
    
    this.setCachedImageUrl(cacheKey, url, false);
    return false;
  }
  
  /**
   * Nettoie le cache des images expirées
   */
  static cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of imageCache.entries()) {
      if (now - entry.timestamp > CACHE_DURATION) {
        imageCache.delete(key);
      }
    }
  }
}

// Nettoyage automatique du cache toutes les 10 minutes
setInterval(() => ImageService.cleanupCache(), 10 * 60 * 1000);
