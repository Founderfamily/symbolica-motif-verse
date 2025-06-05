
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyGroupImageProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackColor?: string;
}

export const LazyGroupImage: React.FC<LazyGroupImageProps> = ({
  src,
  alt,
  className,
  fallbackColor = '#3b82f6'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  if (!src || hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center text-white font-medium text-lg",
          className
        )}
        style={{ backgroundColor: fallbackColor }}
      >
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-slate-200 animate-pulse"
          style={{ backgroundColor: fallbackColor + '20' }}
        />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        loading="lazy"
      />
    </div>
  );
};

export default LazyGroupImage;
