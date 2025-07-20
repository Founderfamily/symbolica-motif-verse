
import { supabase } from '@/integrations/supabase/client';
import { logger } from './logService';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
}

export interface OptimizedImageResult {
  originalUrl: string;
  optimizedUrl: string;
  webpUrl?: string;
  thumbnailUrl?: string;
  compressionRatio: number;
  originalSize: number;
  optimizedSize: number;
}

/**
 * Service centralisé pour l'optimisation des images
 */
export class ImageOptimizationService {
  private cache = new Map<string, OptimizedImageResult>();

  /**
   * Compresse et optimise une image
   */
  async optimizeImage(
    file: File,
    options: ImageOptimizationOptions = {}
  ): Promise<{ optimizedFile: File; metadata: any }> {
    const {
      maxWidth = 1200,
      maxHeight = 1200,
      quality = 0.85,
      format = 'webp'
    } = options;

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculer les nouvelles dimensions en gardant le ratio
          const { width: newWidth, height: newHeight } = this.calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
          );

          canvas.width = newWidth;
          canvas.height = newHeight;

          // Dessiner l'image redimensionnée
          ctx?.drawImage(img, 0, 0, newWidth, newHeight);

          // Convertir en blob avec compression
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to optimize image'));
                return;
              }

              const optimizedFile = new File([blob], file.name, {
                type: `image/${format}`,
                lastModified: Date.now()
              });

              const metadata = {
                originalSize: file.size,
                optimizedSize: blob.size,
                compressionRatio: ((file.size - blob.size) / file.size * 100).toFixed(1),
                originalDimensions: { width: img.width, height: img.height },
                optimizedDimensions: { width: newWidth, height: newHeight },
                format
              };

              logger.info('Image optimized successfully', metadata);
              resolve({ optimizedFile, metadata });
            },
            `image/${format}`,
            quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image for optimization'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Génère plusieurs formats d'une image
   */
  async generateMultipleFormats(
    file: File,
    formats: ('webp' | 'jpeg' | 'png')[] = ['webp', 'jpeg']
  ): Promise<{ [key: string]: File }> {
    const results: { [key: string]: File } = {};

    for (const format of formats) {
      try {
        const { optimizedFile } = await this.optimizeImage(file, { format });
        results[format] = optimizedFile;
      } catch (error) {
        logger.error(`Failed to generate ${format} format`, { error });
      }
    }

    return results;
  }

  /**
   * Crée une miniature
   */
  async createThumbnail(
    file: File,
    size: number = 200
  ): Promise<File> {
    const { optimizedFile } = await this.optimizeImage(file, {
      maxWidth: size,
      maxHeight: size,
      quality: 0.7,
      format: 'webp'
    });

    return new File([optimizedFile], `thumb_${file.name}`, {
      type: optimizedFile.type,
      lastModified: Date.now()
    });
  }

  /**
   * Upload une image optimisée vers Supabase Storage
   */
  async uploadOptimizedImage(
    file: File,
    bucket: string,
    path: string,
    options: ImageOptimizationOptions = {}
  ): Promise<OptimizedImageResult | null> {
    try {
      // Optimiser l'image principale
      const { optimizedFile, metadata } = await this.optimizeImage(file, options);
      
      // Créer une miniature
      const thumbnail = await this.createThumbnail(file);
      
      // Générer version WebP si pas déjà en WebP
      const formats = await this.generateMultipleFormats(file, ['webp', 'jpeg']);

      // Upload des fichiers
      const uploads = await Promise.allSettled([
        this.uploadFile(optimizedFile, bucket, path),
        this.uploadFile(thumbnail, bucket, `thumbs/${path}`),
        ...(formats.webp ? [this.uploadFile(formats.webp, bucket, `webp/${path}`)] : [])
      ]);

      const successfulUploads = uploads
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);

      if (successfulUploads.length === 0) {
        throw new Error('All uploads failed');
      }

      const result: OptimizedImageResult = {
        originalUrl: file.name,
        optimizedUrl: successfulUploads[0],
        thumbnailUrl: successfulUploads[1],
        webpUrl: successfulUploads[2],
        compressionRatio: parseFloat(metadata.compressionRatio),
        originalSize: metadata.originalSize,
        optimizedSize: metadata.optimizedSize
      };

      // Mettre en cache
      this.cache.set(path, result);

      return result;
    } catch (error) {
      logger.error('Failed to upload optimized image', { error, path });
      return null;
    }
  }

  /**
   * Upload un fichier vers Supabase Storage
   */
  private async uploadFile(file: File, bucket: string, path: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  /**
   * Calcule les nouvelles dimensions en gardant le ratio
   */
  private calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
  ): { width: number; height: number } {
    let width = originalWidth;
    let height = originalHeight;

    // Redimensionner si nécessaire
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }

    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  /**
   * Vérifie si une image a besoin d'optimisation
   */
  async needsOptimization(
    imageUrl: string,
    thresholds = { size: 500000, width: 1920, height: 1920 }
  ): Promise<boolean> {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      const size = parseInt(response.headers.get('content-length') || '0');
      
      if (size > thresholds.size) return true;

      // Vérifier les dimensions
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          resolve(img.width > thresholds.width || img.height > thresholds.height);
        };
        img.onerror = () => resolve(false);
        img.src = imageUrl;
      });
    } catch {
      return false;
    }
  }

  /**
   * Optimise une image existante par URL
   */
  async optimizeExistingImage(imageUrl: string): Promise<OptimizedImageResult | null> {
    try {
      if (this.cache.has(imageUrl)) {
        return this.cache.get(imageUrl)!;
      }

      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'image.jpg', { type: blob.type });

      // Pour une optimisation d'image existante, on utilise juste l'optimisation locale
      const { optimizedFile, metadata } = await this.optimizeImage(file);
      
      const result: OptimizedImageResult = {
        originalUrl: imageUrl,
        optimizedUrl: URL.createObjectURL(optimizedFile),
        compressionRatio: parseFloat(metadata.compressionRatio),
        originalSize: metadata.originalSize,
        optimizedSize: metadata.optimizedSize
      };

      this.cache.set(imageUrl, result);
      return result;
    } catch (error) {
      logger.error('Failed to optimize existing image', { error, imageUrl });
      return null;
    }
  }

  /**
   * Nettoie le cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Obtient les statistiques du cache
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    };
  }
}

export const imageOptimizationService = new ImageOptimizationService();
