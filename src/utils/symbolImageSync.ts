
import { supabaseSymbolService } from '@/services/supabaseSymbolService';
import { SymbolData } from '@/types/supabase';

interface ImageHealthStatus {
  symbolId: string;
  symbolName: string;
  hasSupabaseImage: boolean;
  supabaseImageValid: boolean;
  hasLocalFallback: boolean;
  recommendedAction: 'none' | 'add_local_mapping' | 'fix_supabase_image' | 'both';
  imageUrl?: string;
  error?: string;
}

// Mapping des images locales (même que dans SymbolCard)
const symbolToLocalImageMapping: Record<string, string> = {
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Mandala": "/images/symbols/mandala.png",
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Hamsa": "/images/symbols/mandala.png",
  "Main de Fatma": "/images/symbols/mandala.png",
  "Yin Yang": "/images/symbols/mandala.png",
  "Om": "/images/symbols/mandala.png",
  "Ankh": "/images/symbols/adinkra.png",
  "Attrape-rêves": "/images/symbols/triskelion.png",
  "Dreamcatcher": "/images/symbols/triskelion.png",
  // Fallbacks par culture
  "Celtique": "/images/symbols/triskelion.png",
  "Japonaise": "/images/symbols/seigaiha.png",
  "Grecque": "/images/symbols/greek-meander.png",
  "Indienne": "/images/symbols/mandala.png",
  "Africaine": "/images/symbols/adinkra.png",
  "Française": "/images/symbols/fleur-de-lys.png",
};

/**
 * Vérifie si une URL d'image est accessible
 */
async function checkImageUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking image URL ${url}:`, error);
    return false;
  }
}

/**
 * Trouve la meilleure image locale pour un symbole
 */
function findLocalImage(symbolName: string, culture: string): string | null {
  // Essayer le nom exact
  if (symbolToLocalImageMapping[symbolName]) {
    return symbolToLocalImageMapping[symbolName];
  }
  
  // Essayer par culture
  if (symbolToLocalImageMapping[culture]) {
    return symbolToLocalImageMapping[culture];
  }
  
  // Recherche approximative
  const normalizedName = symbolName.toLowerCase();
  for (const [key, value] of Object.entries(symbolToLocalImageMapping)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}

/**
 * Vérifie l'état de santé des images pour un symbole
 */
export async function checkSymbolImageHealth(symbol: SymbolData): Promise<ImageHealthStatus> {
  const status: ImageHealthStatus = {
    symbolId: symbol.id,
    symbolName: symbol.name,
    hasSupabaseImage: false,
    supabaseImageValid: false,
    hasLocalFallback: false,
    recommendedAction: 'none'
  };
  
  try {
    // Vérifier les images Supabase
    const images = await supabaseSymbolService.getSymbolImages(symbol.id);
    const primaryImage = images.find(img => img.image_type === 'original') || images[0];
    
    if (primaryImage?.image_url) {
      status.hasSupabaseImage = true;
      status.imageUrl = primaryImage.image_url;
      
      // Vérifier si l'URL est accessible
      status.supabaseImageValid = await checkImageUrl(primaryImage.image_url);
    }
    
    // Vérifier si on a un fallback local
    const localImage = findLocalImage(symbol.name, symbol.culture);
    status.hasLocalFallback = !!localImage;
    
    // Déterminer l'action recommandée
    if (!status.hasSupabaseImage && !status.hasLocalFallback) {
      status.recommendedAction = 'both';
    } else if (!status.hasSupabaseImage || !status.supabaseImageValid) {
      status.recommendedAction = status.hasLocalFallback ? 'fix_supabase_image' : 'both';
    } else if (!status.hasLocalFallback) {
      status.recommendedAction = 'add_local_mapping';
    }
    
  } catch (error) {
    status.error = error instanceof Error ? error.message : 'Unknown error';
    status.recommendedAction = 'both';
  }
  
  return status;
}

/**
 * Vérifie l'état de santé des images pour tous les symboles
 */
export async function checkAllSymbolsImageHealth(): Promise<ImageHealthStatus[]> {
  console.log('Starting comprehensive image health check...');
  
  try {
    const symbols = await supabaseSymbolService.getAllSymbols();
    const results: ImageHealthStatus[] = [];
    
    // Traiter les symboles par petits lots pour éviter de surcharger
    const batchSize = 5;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => checkSymbolImageHealth(symbol));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Petit délai entre les lots
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log('Image health check completed:', results);
    return results;
    
  } catch (error) {
    console.error('Error during image health check:', error);
    throw error;
  }
}

/**
 * Génère un rapport de santé des images
 */
export function generateImageHealthReport(healthStatuses: ImageHealthStatus[]): {
  total: number;
  healthy: number;
  needsAttention: number;
  critical: number;
  byAction: Record<string, number>;
} {
  const report = {
    total: healthStatuses.length,
    healthy: 0,
    needsAttention: 0,
    critical: 0,
    byAction: {
      none: 0,
      add_local_mapping: 0,
      fix_supabase_image: 0,
      both: 0
    }
  };
  
  healthStatuses.forEach(status => {
    report.byAction[status.recommendedAction]++;
    
    if (status.recommendedAction === 'none') {
      report.healthy++;
    } else if (status.recommendedAction === 'both') {
      report.critical++;
    } else {
      report.needsAttention++;
    }
  });
  
  return report;
}

/**
 * Utilitaire pour debugger un symbole spécifique
 */
export async function debugSymbolImages(symbolId: string): Promise<void> {
  try {
    const symbol = await supabaseSymbolService.getSymbolById(symbolId);
    if (!symbol) {
      console.error(`Symbol with ID ${symbolId} not found`);
      return;
    }
    
    console.log(`=== Debug pour le symbole: ${symbol.name} ===`);
    console.log('Données du symbole:', symbol);
    
    const images = await supabaseSymbolService.getSymbolImages(symbolId);
    console.log('Images Supabase:', images);
    
    const localImage = findLocalImage(symbol.name, symbol.culture);
    console.log('Image locale trouvée:', localImage);
    
    const healthStatus = await checkSymbolImageHealth(symbol);
    console.log('État de santé:', healthStatus);
    
  } catch (error) {
    console.error('Erreur lors du debug:', error);
  }
}
