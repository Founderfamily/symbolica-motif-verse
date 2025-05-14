
import { SymbolImage } from '../types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logService';

// Types d'images prises en charge
export type ImageType = 'original' | 'pattern' | 'reuse';

/**
 * Nettoie et valide une URL d'image
 * @param url URL à nettoyer
 * @returns URL nettoyée ou chaîne vide si invalide
 */
export function sanitizeImageUrl(url: string): string {
  if (!url) {
    logger.warning('URL d\'image vide détectée');
    return '';
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
 * Valide qu'une URL d'image est accessible
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  if (!url || url.trim() === '') {
    logger.warning('Tentative de validation d\'URL vide');
    return false;
  }
  
  // Vérifier si l'URL est valide
  try {
    new URL(url);
  } catch (e) {
    logger.error("URL invalide", { url });
    return false;
  }

  // Pour les URL de Supabase Storage
  if (url.includes('supabase') && url.includes('storage')) {
    // Nous faisons confiance à nos propres URL de stockage
    return true;
  }

  try {
    // Vérifier si l'image est accessible
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    logger.error("Erreur lors de la vérification de l'URL", {
      url,
      error: (error as Error).message
    });
    return false;
  }
}

/**
 * Valide les dimensions d'une image
 */
export async function validateImageDimensions(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
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
      resolve(valid);
    };
    
    img.onerror = () => {
      logger.error("Erreur lors du chargement de l'image", { url });
      resolve(false);
    };
    
    img.src = url;
  });
}

/**
 * Valide le type MIME d'une image
 */
export async function validateImageType(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) return false;
    
    const contentType = response.headers.get('content-type');
    const isImage = contentType !== null && contentType.startsWith('image/');
    
    if (!isImage) {
      logger.warning('Type de contenu non-image détecté', {
        url,
        contentType
      });
    }
    
    return isImage;
  } catch (error) {
    logger.error("Erreur lors de la vérification du type MIME", {
      url,
      error: (error as Error).message
    });
    return false;
  }
}

/**
 * Valide une image complètement (URL, dimensions, type)
 */
export async function validateImage(
  url: string,
  minWidth: number = 100,
  minHeight: number = 100
): Promise<boolean> {
  const urlValid = await validateImageUrl(url);
  if (!urlValid) return false;
  
  const dimensionsValid = await validateImageDimensions(url, minWidth, minHeight);
  if (!dimensionsValid) return false;
  
  const typeValid = await validateImageType(url);
  return typeValid;
}

/**
 * Traite et met à jour une image en cas de problème
 */
export async function processAndUpdateImage(
  symbolName: string,
  symbolCulture: string,
  imageUrl: string,
  type: ImageType
): Promise<string> {
  logger.info('Vérification de l\'image', { symbolName, type, imageUrl });
  
  // Vérifier si l'image est valide
  const isValid = await validateImageUrl(imageUrl);
  
  if (isValid) {
    return imageUrl; // Image valide, renvoyer l'URL originale
  }
  
  // Si l'image n'est pas valide, générer une alternative
  logger.warning(`Image non disponible, recherche d'alternative`, {
    symbolName,
    imageType: type,
    originalUrl: imageUrl
  });
  
  let alternativeUrl = "";
  
  // Utiliser le switch avec tous les types possibles définis dans ImageType
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
 * Sauvegarde une image dans Supabase Storage
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

// Fonctions spécifiques pour chaque type d'image
export function validateOriginalImage(url: string): Promise<boolean> {
  return validateImage(url, 300, 300);
}

export function validatePatternImage(url: string): Promise<boolean> {
  return validateImage(url, 200, 200);
}

export function validateReuseImage(url: string): Promise<boolean> {
  return validateImage(url, 250, 250);
}
