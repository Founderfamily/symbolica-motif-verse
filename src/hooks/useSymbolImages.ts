
import { useState, useEffect } from 'react';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { ImageType, symbolToLocalImage, cultureToReuseImage } from '@/utils/symbolImageUtils';
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
    
    // Appliquer automatiquement un fallback approprié
    if (type === 'pattern' && symbol && symbolToLocalImage[symbol.name]) {
      const fallbackImage = symbolToLocalImage[symbol.name];
      
      // Mettre à jour l'état local immédiatement pour une meilleure expérience utilisateur
      setImages(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          image_url: fallbackImage,
          id: prev[type]?.id || 'temp-fallback',
          symbol_id: symbolId || 'temp-id',
          image_type: type,
          title: prev[type]?.title || 'Motif extrait',
          description: prev[type]?.description || `Extraction graphique du symbole ${symbol.name}`,
          created_at: prev[type]?.created_at || null
        }
      }));
      
      // Mettre à jour dans la base de données pour les futurs chargements
      if (symbolId) {
        updateImageInSupabase(
          symbolId, 
          type, 
          fallbackImage, 
          'Motif extrait',
          `Extraction graphique du symbole ${symbol.name}`
        );
      }
    } 
    else if (type === 'reuse' && symbol && cultureToReuseImage[symbol.culture]) {
      const fallbackImage = cultureToReuseImage[symbol.culture];
      
      // Mettre à jour l'état local immédiatement
      setImages(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          image_url: fallbackImage,
          id: prev[type]?.id || 'temp-fallback',
          symbol_id: symbolId || 'temp-id',
          image_type: type,
          title: prev[type]?.title || 'Réutilisation contemporaine',
          description: prev[type]?.description || `Application moderne du symbole dans la culture ${symbol.culture}`,
          created_at: prev[type]?.created_at || null
        }
      }));
      
      // Mettre à jour dans la base de données
      if (symbolId) {
        updateImageInSupabase(
          symbolId, 
          type, 
          fallbackImage, 
          'Réutilisation contemporaine',
          `Application moderne du symbole dans la culture ${symbol.culture}`
        );
      }
    }
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
            organizedImages[img.image_type] = img;
          }
        });
        
        // Vérifier si nous devons mettre à jour ou ajouter des images automatiquement
        if (symbolData) {
          // Image originale (images de musées ou historiques)
          if (!organizedImages.original) {
            // Utiliser une image culturelle authentique pour l'original plutôt qu'une image générique
            const culturalKeywords = `authentic+${symbolData.culture.toLowerCase()}+${symbolData.name.toLowerCase().replace(/\s+/g, '+')}+historical`;
            const originalImage = `https://source.unsplash.com/featured/?${encodeURIComponent(culturalKeywords)}`;
            const success = await updateImageInSupabase(
              symbolId, 
              'original', 
              originalImage, 
              'Image originale',
              `Représentation historique authentique de ${symbolData.name}`
            );
            
            if (success) {
              organizedImages.original = {
                id: 'temp-id-original',
                symbol_id: symbolId,
                image_url: originalImage,
                image_type: 'original',
                title: 'Image originale',
                description: `Représentation historique authentique de ${symbolData.name}`,
                created_at: null
              };
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
              `Extraction graphique du symbole ${symbolData.name}`
            );
            
            if (success) {
              organizedImages.pattern = {
                id: 'temp-id-pattern',
                symbol_id: symbolId,
                image_url: patternImage,
                image_type: 'pattern',
                title: 'Motif extrait',
                description: `Extraction graphique du symbole ${symbolData.name}`,
                created_at: null
              };
            }
          }
          
          // Image réutilisation (basée sur la culture - exemples concrets)
          if (!organizedImages.reuse && cultureToReuseImage[symbolData.culture]) {
            const reuseImage = cultureToReuseImage[symbolData.culture];
            const success = await updateImageInSupabase(
              symbolId, 
              'reuse', 
              reuseImage, 
              'Réutilisation contemporaine',
              `Application moderne du symbole dans la culture ${symbolData.culture}`
            );
            
            if (success) {
              organizedImages.reuse = {
                id: 'temp-id-reuse',
                symbol_id: symbolId,
                image_url: reuseImage,
                image_type: 'reuse',
                title: 'Réutilisation contemporaine',
                description: `Application moderne du symbole dans la culture ${symbolData.culture}`,
                created_at: null
              };
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
