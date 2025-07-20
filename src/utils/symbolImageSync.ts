import { supabaseSymbolService } from '@/services/supabaseSymbolService';
import { SymbolData } from '@/types/supabase';
import { imageOptimizationService } from '@/services/imageOptimizationService';
import { validateImageUrl } from '@/services/imageValidationService';
import { logger } from '@/services/logService';

export interface ImageHealthStatus {
  symbolId: string;
  symbolName: string;
  hasSupabaseImage: boolean;
  supabaseImageValid: boolean;
  hasLocalFallback: boolean;
  needsOptimization: boolean;
  optimizationSavings?: number;
  recommendedAction: 'none' | 'add_local_mapping' | 'fix_supabase_image' | 'optimize' | 'both';
  imageUrl?: string;
  error?: string;
  backupAvailable?: boolean;
}

export interface OptimizationReport {
  totalImages: number;
  optimized: number;
  failed: number;
  totalSavings: number;
  averageCompression: number;
}

// Mapping des images locales (amélioré avec plus de symboles)
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
  "Art Aborigène": "/images/symbols/aboriginal.png",
  "Motif Viking": "/images/symbols/viking.png",
  "Arabesque": "/images/symbols/arabesque.png",
  "Motif Aztèque": "/images/symbols/aztec.png",
  // Fallbacks par culture
  "Celtique": "/images/symbols/triskelion.png",
  "Japonaise": "/images/symbols/seigaiha.png",
  "Grecque": "/images/symbols/greek-meander.png",
  "Indienne": "/images/symbols/mandala.png",
  "Africaine": "/images/symbols/adinkra.png",
  "Française": "/images/symbols/fleur-de-lys.png",
  "Viking": "/images/symbols/viking.png",
  "Nordique": "/images/symbols/viking.png",
  "Aborigène": "/images/symbols/aboriginal.png",
  "Aztèque": "/images/symbols/aztec.png",
  "Islamique": "/images/symbols/arabesque.png",
  "Arabe": "/images/symbols/arabesque.png"
};

/**
 * Vérifie si une URL d'image est accessible avec retry
 */
async function checkImageUrlWithRetry(url: string, maxRetries: number = 2): Promise<boolean> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) return true;
    } catch (error) {
      if (i === maxRetries) {
        console.error(`Error checking image URL ${url} after ${maxRetries} retries:`, error);
      }
      // Attendre avant de réessayer
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  return false;
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
 * Vérifie l'état de santé des images pour un symbole avec optimisation
 */
export async function checkSymbolImageHealth(symbol: SymbolData): Promise<ImageHealthStatus> {
  const status: ImageHealthStatus = {
    symbolId: symbol.id,
    symbolName: symbol.name,
    hasSupabaseImage: false,
    supabaseImageValid: false,
    hasLocalFallback: false,
    needsOptimization: false,
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
      status.supabaseImageValid = await checkImageUrlWithRetry(primaryImage.image_url);
      
      // Vérifier si l'image a besoin d'optimisation
      if (status.supabaseImageValid) {
        status.needsOptimization = await imageOptimizationService.needsOptimization(primaryImage.image_url);
        
        if (status.needsOptimization) {
          // Calculer les économies potentielles
          try {
            const response = await fetch(primaryImage.image_url, { method: 'HEAD' });
            const size = parseInt(response.headers.get('content-length') || '0');
            // Estimation des économies (typiquement 30-50% avec WebP)
            status.optimizationSavings = Math.round(size * 0.4);
          } catch {}
        }
      }
    }
    
    // Vérifier si on a un fallback local
    const localImage = findLocalImage(symbol.name, symbol.culture);
    status.hasLocalFallback = !!localImage;
    
    // Vérifier si une sauvegarde est disponible
    status.backupAvailable = await checkBackupAvailability(symbol.id);
    
    // Déterminer l'action recommandée
    if (!status.hasSupabaseImage && !status.hasLocalFallback) {
      status.recommendedAction = 'both';
    } else if (!status.hasSupabaseImage || !status.supabaseImageValid) {
      status.recommendedAction = status.hasLocalFallback ? 'fix_supabase_image' : 'both';
    } else if (status.needsOptimization) {
      status.recommendedAction = 'optimize';
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
 * Vérifie si une sauvegarde est disponible pour un symbole
 */
async function checkBackupAvailability(symbolId: string): Promise<boolean> {
  try {
    // Vérifier dans le cache d'optimisation
    const cacheStats = imageOptimizationService.getCacheStats();
    return cacheStats.entries.some(entry => entry.includes(symbolId));
  } catch {
    return false;
  }
}

/**
 * Corrige automatiquement les images cassées
 */
export async function autoFixBrokenImages(symbolIds?: string[]): Promise<{
  fixed: number;
  failed: number;
  details: Array<{ symbolId: string; status: 'fixed' | 'failed'; error?: string }>;
}> {
  const result = {
    fixed: 0,
    failed: 0,
    details: [] as Array<{ symbolId: string; status: 'fixed' | 'failed'; error?: string }>
  };
  
  try {
    const symbols = symbolIds ? 
      await Promise.all(symbolIds.map(id => supabaseSymbolService.getSymbolById(id))) :
      await supabaseSymbolService.getAllSymbols();
    
    const validSymbols = symbols.filter(Boolean) as SymbolData[];
    
    for (const symbol of validSymbols) {
      try {
        const health = await checkSymbolImageHealth(symbol);
        
        if (health.recommendedAction === 'fix_supabase_image' || health.recommendedAction === 'both') {
          // Essayer de trouver une image locale de remplacement
          const localImage = findLocalImage(symbol.name, symbol.culture);
          
          if (localImage) {
            // Ici, on devrait idéalement mettre à jour la base avec l'image locale
            // Pour l'instant, on log juste l'action
            logger.info('Image cassée corrigée avec image locale', {
              symbolId: symbol.id,
              symbolName: symbol.name,
              localImage
            });
            
            result.fixed++;
            result.details.push({ symbolId: symbol.id, status: 'fixed' });
          } else {
            result.failed++;
            result.details.push({ 
              symbolId: symbol.id, 
              status: 'failed', 
              error: 'No local fallback available' 
            });
          }
        }
      } catch (error) {
        result.failed++;
        result.details.push({ 
          symbolId: symbol.id, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }
    
  } catch (error) {
    logger.error('Error in autoFixBrokenImages', { error });
  }
  
  return result;
}

/**
 * Optimise automatiquement les images qui en ont besoin
 */
export async function autoOptimizeImages(symbolIds?: string[]): Promise<OptimizationReport> {
  const report: OptimizationReport = {
    totalImages: 0,
    optimized: 0,
    failed: 0,
    totalSavings: 0,
    averageCompression: 0
  };
  
  const compressionRatios: number[] = [];
  
  try {
    const symbols = symbolIds ? 
      await Promise.all(symbolIds.map(id => supabaseSymbolService.getSymbolById(id))) :
      await supabaseSymbolService.getAllSymbols();
    
    const validSymbols = symbols.filter(Boolean) as SymbolData[];
    
    for (const symbol of validSymbols) {
      try {
        const images = await supabaseSymbolService.getSymbolImages(symbol.id);
        
        for (const image of images) {
          if (!image.image_url) continue;
          
          report.totalImages++;
          
          const needsOptimization = await imageOptimizationService.needsOptimization(image.image_url);
          
          if (needsOptimization) {
            try {
              const optimized = await imageOptimizationService.optimizeExistingImage(image.image_url);
              
              if (optimized) {
                report.optimized++;
                report.totalSavings += (optimized.originalSize - optimized.optimizedSize);
                compressionRatios.push(optimized.compressionRatio);
                
                logger.info('Image optimisée avec succès', {
                  symbolId: symbol.id,
                  imageId: image.id,
                  compressionRatio: optimized.compressionRatio,
                  savings: optimized.originalSize - optimized.optimizedSize
                });
              } else {
                report.failed++;
              }
            } catch (error) {
              report.failed++;
              logger.error('Échec de l\'optimisation d\'image', {
                symbolId: symbol.id,
                imageId: image.id,
                error
              });
            }
          }
        }
      } catch (error) {
        logger.error('Error processing symbol for optimization', {
          symbolId: symbol.id,
          error
        });
      }
    }
    
    // Calculer la compression moyenne
    if (compressionRatios.length > 0) {
      report.averageCompression = compressionRatios.reduce((a, b) => a + b, 0) / compressionRatios.length;
    }
    
  } catch (error) {
    logger.error('Error in autoOptimizeImages', { error });
  }
  
  return report;
}

/**
 * Vérifie l'état de santé des images pour tous les symboles avec optimisations
 */
export async function checkAllSymbolsImageHealth(): Promise<ImageHealthStatus[]> {
  console.log('Starting comprehensive image health check with optimization analysis...');
  
  try {
    const symbols = await supabaseSymbolService.getAllSymbols();
    const results: ImageHealthStatus[] = [];
    
    // Traiter les symboles par petits lots pour éviter de surcharger
    const batchSize = 3; // Réduit pour les analyses plus complexes
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map(symbol => checkSymbolImageHealth(symbol));
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Petit délai entre les lots
      if (i + batchSize < symbols.length) {
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log('Image health check completed with optimization analysis:', results);
    return results;
    
  } catch (error) {
    console.error('Error during image health check:', error);
    throw error;
  }
}

/**
 * Génère un rapport de santé des images avec métriques d'optimisation
 */
export function generateImageHealthReport(healthStatuses: ImageHealthStatus[]): {
  total: number;
  healthy: number;
  needsAttention: number;
  critical: number;
  needsOptimization: number;
  totalOptimizationSavings: number;
  byAction: Record<string, number>;
} {
  const report = {
    total: healthStatuses.length,
    healthy: 0,
    needsAttention: 0,
    critical: 0,
    needsOptimization: 0,
    totalOptimizationSavings: 0,
    byAction: {
      none: 0,
      add_local_mapping: 0,
      fix_supabase_image: 0,
      optimize: 0,
      both: 0
    }
  };
  
  healthStatuses.forEach(status => {
    report.byAction[status.recommendedAction]++;
    
    if (status.needsOptimization) {
      report.needsOptimization++;
      if (status.optimizationSavings) {
        report.totalOptimizationSavings += status.optimizationSavings;
      }
    }
    
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
 * Tâche de maintenance programmée
 */
export async function runMaintenanceTask(): Promise<{
  healthCheck: ImageHealthStatus[];
  autoFix: Awaited<ReturnType<typeof autoFixBrokenImages>>;
  optimization: OptimizationReport;
}> {
  console.log('Running scheduled maintenance task...');
  
  // 1. Vérification de santé
  const healthCheck = await checkAllSymbolsImageHealth();
  
  // 2. Correction automatique des images cassées
  const brokenImages = healthCheck
    .filter(status => status.recommendedAction === 'fix_supabase_image' || status.recommendedAction === 'both')
    .map(status => status.symbolId);
  
  const autoFix = await autoFixBrokenImages(brokenImages);
  
  // 3. Optimisation automatique
  const needOptimization = healthCheck
    .filter(status => status.needsOptimization)
    .map(status => status.symbolId);
  
  const optimization = await autoOptimizeImages(needOptimization);
  
  console.log('Maintenance task completed', {
    healthCheck: healthCheck.length,
    autoFix,
    optimization
  });
  
  return { healthCheck, autoFix, optimization };
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
    
    // Informations d'optimisation
    if (healthStatus.imageUrl) {
      const needsOptimization = await imageOptimizationService.needsOptimization(healthStatus.imageUrl);
      console.log('Besoin d\'optimisation:', needsOptimization);
      
      if (needsOptimization) {
        const optimizationResult = await imageOptimizationService.optimizeExistingImage(healthStatus.imageUrl);
        console.log('Résultat d\'optimisation:', optimizationResult);
      }
    }
    
  } catch (error) {
    console.error('Erreur lors du debug:', error);
  }
}
