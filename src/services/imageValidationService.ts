
import { SymbolImage } from '../types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logService';
import { imageOptimizationService } from './imageOptimizationService';

// Types d'images prises en charge
export type ImageType = 'original' | 'pattern' | 'reuse';

// Cache pour les validations
const validationCache = new Map<string, { isValid: boolean; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Nettoie et valide une URL d'image avec cache
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) {
    logger.warning('URL d\'image vide détectée');
    return '';
  }
  
  // Vérifier si c'est un chemin local (commençant par '/')
  if (url.startsWith('/')) {
    const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
    const hasValidExtension = validImageExtensions.some(ext => url.toLowerCase().endsWith(ext));
    
    if (hasValidExtension || url.includes('/images/')) {
      logger.info('Chemin d\'image local valide', { url });
      return url;
    } else {
      logger.warning('Chemin d\'image local potentiellement invalide', { url });
      return url;
    }
  }
  
  // Vérifier si l'URL est déjà valide
  try {
    new URL(url);
    return url;
  } catch (e) {
    logger.error("URL d'image invalide", { url });
    return '';
  }
}

/**
 * Génère une description d'image basée sur le type
 */
export function getImageDescription(
  symbolName: string,
  symbolCulture: string,
  type: ImageType
): string {
  switch (type) {
    case 'original':
      return `Représentation authentique du symbole ${symbolName} de la culture ${symbolCulture}.`;
    case 'pattern':
      return `Motif extrait du symbole ${symbolName}, utilisé dans la culture ${symbolCulture}.`;
    case 'reuse':
      return `Réinterprétation contemporaine du symbole ${symbolName} d'origine ${symbolCulture}.`;
    default:
      return `Image du symbole ${symbolName}.`;
  }
}

/**
 * Valide qu'une URL d'image est accessible avec cache
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url || url.trim() === '') {
    logger.warning('Tentative de validation d\'URL vide');
    return false;
  }

  // Vérifier le cache
  const cached = validationCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isValid;
  }
  
  // Vérifier si l'URL est valide
  try {
    new URL(url);
  } catch (e) {
    logger.error("URL invalide", { url });
    validationCache.set(url, { isValid: false, timestamp: Date.now() });
    return false;
  }

  // Pour les URL de Supabase Storage
  if (url.includes('supabase') && url.includes('storage')) {
    validationCache.set(url, { isValid: true, timestamp: Date.now() });
    return true;
  }

  try {
    // Vérifier si l'image est accessible
    const response = await fetch(url, { method: 'HEAD' });
    const isValid = response.ok;
    validationCache.set(url, { isValid, timestamp: Date.now() });
    return isValid;
  } catch (error) {
    logger.error("Erreur lors de la vérification de l'URL", {
      url,
      error: (error as Error).message
    });
    validationCache.set(url, { isValid: false, timestamp: Date.now() });
    return false;
  }
}

/**
 * Valide les dimensions d'une image avec cache
 */
export async function validateImageDimensions(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
  const cacheKey = `${url}-${minWidth}x${minHeight}`;
  const cached = validationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isValid;
  }

  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      const valid = img.width >= minWidth && img.height >= minHeight;
      if (!valid) {
        logger.warning('Image dimensions trop petites', {
          url,
          width: img.width,
          height: img.height,
          minWidth,
          minHeight
        });
      }
      validationCache.set(cacheKey, { isValid: valid, timestamp: Date.now() });
      resolve(valid);
    };
    
    img.onerror = () => {
      logger.error("Erreur lors du chargement de l'image", { url });
      validationCache.set(cacheKey, { isValid: false, timestamp: Date.now() });
      resolve(false);
    };
    
    img.src = url;
  });
}

/**
 * Valide le type MIME d'une image avec cache
 */
export async function validateImageType(url: string): Promise<boolean> {
  const cacheKey = `mime-${url}`;
  const cached = validationCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.isValid;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      validationCache.set(cacheKey, { isValid: false, timestamp: Date.now() });
      return false;
    }
    
    const contentType = response.headers.get('content-type');
    const isImage = contentType !== null && contentType.startsWith('image/');
    
    if (!isImage) {
      logger.warning('Type de contenu non-image détecté', {
        url,
        contentType
      });
    }
    
    validationCache.set(cacheKey, { isValid: isImage, timestamp: Date.now() });
    return isImage;
  } catch (error) {
    logger.error("Erreur lors de la vérification du type MIME", {
      url,
      error: (error as Error).message
    });
    validationCache.set(cacheKey, { isValid: false, timestamp: Date.now() });
    return false;
  }
}

/**
 * Valide une image complètement avec optimisation recommandée
 */
export async function validateImage(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<{ isValid: boolean; needsOptimization?: boolean }> {
  // Pour les URL locales, on les considère comme valides sans vérification
  if (url.startsWith('/')) {
    return { isValid: true, needsOptimization: false };
  }
  
  const urlValid = await validateImageUrl(url);
  if (!urlValid) return { isValid: false };
  
  const dimensionsValid = await validateImageDimensions(url, minWidth, minHeight);
  if (!dimensionsValid) return { isValid: false };
  
  const typeValid = await validateImageType(url);
  if (!typeValid) return { isValid: false };

  // Vérifier si l'image a besoin d'optimisation
  const needsOptimization = await imageOptimizationService.needsOptimization(url);
  
  return { isValid: true, needsOptimization };
}

/**
 * Traite et met à jour une image avec optimisation automatique
 */
export async function processAndUpdateImage(
  symbolName: string,
  symbolCulture: string,
  imageUrl: string,
  type: ImageType
): Promise<string> {
  logger.info('Vérification de l\'image', { symbolName, type, imageUrl });
  
  // Si c'est un chemin local, on le considère comme valide sans vérification
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }
  
  // Vérifier si l'image est valide et a besoin d'optimisation
  const validation = await validateImage(imageUrl);
  
  if (validation.isValid) {
    // Si l'image a besoin d'optimisation, essayer de l'optimiser
    if (validation.needsOptimization) {
      try {
        const optimized = await imageOptimizationService.optimizeExistingImage(imageUrl);
        if (optimized) {
          logger.info('Image optimisée avec succès', { 
            originalUrl: imageUrl,
            optimizedUrl: optimized.optimizedUrl,
            compressionRatio: optimized.compressionRatio
          });
          return optimized.optimizedUrl;
        }
      } catch (error) {
        logger.warning('Échec de l\'optimisation, utilisation de l\'URL originale', { error });
      }
    }
    return imageUrl; // Image valide, renvoyer l'URL originale
  }
  
  // Si l'image n'est pas valide, générer une alternative
  logger.warning(`Image non disponible, recherche d'alternative`, {
    symbolName,
    imageType: type,
    originalUrl: imageUrl
  });
  
  let alternativeUrl = "";
  
  switch (type) {
    case 'original':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+${symbolCulture.toLowerCase()}+historical+artifact`;
      break;
    case 'pattern':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+pattern+design`;
      break;
    case 'reuse':
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}+modern+design`;
      break;
    default:
      alternativeUrl = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolName.toLowerCase())}`;
  }
  
  logger.info(`URL alternative générée`, { 
    symbolName, 
    type, 
    alternativeUrl 
  });
  
  return alternativeUrl;
}

/**
 * Sauvegarde une image optimisée dans Supabase Storage
 */
export async function saveOptimizedImageToStorage(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  try {
    logger.info('Sauvegarde d\'image optimisée dans Storage', { bucket, path });
    
    // Utiliser le service d'optimisation pour upload avec compression automatique
    const result = await imageOptimizationService.uploadOptimizedImage(file, bucket, path);
    
    if (result) {
      logger.info('Image optimisée et sauvegardée avec succès', { 
        url: result.optimizedUrl,
        compressionRatio: result.compressionRatio,
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize
      });
      return result.optimizedUrl;
    }
    
    // Fallback vers l'ancienne méthode si l'optimisation échoue
    return await saveImageToStorage(file, bucket, path);
  } catch (error) {
    logger.error("Erreur lors de l'enregistrement de l'image optimisée", {
      bucket,
      path,
      error: (error as Error).message
    });
    return null;
  }
}

/**
 * Sauvegarde une image dans Supabase Storage (méthode originale)
 */
export async function saveImageToStorage(
  file: File,
  bucket: string,
  path: string
): Promise<string | null> {
  try {
    logger.info('Sauvegarde d\'image dans Storage', { bucket, path });
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
        contentType: file.type,
      });
    
    if (error) {
      throw error;
    }
    
    // Construire l'URL de l'image stockée
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    logger.info('Image sauvegardée avec succès', { url: urlData.publicUrl });
    return urlData.publicUrl;
  } catch (error) {
    logger.error("Erreur lors de l'enregistrement de l'image", {
      bucket,
      path,
      error: (error as Error).message
    });
    return null;
  }
}

// Fonctions spécifiques pour chaque type d'image avec validation améliorée
export async function validateOriginalImage(url: string): Promise<{ isValid: boolean; needsOptimization?: boolean }> {
  return validateImage(url, 300, 300);
}

export async function validatePatternImage(url: string): Promise<{ isValid: boolean; needsOptimization?: boolean }> {
  return validateImage(url, 200, 200);
}

export async function validateReuseImage(url: string): Promise<{ isValid: boolean; needsOptimization?: boolean }> {
  return validateImage(url, 250, 250);
}

/**
 * Nettoie le cache de validation
 */
export function clearValidationCache(): void {
  validationCache.clear();
  logger.info('Cache de validation nettoyé');
}

/**
 * Obtient les statistiques du cache de validation
 */
export function getValidationCacheStats(): { size: number; entries: number } {
  return {
    size: validationCache.size,
    entries: validationCache.size
  };
}
