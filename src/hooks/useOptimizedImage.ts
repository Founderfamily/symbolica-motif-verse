
import { useState, useEffect, useCallback } from 'react';
import { ImageService } from '@/services/imageService';

interface UseOptimizedImageProps {
  supabaseUrl?: string;
  symbolName: string;
  culture: string;
  priority?: boolean; // Pour le preloading prioritaire
}

interface UseOptimizedImageReturn {
  imageSource: string;
  isLoading: boolean;
  hasError: boolean;
  isLocalImage: boolean;
  retryLoad: () => void;
  loadingProgress: number;
}

export const useOptimizedImage = ({
  supabaseUrl,
  symbolName,
  culture,
  priority = false
}: UseOptimizedImageProps): UseOptimizedImageReturn => {
  const [imageSource, setImageSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const loadImage = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    setLoadingProgress(20);

    console.log(`🖼️ [useOptimizedImage] Chargement image pour "${symbolName}"`);

    try {
      // Essayer d'abord l'image Supabase si disponible
      if (supabaseUrl && retryCount < 2) {
        setLoadingProgress(40);
        console.log(`🌐 [useOptimizedImage] Tentative Supabase: ${supabaseUrl}`);
        
        const isValid = await ImageService.verifyImageUrl(supabaseUrl, 2);
        
        if (isValid) {
          console.log(`✅ [useOptimizedImage] Image Supabase valide pour "${symbolName}"`);
          setImageSource(supabaseUrl);
          setLoadingProgress(100);
          setIsLoading(false);
          return;
        } else {
          console.log(`❌ [useOptimizedImage] Image Supabase invalide pour "${symbolName}"`);
          setRetryCount(prev => prev + 1);
        }
      }

      // Fallback vers image locale
      setLoadingProgress(70);
      const localImage = ImageService.findBestLocalImage(symbolName, culture);
      console.log(`🏠 [useOptimizedImage] Utilisation image locale: ${localImage}`);
      
      setImageSource(localImage);
      setLoadingProgress(100);
      setIsLoading(false);

    } catch (error) {
      console.error(`❌ [useOptimizedImage] Erreur lors du chargement:`, error);
      setHasError(true);
      
      // Fallback final vers image locale
      const localImage = ImageService.findBestLocalImage(symbolName, culture);
      setImageSource(localImage);
      setIsLoading(false);
    }
  }, [supabaseUrl, symbolName, culture, retryCount]);

  const retryLoad = useCallback(() => {
    setRetryCount(0);
    loadImage();
  }, [loadImage]);

  // Effet principal de chargement
  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // Preloading prioritaire
  useEffect(() => {
    if (priority && supabaseUrl) {
      ImageService.preloadImage(supabaseUrl).catch(() => {
        console.log(`⚠️ [useOptimizedImage] Preloading échoué pour ${symbolName}`);
      });
    }
  }, [supabaseUrl, symbolName, priority]);

  // Timeout de sécurité
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log(`⏰ [useOptimizedImage] Timeout pour "${symbolName}", utilisation du fallback`);
          const localImage = ImageService.findBestLocalImage(symbolName, culture);
          setImageSource(localImage);
          setIsLoading(false);
          setHasError(true);
        }
      }, 8000); // Timeout augmenté à 8 secondes

      return () => clearTimeout(timeout);
    }
  }, [isLoading, symbolName, culture]);

  const isLocalImage = imageSource.startsWith('/');

  return {
    imageSource,
    isLoading,
    hasError,
    isLocalImage,
    retryLoad,
    loadingProgress
  };
};
