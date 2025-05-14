
import { useState, useEffect } from 'react';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { 
  ImageType, 
  symbolToLocalImage, 
  getBestImageForSymbol,
  isValidImageUrl
} from '@/utils/symbolImageUtils';
import { 
  sanitizeImageUrl,
  processAndUpdateImage,
  getImageDescription
} from '@/services/imageValidationService';
import { fetchSymbolData, updateImageInSupabase } from '@/services/symbolImageService';
import { useToast } from './use-toast';

export interface SymbolImagesState {
  symbol: SymbolData | null;
  images: Record<ImageType, SymbolImage | null>;
  loading: boolean;
  error: boolean;
  imageErrors: Record<ImageType, boolean>;
  handleImageError: (type: ImageType) => void;
}

export const useSymbolImages = (symbolId: string | null): SymbolImagesState => {
  const [symbol, setSymbol] = useState<SymbolData | null>(null);
  const [images, setImages] = useState<Record<ImageType, SymbolImage | null>>({
    original: null,
    pattern: null,
    reuse: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<ImageType, boolean>>({
    original: false,
    pattern: false,
    reuse: false
  });
  const { toast } = useToast();

  // Gérer les erreurs d'image et appliquer le fallback
  const handleImageError = (type: ImageType) => {
    setImageErrors(prev => ({...prev, [type]: true}));
    
    // Si pas de symbole, ne rien faire
    if (!symbol || !symbolId) return;
    
    // Obtenir une image de remplacement appropriée
    const fallbackImage = getBestImageForSymbol(symbol.name, symbol.culture, type);
    
    // Mettre à jour l'état local immédiatement pour une meilleure expérience utilisateur
    setImages(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        image_url: fallbackImage,
        id: prev[type]?.id || 'temp-fallback',
        symbol_id: symbolId,
        image_type: type,
        title: type === 'original' ? 'Image originale' : 
               type === 'pattern' ? 'Motif extrait' : 'Réutilisation contemporaine',
        description: getImageDescription(symbol.name, symbol.culture, type),
        created_at: prev[type]?.created_at || null,
        // Add new fields with default values
        location: prev[type]?.location || null,
        source: prev[type]?.source || null,
        tags: prev[type]?.tags || null
      }
    }));
    
    // Mettre à jour dans la base de données
    updateImageInSupabase(
      symbolId, 
      type, 
      fallbackImage, 
      type === 'original' ? 'Image originale' : 
      type === 'pattern' ? 'Motif extrait' : 'Réutilisation contemporaine',
      getImageDescription(symbol.name, symbol.culture, type)
    );
    
    // Notification à l'utilisateur
    toast({
      title: "Image alternative chargée",
      description: `Une image alternative a été utilisée pour ${symbol.name}`,
      variant: "default",
    });
  };

  useEffect(() => {
    if (!symbolId) return;
    
    // Réinitialiser les états
    setLoading(true);
    setError(false);
    setImageErrors({original: false, pattern: false, reuse: false});
    
    const loadSymbolData = async () => {
      try {
        const { symbolData, imagesData } = await fetchSymbolData(symbolId);
        
        setSymbol(symbolData);
        
        // Organiser les images par type
        const organizedImages: Record<ImageType, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach((img: SymbolImage) => {
          if (img.image_type === 'original' || img.image_type === 'pattern' || img.image_type === 'reuse') {
            // Vérifier et nettoyer l'URL de l'image
            const sanitizedUrl = sanitizeImageUrl(img.image_url);
            organizedImages[img.image_type] = {
              ...img,
              image_url: sanitizedUrl
            };
          }
        });
        
        // Vérifier si nous devons mettre à jour ou ajouter des images
        if (symbolData) {
          // Image originale
          if (!organizedImages.original) {
            const originalImage = getBestImageForSymbol(symbolData.name, symbolData.culture, 'original');
            const success = await updateImageInSupabase(
              symbolId, 
              'original', 
              originalImage, 
              'Image originale',
              getImageDescription(symbolData.name, symbolData.culture, 'original')
            );
            
            if (success) {
              organizedImages.original = {
                id: 'temp-id-original',
                symbol_id: symbolId,
                image_url: originalImage,
                image_type: 'original',
                title: 'Image originale',
                description: getImageDescription(symbolData.name, symbolData.culture, 'original'),
                created_at: null,
                // Add new fields with default values
                location: null,
                source: null,
                tags: null
              };
            }
          } else if (organizedImages.original) {
            // Vérifier la validité de l'image existante
            const processedUrl = await processAndUpdateImage(
              symbolData.name,
              symbolData.culture,
              organizedImages.original.image_url,
              'original'
            );
            
            if (processedUrl !== organizedImages.original.image_url) {
              organizedImages.original.image_url = processedUrl;
            }
          }
          
          // Image motif (depuis les fichiers locaux)
          if (!organizedImages.pattern && symbolToLocalImage[symbolData.name]) {
            const patternImage = symbolToLocalImage[symbolData.name];
            const success = await updateImageInSupabase(
              symbolId, 
              'pattern', 
              patternImage, 
              'Motif extrait',
              getImageDescription(symbolData.name, symbolData.culture, 'pattern')
            );
            
            if (success) {
              organizedImages.pattern = {
                id: 'temp-id-pattern',
                symbol_id: symbolId,
                image_url: patternImage,
                image_type: 'pattern',
                title: 'Motif extrait',
                description: getImageDescription(symbolData.name, symbolData.culture, 'pattern'),
                created_at: null,
                // Add new fields with default values
                location: null,
                source: null,
                tags: null
              };
            }
          }
          
          // Image réutilisation
          if (!organizedImages.reuse) {
            const reuseImage = getBestImageForSymbol(symbolData.name, symbolData.culture, 'reuse');
            const success = await updateImageInSupabase(
              symbolId, 
              'reuse', 
              reuseImage, 
              'Réutilisation contemporaine',
              getImageDescription(symbolData.name, symbolData.culture, 'reuse')
            );
            
            if (success) {
              organizedImages.reuse = {
                id: 'temp-id-reuse',
                symbol_id: symbolId,
                image_url: reuseImage,
                image_type: 'reuse',
                title: 'Réutilisation contemporaine',
                description: getImageDescription(symbolData.name, symbolData.culture, 'reuse'),
                created_at: null,
                // Add new fields with default values
                location: null,
                source: null,
                tags: null
              };
            }
          } else if (organizedImages.reuse) {
            // Vérifier la validité de l'image existante
            const processedUrl = await processAndUpdateImage(
              symbolData.name,
              symbolData.culture,
              organizedImages.reuse.image_url,
              'reuse'
            );
            
            if (processedUrl !== organizedImages.reuse.image_url) {
              organizedImages.reuse.image_url = processedUrl;
            }
          }
        }
        
        setImages(organizedImages);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError(true);
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du symbole",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadSymbolData();
  }, [symbolId, toast]);

  return {
    symbol,
    images,
    loading,
    error,
    imageErrors,
    handleImageError
  };
};
