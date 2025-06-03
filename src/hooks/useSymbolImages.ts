
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

  // Static images mapping for our predefined symbols
  const staticImagesMap: Record<string, Record<string, string>> = {
    'triskele-1': {
      pattern: '/images/symbols/triskelion.png',
      original: '/images/symbols/triskelion.png'
    },
    'fleur-lys-2': {
      pattern: '/images/symbols/fleur-de-lys.png',
      original: '/images/symbols/fleur-de-lys.png'
    },
    'mandala-3': {
      pattern: '/images/symbols/mandala.png',
      original: '/images/symbols/mandala.png'
    },
    'meandre-4': {
      pattern: '/images/symbols/greek-meander.png',
      original: '/images/symbols/greek-meander.png'
    },
    'adinkra-5': {
      pattern: '/images/symbols/adinkra.png',
      original: '/images/symbols/adinkra.png'
    }
  };

  // Static symbol data
  const staticSymbolsData: Record<string, SymbolData> = {
    'triskele-1': {
      id: 'triskele-1',
      name: 'Triskèle Celtique',
      culture: 'Celtique',
      period: 'Antiquité',
      description: 'Symbole celtique à trois branches représentant l\'éternité, le mouvement et l\'équilibre.',
      significance: 'Représente les trois domaines : terre, mer et ciel',
      historical_context: 'Utilisé par les druides celtes',
      related_symbols: [],
      tags: ['celtique', 'spirituel', 'éternité'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Celtic Triskele',
          culture: 'Celtic',
          period: 'Antiquity',
          description: 'Celtic symbol with three branches representing eternity, movement and balance.'
        }
      }
    },
    'fleur-lys-2': {
      id: 'fleur-lys-2',
      name: 'Fleur de Lys',
      culture: 'Française',
      period: 'Moyen Âge',
      description: 'Emblème royal français symbolisant la pureté, la souveraineté et la royauté.',
      significance: 'Symbole de la monarchie française',
      historical_context: 'Adopté par les rois de France',
      related_symbols: [],
      tags: ['royal', 'français', 'monarchie'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Fleur-de-lis',
          culture: 'French',
          period: 'Middle Ages',
          description: 'French royal emblem symbolizing purity, sovereignty and royalty.'
        }
      }
    },
    'mandala-3': {
      id: 'mandala-3',
      name: 'Mandala',
      culture: 'Indienne',
      period: 'Antiquité',
      description: 'Diagramme cosmique circulaire utilisé pour la méditation et les rituels spirituels.',
      significance: 'Représente l\'univers et l\'harmonie cosmique',
      historical_context: 'Tradition hindoue et bouddhiste',
      related_symbols: [],
      tags: ['spirituel', 'méditation', 'cosmique'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Mandala',
          culture: 'Indian',
          period: 'Antiquity',
          description: 'Circular cosmic diagram used for meditation and spiritual rituals.'
        }
      }
    },
    'meandre-4': {
      id: 'meandre-4',
      name: 'Méandre Grec',
      culture: 'Grecque',
      period: 'Antiquité',
      description: 'Motif géométrique représentant l\'éternité et l\'infini dans l\'art grec ancien.',
      significance: 'Symbole de l\'éternité et du labyrinthe de la vie',
      historical_context: 'Décorations grecques et romaines',
      related_symbols: [],
      tags: ['géométrique', 'éternité', 'grec'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Greek Meander',
          culture: 'Greek',
          period: 'Antiquity',
          description: 'Geometric pattern representing eternity and infinity in ancient Greek art.'
        }
      }
    },
    'adinkra-5': {
      id: 'adinkra-5',
      name: 'Symbole Adinkra',
      culture: 'Africaine',
      period: 'Traditionnel',
      description: 'Symboles visuels akan du Ghana véhiculant des proverbes et concepts philosophiques.',
      significance: 'Transmission de sagesse et valeurs culturelles',
      historical_context: 'Tradition akan du Ghana',
      related_symbols: [],
      tags: ['africain', 'sagesse', 'proverbe'],
      created_at: '',
      updated_at: '',
      translations: {
        en: {
          name: 'Adinkra Symbol',
          culture: 'African',
          period: 'Traditional',
          description: 'Akan visual symbols from Ghana conveying proverbs and philosophical concepts.'
        }
      }
    }
  };

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

    // Check if this is a static symbol
    if (staticSymbolsData[symbolId] && staticImagesMap[symbolId]) {
      // Handle static symbol data
      console.log('Loading static symbol data for:', symbolId);
      
      const symbolData = staticSymbolsData[symbolId];
      const imageUrls = staticImagesMap[symbolId];
      
      setSymbol(symbolData);
      
      // Create mock SymbolImage objects for static images
      const mockImages: Record<string, SymbolImage | null> = {
        original: imageUrls.original ? {
          id: `${symbolId}-original`,
          symbol_id: symbolId,
          image_url: imageUrls.original,
          image_type: 'original' as const,
          uploaded_by: 'system',
          created_at: '',
          updated_at: ''
        } : null,
        pattern: imageUrls.pattern ? {
          id: `${symbolId}-pattern`,
          symbol_id: symbolId,
          image_url: imageUrls.pattern,
          image_type: 'pattern' as const,
          uploaded_by: 'system',
          created_at: '',
          updated_at: ''
        } : null,
        reuse: null
      };
      
      setImages(mockImages);
      setLoading(false);
      return;
    }

    // For non-static symbols, use the original API call
    const loadSymbolData = async () => {
      try {
        const { symbolData, imagesData } = await fetchSymbolData(symbolId);
        
        setSymbol(symbolData);
        
        // Organize images by type
        const organizedImages: Record<string, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          organizedImages[img.image_type] = img;
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
    data: (imagesData: SymbolImage[] | undefined) => imagesData?.find(img => img.image_type === 'pattern') || imagesData?.[0] || null
  };
};
