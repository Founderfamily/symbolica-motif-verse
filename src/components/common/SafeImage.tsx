
import React, { useState, useCallback } from 'react';
import { ImageOff } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: (error: Error) => void;
  loading?: 'lazy' | 'eager';
  placeholder?: React.ReactNode;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className = '',
  onError,
  loading = 'lazy',
  placeholder
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((event: React.SyntheticEvent<HTMLImageElement>) => {
    console.warn(`Failed to load image: ${currentSrc}`);
    
    const error = new Error(`Image load failed: ${currentSrc}`);
    if (onError) {
      onError(error);
    }

    // Try fallback if we haven't already and retry count is low
    if (currentSrc !== fallbackSrc && retryCount < 2) {
      console.log(`Trying fallback image: ${fallbackSrc}`);
      setCurrentSrc(fallbackSrc);
      setRetryCount(prev => prev + 1);
      setIsLoading(true);
      setHasError(false);
    } else {
      // All attempts failed
      setHasError(true);
      setIsLoading(false);
    }
  }, [currentSrc, fallbackSrc, onError, retryCount]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // If all attempts failed, show error state
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg ${className}`}>
        <div className="text-center p-4">
          <ImageOff className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-500">Image non disponible</p>
          <p className="text-xs text-slate-400 mt-1">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && placeholder && (
        <div className={`absolute inset-0 flex items-center justify-center bg-slate-100 rounded-lg ${className}`}>
          {placeholder}
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading={loading}
      />
    </div>
  );
};

// Hook for preloading images
export const useImagePreloader = () => {
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
