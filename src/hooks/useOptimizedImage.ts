
import { useState, useEffect, useCallback } from 'react';
import { ImageService } from '@/services/imageService';

interface UseOptimizedImageProps {
  supabaseUrl?: string;
  symbolName: string;
  culture: string;
  priority?: boolean;
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
    setLoadingProgress(10);

    console.log(`🖼️ [useOptimizedImage] Chargement pour "${symbolName}" (culture: ${culture})`);

    try {
      // D'abord, essayer de trouver une image locale optimisée
      setLoadingProgress(30);
      const localImage = ImageService.findBestLocalImage(symbolName, culture);
      console.log(`🏠 [useOptimizedImage] Image locale trouvée: ${localImage}`);
      
      // Si on a une URL Supabase ET qu'on n'a pas encore beaucoup d'échecs
      if (supabaseUrl && retryCount < 2) {
        setLoadingProgress(50);
        console.log(`🌐 [useOptimizedImage] Test image Supabase: ${supabaseUrl}`);
        
        const isValid = await ImageService.verifyImageUrl(supabaseUrl, 1); // Une seule tentative pour Supabase
        
        if (isValid) {
          console.log(`✅ [useOptimizedImage] Image Supabase valide pour "${symbolName}"`);
          setImageSource(supabaseUrl);
          setLoadingProgress(100);
          setIsLoading(false);
          return;
        } else {
          console.log(`❌ [useOptimizedImage] Image Supabase invalide pour "${symbolName}", utilisation du local`);
          setRetryCount(prev => prev + 1);
        }
      }

      // Utiliser l'image locale (qui ne sera JAMAIS "/placeholder.svg" maintenant)
      setLoadingProgress(80);
      console.log(`🏠 [useOptimizedImage] Utilisation image locale finale: ${localImage}`);
      
      setImageSource(localImage);
      setLoadingProgress(100);
      setIsLoading(false);

    } catch (error) {
      console.error(`❌ [useOptimizedImage] Erreur lors du chargement:`, error);
      setHasError(true);
      
      // Fallback vers image locale
      const localImage = ImageService.findBestLocalImage(symbolName, culture);
      console.log(`🆘 [useOptimizedImage] Fallback d'urgence vers: ${localImage}`);
      setImageSource(localImage);
      setIsLoading(false);
    }
  }, [supabaseUrl, symbolName, culture, retryCount]);

  const retryLoad = useCallback(() => {
    console.log(`🔄 [useOptimizedImage] Retry pour "${symbolName}"`);
    setRetryCount(0);
    loadImage();
  }, [loadImage, symbolName]);

  // Effet principal de chargement
  useEffect(() => {
    loadImage();
  }, [loadImage]);

  // Preloading prioritaire pour les images Supabase
  useEffect(() => {
    if (priority && supabaseUrl) {
      console.log(`⚡ [useOptimizedImage] Preloading prioritaire pour ${symbolName}`);
      ImageService.preloadImage(supabaseUrl).catch(() => {
        console.log(`⚠️ [useOptimizedImage] Preloading échoué pour ${symbolName}`);
      });
    }
  }, [supabaseUrl, symbolName, priority]);

  // Timeout de sécurité réduit
  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => {
        if (isLoading) {
          console.log(`⏰ [useOptimizedImage] Timeout pour "${symbolName}", finalisation avec image locale`);
          const localImage = ImageService.findBestLocalImage(symbolName, culture);
          setImageSource(localImage);
          setIsLoading(false);
          setHasError(true);
        }
      }, 5000); // Timeout réduit à 5 secondes

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
