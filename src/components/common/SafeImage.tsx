
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ImageOff, Loader2, Image as ImageIcon, MapPin, Link2, Tag } from 'lucide-react';
import { imageOptimizationService } from '@/services/imageOptimizationService';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: (error: Error) => void;
  loading?: 'lazy' | 'eager';
  placeholder?: React.ReactNode;
  enableOptimization?: boolean;
  preload?: boolean;
  showLoadingSpinner?: boolean;
  webpSupport?: boolean;
}

// Hook pour détecter le support WebP
const useWebPSupport = () => {
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };

    setSupportsWebP(checkWebPSupport());
  }, []);

  return supportsWebP;
};

// Hook pour le préchargement d'images
const useImagePreloader = () => {
  const preloadImage = useCallback((src: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (srcs: string[]): Promise<boolean[]> => {
    return Promise.all(srcs.map(preloadImage));
  }, [preloadImage]);

  return { preloadImage, preloadImages };
};

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className = '',
  onError,
  loading = 'lazy',
  placeholder,
  enableOptimization = false,
  preload = false,
  showLoadingSpinner = true,
  webpSupport = true
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [optimizedSrc, setOptimizedSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const supportsWebP = useWebPSupport();
  const { preloadImage } = useImagePreloader();

  // Optimiser l'image si nécessaire
  useEffect(() => {
    if (enableOptimization && src && !src.startsWith('/')) {
      const optimizeImage = async () => {
        try {
          const result = await imageOptimizationService.optimizeExistingImage(src);
          if (result?.optimizedUrl) {
            setOptimizedSrc(result.optimizedUrl);
          }
        } catch (error) {
          console.warn('Failed to optimize image:', error);
        }
      };

      optimizeImage();
    }
  }, [src, enableOptimization]);

  // Précharger l'image si demandé
  useEffect(() => {
    if (preload && currentSrc) {
      preloadImage(currentSrc).catch(() => {
        // Préchargement échoué, mais on continue normalement
      });
    }
  }, [currentSrc, preload, preloadImage]);

  // Utiliser l'image optimisée si disponible
  const imageSrc = optimizedSrc || currentSrc;

  // Générer des sources alternatives pour WebP
  const getWebPSource = useCallback((url: string) => {
    if (!webpSupport || !supportsWebP) return null;
    
    // Pour les URLs Supabase, essayer de deviner l'URL WebP
    if (url.includes('supabase') && url.includes('storage')) {
      return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return null;
  }, [supportsWebP, webpSupport]);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${imageSrc}`);
    
    const error = new Error(`Image load failed: ${imageSrc}`);
    if (onError) {
      onError(error);
    }

    // Essayer le fallback si on n'a pas déjà essayé et que le retry count est bas
    if (imageSrc !== fallbackSrc && retryCount < 2) {
      console.log(`Trying fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      // Tous les essais ont échoué
      setHasError(true);
      setIsLoading(false);
    }
  }, [imageSrc, fallbackSrc, onError, retryCount]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Observer d'intersection pour le lazy loading amélioré
  useEffect(() => {
    if (!imgRef.current || loading !== 'lazy') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Image visible, commencer le chargement
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [loading]);

  // Render d'erreur amélioré
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Image non disponible</p>
          <p className="text-xs text-slate-400 mt-1" title={alt}>{alt}</p>
          <button 
            onClick={() => {
              setCurrentSrc(src);
              setHasError(false);
              setIsLoading(true);
              setRetryCount(0);
            }}
            className="text-xs text-blue-500 hover:text-blue-700 mt-2 underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const webpSource = getWebPSource(imageSrc);

  return (
    <div className="relative">
      {isLoading && showLoadingSpinner && (
        <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg z-10 ${className}`}>
          {placeholder || (
            <div className="text-center">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">Chargement...</p>
            </div>
          )}
        </div>
      )}
      
      {webpSource && supportsWebP ? (
        <picture>
          <source srcSet={webpSource} type="image/webp" />
          <img
            ref={imgRef}
            src={loading === 'lazy' ? undefined : imageSrc}
            data-src={loading === 'lazy' ? imageSrc : undefined}
            alt={alt}
            className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
            onError={handleError}
            onLoad={handleLoad}
            loading={loading}
          />
        </picture>
      ) : (
        <img
          ref={imgRef}
          src={loading === 'lazy' ? undefined : imageSrc}
          data-src={loading === 'lazy' ? imageSrc : undefined}
          alt={alt}
          className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onError={handleError}
          onLoad={handleLoad}
          loading={loading}
        />
      )}
      
      {/* Indicateur d'optimisation */}
      {optimizedSrc && (
        <div className="absolute top-2 right-2 bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          Optimisée
        </div>
      )}
    </div>
  );
};

// Hook d'export pour préchargement d'images
export { useImagePreloader };
