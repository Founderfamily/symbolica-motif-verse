
// src/hooks/useSymbolImages.ts
import { useState, useEffect } from 'react';
import { fetchSymbolData } from '@/services/symbolImageService';
import { SymbolData, SymbolImage } from '@/types/supabase';

export const useSymbolImages = (symbolId: string | null) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<SymbolData | null>(null);
  const [images, setImages] = useState<Record<string, SymbolImage | null>>({
    original: null,
    pattern: null,
    reuse: null
  });
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({
    original: false,
    pattern: false,
    reuse: false
  });

  useEffect(() => {
    if (!symbolId) {
      setLoading(false);
      return;
    }
    
    // Reset states when symbolId changes
    setLoading(true);
    setError(false);
    setImageErrors({
      original: false,
      pattern: false,
      reuse: false
    });

    const loadSymbolData = async () => {
      try {
        const { symbolData, imagesData } = await fetchSymbolData(symbolId);
        
        // Cast the data to the correct types
        const typedSymbolData: SymbolData = {
          ...symbolData,
          translations: symbolData.translations as SymbolData['translations']
        };
        
        setSymbol(typedSymbolData);
        
        // Organize images by type
        const organizedImages: Record<string, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          const typedImage: SymbolImage = {
            ...img,
            translations: img.translations as SymbolImage['translations']
          };
          organizedImages[img.image_type] = typedImage;
        });
        
        setImages(organizedImages);
      } catch (err) {
        console.error('Error fetching symbol data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    loadSymbolData();
  }, [symbolId]);

  const handleImageError = (type: string) => {
    setImageErrors(prev => ({
      ...prev,
      [type]: true
    }));
  };

  return {
    loading,
    error,
    symbol,
    images,
    imageErrors,
    handleImageError,
    // Add the data property for backward compatibility
    data: imagesData => imagesData?.find(img => img.image_type === 'pattern') || imagesData?.[0] || null
  };
};
