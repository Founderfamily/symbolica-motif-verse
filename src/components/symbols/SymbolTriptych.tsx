
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from '@/integrations/supabase/client';
import { SymbolData, SymbolImage } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader2 } from 'lucide-react';

// Image de remplacement locale en cas d'erreur
const PLACEHOLDER = "/placeholder.svg";

// Définir les types d'images autorisés
type ImageType = 'original' | 'pattern' | 'reuse';

interface SymbolTriptychProps {
  symbolId: string | null;
}

const SymbolTriptych: React.FC<SymbolTriptychProps> = ({ symbolId }) => {
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

  // Mapping des noms de symboles aux chemins d'images locales
  const symbolToLocalImage: Record<string, string> = {
    "Triskèle celtique": "/images/symbols/triskelion.png",
    "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
    "Méandre grec": "/images/symbols/greek-meander.png",
    "Mandala": "/images/symbols/mandala.png",
    "Symbole Adinkra": "/images/symbols/adinkra.png",
    "Motif Seigaiha": "/images/symbols/seigaiha.png",
    "Art aborigène": "/images/symbols/aboriginal.png",
    "Motif viking": "/images/symbols/viking.png",
    "Arabesque": "/images/symbols/arabesque.png",
    "Motif aztèque": "/images/symbols/aztec.png"
  };

  // Mapping des cultures aux images de réutilisation plus pertinentes
  const cultureToReuseImage: Record<string, string> = {
    "Celtique": "https://images.unsplash.com/photo-1607439039734-c662293d51e3?q=80&w=800",
    "Française": "https://images.unsplash.com/photo-1540162012087-080d9acf0da0?q=80&w=800",
    "Grecque": "https://images.unsplash.com/photo-1603566541830-926010260166?q=80&w=800",
    "Indienne": "https://images.unsplash.com/photo-1534430480872-3498386a78e0?q=80&w=800",
    "Ashanti": "https://images.unsplash.com/photo-1603397023583-74b3ca45222f?q=80&w=800",
    "Japonaise": "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800",
    "Aborigène": "https://images.unsplash.com/photo-1535082623926-b39352a03fb7?q=80&w=800",
    "Nordique": "https://images.unsplash.com/photo-1560273313-28f297ab3a66?q=80&w=800",
    "Islamique": "https://images.unsplash.com/photo-1585236243288-126dd5ee0769?q=80&w=800",
    "Mésoaméricaine": "https://images.unsplash.com/photo-1559403128-d1fbe6983f62?q=80&w=800"
  };
  
  // Fonction pour mettre à jour automatiquement l'image dans Supabase
  const updateImageInSupabase = async (
    symbolId: string, 
    imageType: ImageType, 
    imageUrl: string, 
    title: string, 
    description: string = ''
  ) => {
    try {
      // Vérifier si l'image existe déjà
      const { data: existingImage, error: queryError } = await supabase
        .from('symbol_images')
        .select('id')
        .eq('symbol_id', symbolId)
        .eq('image_type', imageType)
        .single();
      
      if (queryError && queryError.code !== 'PGRST116') { // PGRST116 est l'erreur "No rows returned"
        throw queryError;
      }
      
      if (existingImage) {
        // Mettre à jour l'image existante
        const { error } = await supabase
          .from('symbol_images')
          .update({
            image_url: imageUrl,
            title: title,
            description: description || null
          })
          .eq('id', existingImage.id);
          
        if (error) throw error;
      } else {
        // Créer une nouvelle entrée
        const { error } = await supabase
          .from('symbol_images')
          .insert({
            symbol_id: symbolId,
            image_url: imageUrl,
            image_type: imageType,
            title: title,
            description: description || null
          });
          
        if (error) throw error;
      }
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'image ${imageType}:`, error);
      return false;
    }
  };

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
      updateImageInSupabase(
        symbolId!, 
        type, 
        fallbackImage, 
        'Motif extrait',
        `Extraction graphique du symbole ${symbol.name}`
      );
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
      updateImageInSupabase(
        symbolId!, 
        type, 
        fallbackImage, 
        'Réutilisation contemporaine',
        `Application moderne du symbole dans la culture ${symbol.culture}`
      );
    }
  };

  useEffect(() => {
    if (!symbolId) return;
    
    // Réinitialiser les états
    setLoading(true);
    setError(false);
    setImageErrors({original: false, pattern: false, reuse: false});
    
    const fetchSymbolData = async () => {
      try {
        // Récupérer les infos du symbole
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', symbolId)
          .single();
        
        if (symbolError) throw symbolError;
        setSymbol(symbolData);
        
        // Récupérer les images du symbole
        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', symbolId);
        
        if (imagesError) throw imagesError;
        
        // Organiser les images par type
        const organizedImages: Record<ImageType, SymbolImage | null> = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          if (img.image_type === 'original' || img.image_type === 'pattern' || img.image_type === 'reuse') {
            organizedImages[img.image_type] = img;
          }
        });
        
        // Vérifier si nous devons mettre à jour ou ajouter des images automatiquement
        if (symbolData) {
          // Image originale (depuis unsplash)
          if (!organizedImages.original) {
            // Utiliser une image Unsplash pour l'original
            const originalImage = `https://source.unsplash.com/featured/?${encodeURIComponent(symbolData.culture.toLowerCase())}+symbol`;
            const success = await updateImageInSupabase(
              symbolId, 
              'original', 
              originalImage, 
              'Image originale',
              `Représentation artistique d'un ${symbolData.name}`
            );
            
            if (success) {
              organizedImages.original = {
                id: 'temp-id-original',
                symbol_id: symbolId,
                image_url: originalImage,
                image_type: 'original',
                title: 'Image originale',
                description: `Représentation artistique d'un ${symbolData.name}`,
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
          
          // Image réutilisation (basée sur la culture)
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
    
    fetchSymbolData();
  }, [symbolId, toast]);
  
  if (!symbolId) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-inner">
        <p className="text-slate-500 text-lg">Sélectionnez un symbole pour voir ses détails</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-amber-50 rounded-lg animate-pulse">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="mt-4 text-amber-800">Chargement des données du symbole...</p>
        </div>
      </div>
    );
  }
  
  if (error || !symbol) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-slate-800 text-lg">Erreur de chargement</p>
        <p className="text-slate-500">Impossible de charger les données du symbole</p>
      </div>
    );
  }
  
  const renderImage = (type: ImageType, title: string) => {
    const image = images[type];
    const hasError = imageErrors[type];
    const imageUrl = image?.image_url || PLACEHOLDER;
    
    return (
      <div className="flex flex-col space-y-3">
        <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
          <AspectRatio ratio={1} className="bg-slate-50 relative overflow-hidden">
            {!image && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={`${symbol?.name || 'Symbol'} - ${title}`}
              className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${!image ? 'opacity-0' : 'opacity-100'}`}
              crossOrigin="anonymous"
              onError={() => handleImageError(type)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {hasError && (
              <div className="absolute top-2 right-2 z-20">
                <div className="bg-amber-100 text-amber-600 p-1 rounded-full">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
            )}
          </AspectRatio>
        </div>
        <div className="text-center">
          <h4 className="text-sm font-medium text-slate-800">{image?.title || title}</h4>
          {image?.description && (
            <p className="text-xs text-slate-600 mt-1">{image.description}</p>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-lg p-6 relative">
      {/* Background pattern */}
      <div className="absolute -z-10 inset-0 opacity-[0.03] pattern-dots-lg"></div>
      
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{symbol?.name}</h2>
        {symbol && (
          <p className="text-sm text-slate-600 mt-1 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{background: `var(--color-${symbol.culture.toLowerCase()})`}}></span>
            {symbol.culture} · {symbol.period}
          </p>
        )}
        {symbol?.description && (
          <p className="text-slate-700 mt-3 leading-relaxed">{symbol.description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderImage('original', 'Image originale')}
        {renderImage('pattern', 'Extraction du motif')}
        {renderImage('reuse', 'Nouvelle utilisation')}
      </div>
    </div>
  );
};

export default SymbolTriptych;
