
import { useState, useEffect } from 'react';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { symbolMappingService } from '@/services/symbolMappingService';

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

  // Static images mapping for our symbols
  const getImagePath = (symbolName: string): string => {
    const imageMap: Record<string, string> = {
      'Triskèle Celtique': '/images/symbols/triskelion.png',
      'Fleur de Lys': '/images/symbols/fleur-de-lys.png',
      'Mandala': '/images/symbols/mandala.png',
      'Méandre Grec': '/images/symbols/greek-meander.png',
      'Symbole Adinkra': '/images/symbols/adinkra.png',
      'Motif Seigaiha': '/images/symbols/seigaiha.png',
      'Yin et Yang': '/images/symbols/mandala.png', // Fallback
      'Ankh': '/images/symbols/adinkra.png', // Fallback
      'Hamsa': '/images/symbols/mandala.png', // Fallback
      'Attrape-rêves': '/images/symbols/aboriginal.png',
      'Arabesque': '/images/symbols/arabesque.png',
      'Rune Viking': '/images/symbols/viking.png'
    };
    
    return imageMap[symbolName] || '/placeholder.svg';
  };

  useEffect(() => {
    if (!symbolId) {
      setLoading(false);
      setSymbol(null);
      setImages({ original: null, pattern: null, reuse: null });
      return;
    }
    
    console.log('🔍 [useSymbolImages] Loading symbol:', symbolId);
    
    // Reset states when symbolId changes
    setLoading(true);
    setError(false);
    setImageErrors({
      original: false,
      pattern: false,
      reuse: false
    });

    // Convert symbolId to index and get symbol from static data
    const numericIndex = parseInt(symbolId, 10);
    let foundSymbol = null;
    
    if (!isNaN(numericIndex)) {
      // Get symbol by index
      foundSymbol = symbolMappingService.getSymbolByIndex(numericIndex);
    } else {
      // Try to find by name
      const result = symbolMappingService.findSymbolByName(symbolId);
      foundSymbol = result?.symbol || null;
    }
    
    if (!foundSymbol) {
      console.error('❌ [useSymbolImages] Symbol not found:', symbolId);
      setError(true);
      setLoading(false);
      return;
    }

    console.log('✅ [useSymbolImages] Symbol found:', foundSymbol.name);
    
    // Convert static symbol to SymbolData format
    const symbolData: SymbolData = {
      id: symbolId,
      name: foundSymbol.name,
      culture: foundSymbol.culture,
      period: foundSymbol.period,
      description: foundSymbol.description,
      function: foundSymbol.function || [],
      technique: foundSymbol.technique || [],
      medium: foundSymbol.medium || [],
      created_at: '',
      updated_at: '',
      translations: {}
    };
    
    setSymbol(symbolData);
    
    // Get image path for this symbol
    const imagePath = getImagePath(foundSymbol.name);
    
    // Create mock SymbolImage objects
    const mockImages: Record<string, SymbolImage | null> = {
      original: {
        id: `${symbolId}-original`,
        symbol_id: symbolId,
        image_url: imagePath,
        image_type: 'original' as const,
        title: null,
        description: null,
        location: null,
        source: null,
        tags: null,
        uploaded_by: 'system',
        created_at: '',
        updated_at: ''
      },
      pattern: {
        id: `${symbolId}-pattern`,
        symbol_id: symbolId,
        image_url: imagePath,
        image_type: 'pattern' as const,
        title: null,
        description: null,
        location: null,
        source: null,
        tags: null,
        uploaded_by: 'system',
        created_at: '',
        updated_at: ''
      },
      reuse: null // Pas d'image de réutilisation pour le moment
    };
    
    setImages(mockImages);
    setLoading(false);
  }, [symbolId]);

  const handleImageError = (type: string) => {
    console.warn(`🖼️ [useSymbolImages] Image error for type: ${type}`);
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
    handleImageError
  };
};
