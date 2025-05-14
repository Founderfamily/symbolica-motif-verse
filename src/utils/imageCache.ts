
import { ImageType } from './symbolImageUtils';

// Interface pour les entrées de cache d'image
interface ImageCacheEntry {
  url: string;
  isValid: boolean;
  timestamp: number;
}

// Durée de validité du cache en millisecondes (24 heures)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Cache en mémoire pour stocker les vérifications d'URLs
const imageUrlCache: Record<string, ImageCacheEntry> = {};

/**
 * Obtient une URL d'image du cache ou null si elle n'est pas disponible/valide
 */
export const getCachedImageUrl = (symbolId: string, type: ImageType): string | null => {
  const key = `${symbolId}_${type}`;
  const entry = imageUrlCache[key];
  
  if (!entry) return null;
  
  // Vérifier si l'entrée du cache est encore valide
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    // Cache expiré, supprimer l'entrée
    delete imageUrlCache[key];
    return null;
  }
  
  // Retourner l'URL du cache seulement si elle était valide
  return entry.isValid ? entry.url : null;
};

/**
 * Ajoute une URL d'image au cache
 */
export const setCachedImageUrl = (symbolId: string, type: ImageType, url: string, isValid: boolean): void => {
  const key = `${symbolId}_${type}`;
  
  imageUrlCache[key] = {
    url,
    isValid,
    timestamp: Date.now()
  };
};

/**
 * Efface le cache pour un symbole spécifique ou pour tous les symboles si aucun ID n'est fourni
 */
export const clearImageCache = (symbolId?: string): void => {
  if (symbolId) {
    // Effacer le cache pour un symbole spécifique uniquement
    Object.keys(imageUrlCache).forEach(key => {
      if (key.startsWith(`${symbolId}_`)) {
        delete imageUrlCache[key];
      }
    });
  } else {
    // Effacer tout le cache
    Object.keys(imageUrlCache).forEach(key => {
      delete imageUrlCache[key];
    });
  }
};
