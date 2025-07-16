
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { Info, AlertCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { getSymbolThemeColor } from '@/utils/symbolImageUtils';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { useSymbolVerification } from '@/hooks/useSymbolVerification';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { Link } from 'react-router-dom';

interface SymbolCardProps {
  symbol: SymbolData;
}

// Mapping amélioré des images locales avec plus de variations de noms
const symbolToLocalImageEnhanced: Record<string, string> = {
  // Variations pour Triskèle
  "Triskèle Celtique": "/images/symbols/triskelion.png",
  "Triskèle celtique": "/images/symbols/triskelion.png",
  "Triskelion": "/images/symbols/triskelion.png",
  "Triskell": "/images/symbols/triskelion.png",
  "Triskell celtique": "/images/symbols/triskelion.png",
  
  // Variations pour Fleur de Lys
  "Fleur de Lys": "/images/symbols/fleur-de-lys.png",
  "Fleur de lys": "/images/symbols/fleur-de-lys.png",
  "Fleur-de-lys": "/images/symbols/fleur-de-lys.png",
  
  // Variations pour Méandre
  "Méandre Grec": "/images/symbols/greek-meander.png",
  "Méandre grec": "/images/symbols/greek-meander.png",
  "Greek Meander": "/images/symbols/greek-meander.png",
  "Meander": "/images/symbols/greek-meander.png",
  
  // Variations pour Mandala
  "Mandala": "/images/symbols/mandala.png",
  "Mandala Indien": "/images/symbols/mandala.png",
  "Mandala indien": "/images/symbols/mandala.png",
  "Mandala Bouddhiste": "/images/symbols/mandala.png",
  
  // Variations pour Adinkra
  "Symbole Adinkra": "/images/symbols/adinkra.png",
  "Adinkra": "/images/symbols/adinkra.png",
  "Adinkra Symbol": "/images/symbols/adinkra.png",
  
  // Variations pour Seigaiha
  "Motif Seigaiha": "/images/symbols/seigaiha.png",
  "Seigaiha": "/images/symbols/seigaiha.png",
  "Vagues Japonaises": "/images/symbols/seigaiha.png",
  
  // Nouveaux mappings pour les symboles problématiques
  "Hamsa": "/images/symbols/mandala.png", // Utiliser mandala comme fallback
  "Main de Fatma": "/images/symbols/mandala.png",
  "Khamsa": "/images/symbols/mandala.png",
  
  // Symboles spirituels
  "Yin Yang": "/images/symbols/mandala.png",
  "Yin et Yang": "/images/symbols/mandala.png",
  "Om": "/images/symbols/mandala.png",
  "Aum": "/images/symbols/mandala.png",
  
  // Symboles égyptiens
  "Ankh": "/images/symbols/adinkra.png",
  "Croix de Vie": "/images/symbols/adinkra.png",
  "Œil d'Horus": "/images/symbols/adinkra.png",
  
  // Symboles nordiques/vikings
  "Mjöllnir": "/images/symbols/viking.png",
  "Marteau de Thor": "/images/symbols/viking.png",
  "Valknut": "/images/symbols/viking.png",
  "Runes": "/images/symbols/viking.png",
  
  // Symboles amérindiens
  "Attrape-rêves": "/images/symbols/triskelion.png",
  "Dreamcatcher": "/images/symbols/triskelion.png",
  "Plume Sacrée": "/images/symbols/triskelion.png",
  
  // Symboles aztèques/mayas
  "Quetzalcoatl": "/images/symbols/aztec.png",
  "Calendrier Aztèque": "/images/symbols/aztec.png",
  "Serpent à Plumes": "/images/symbols/aztec.png",
  
  // Symboles islamiques
  "Arabesque": "/images/symbols/arabesque.png",
  "Calligraphie Arabe": "/images/symbols/arabesque.png",
  "Géométrie Islamique": "/images/symbols/arabesque.png",
  
  // Fallbacks génériques par culture
  "Celtique": "/images/symbols/triskelion.png",
  "Japonaise": "/images/symbols/seigaiha.png",
  "Grecque": "/images/symbols/greek-meander.png",
  "Indienne": "/images/symbols/mandala.png",
  "Africaine": "/images/symbols/adinkra.png",
  "Française": "/images/symbols/fleur-de-lys.png",
  "Nordique": "/images/symbols/viking.png",
  "Aztèque": "/images/symbols/aztec.png",
  "Islamique": "/images/symbols/arabesque.png"
};

const PLACEHOLDER = "/placeholder.svg";

export const SymbolCard: React.FC<SymbolCardProps> = React.memo(({ symbol }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const { toast } = useToast();
  
  // Obtenir les images du symbole depuis Supabase
  const { data: images, isError: imagesError } = useSymbolImages(symbol.id);
  
  // Obtenir les données de vérification du symbole
  const { data: verificationData } = useSymbolVerification(symbol.id);
  const primaryImage = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    return images.find(img => img.image_type === 'original') || images[0];
  }, [images]);
  
  // Fonction pour trouver la meilleure image locale ou utiliser un placeholder robuste
  const findBestLocalImage = React.useCallback((symbolName: string, culture: string): string => {
    console.log(`SymbolCard: Recherche d'image locale pour "${symbolName}" (culture: ${culture})`);
    
    // Directement utiliser le placeholder car les images locales n'existent pas
    // au lieu de faire des références vers des fichiers inexistants
    console.log(`SymbolCard: Utilisation directe du placeholder pour ${symbolName}`);
    return PLACEHOLDER;
  }, []);
  
  // Déterminer la source d'image avec fallbacks améliorés
  const imageSource = React.useMemo(() => {
    // Si on a une erreur ou pas d'image Supabase, utiliser l'image locale
    if (error || imagesError || !primaryImage?.image_url) {
      const localImage = findBestLocalImage(symbol.name, symbol.culture);
      console.log(`SymbolCard: ${symbol.name} - Utilisation image locale: ${localImage}`);
      return localImage;
    }
    
    console.log(`SymbolCard: ${symbol.name} - Utilisation image Supabase: ${primaryImage.image_url}`);
    return primaryImage.image_url;
  }, [error, imagesError, primaryImage, symbol.name, symbol.culture, findBestLocalImage]);
  
  // Déterminer si l'image vient d'une source locale ou distante
  const isLocalImage = imageSource.startsWith('/') || imageSource === PLACEHOLDER;
  
  const handleImageLoad = React.useCallback(() => {
    console.log(`SymbolCard: Image chargée avec succès pour ${symbol.name}`);
    setLoading(false);
    setError(false);
  }, [symbol.name]);

  const handleImageError = React.useCallback(() => {
    console.error(`SymbolCard: Erreur de chargement d'image pour le symbole: ${symbol.name}, source: ${imageSource}`);
    
    // Si on n'a pas encore essayé de retry et qu'on est sur une image Supabase
    if (retryCount < 1 && !isLocalImage) {
      console.log(`SymbolCard: Tentative de retry pour ${symbol.name}`);
      setRetryCount(prev => prev + 1);
      setError(true); // Cela va déclencher l'utilisation de l'image locale
    } else {
      setError(true);
    }
    
    setLoading(false);
  }, [symbol.name, imageSource, isLocalImage, retryCount]);
  
  // Gradient culturel adapté
  const culturalGradient = React.useMemo(() => {
    const cultures: Record<string, string> = {
      "Celtique": "hover:bg-gradient-to-br from-green-50 to-green-100 hover:border-green-200",
      "Japonaise": "hover:bg-gradient-to-br from-red-50 to-red-100 hover:border-red-200",
      "Grecque": "hover:bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-200", 
      "Indienne": "hover:bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-200",
      "Africaine": "hover:bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-200",
      "Française": "hover:bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-200",
      "Chinoise": "hover:bg-gradient-to-br from-red-50 to-red-100 hover:border-red-200",
      "Égyptienne": "hover:bg-gradient-to-br from-amber-50 to-amber-100 hover:border-amber-200",
      "Moyen-Orientale": "hover:bg-gradient-to-br from-indigo-50 to-indigo-100 hover:border-indigo-200",
      "Amérindienne": "hover:bg-gradient-to-br from-green-50 to-green-100 hover:border-green-200",
      "Nordique": "hover:bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-200",
      "Aztèque": "hover:bg-gradient-to-br from-red-50 to-red-100 hover:border-red-200",
      "Islamique": "hover:bg-gradient-to-br from-indigo-50 to-indigo-100 hover:border-indigo-200",
    };
    
    return cultures[symbol.culture] || "hover:bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-200";
  }, [symbol.culture]);

  // Navigation directe vers l'UUID du symbole
  const getSymbolLink = () => {
    console.log(`SymbolCard: Navigation vers symbole "${symbol.name}" avec UUID: ${symbol.id}`);
    return `/symbols/${symbol.id}`;
  };
  
  // Reset error state when symbol changes
  React.useEffect(() => {
    setError(false);
    setLoading(true);
    setRetryCount(0);
  }, [symbol.id]);

  // Timeout pour éviter les chargements infinis
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        if (loading) {
          console.log(`SymbolCard: Timeout de chargement pour ${symbol.name}`);
          setLoading(false);
          setError(true);
        }
      }, 3000); // 3 secondes max

      return () => clearTimeout(timer);
    }
  }, [loading, symbol.name]);
  
  return (
    <Link to={getSymbolLink()} className="block">
      <Card 
        className={`overflow-hidden shadow-sm hover:shadow-md border-2 border-white transition-all duration-300 symbol-card ${culturalGradient}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AspectRatio ratio={1} className="w-full bg-slate-50 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100/50 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Indicateur de source d'image avec état d'erreur */}
          <div className="absolute top-2 left-2 z-20">
            <div className={`p-1 rounded-full ${
              error 
                ? 'bg-orange-100 text-orange-600' 
                : isLocalImage 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-green-100 text-green-600'
            }`}>
              {error ? (
                <RefreshCw className="w-3 h-3" />
              ) : isLocalImage ? (
                <WifiOff className="w-3 h-3" />
              ) : (
                <Wifi className="w-3 h-3" />
              )}
            </div>
          </div>
          
          {/* Badge de vérification */}
          <div className="absolute top-2 right-2 z-20">
            {verificationData && (
              <VerificationBadge 
                status={verificationData.status}
                confidence={verificationData.averageConfidence}
                verificationCount={verificationData.verificationCount}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
            )}
          </div>
          
          {error && retryCount >= 1 && (
            <div className="absolute top-12 right-2 z-20">
              <div className="bg-red-100 text-red-600 p-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
          )}
          
          {/* Fallback vers une représentation visuelle avec icône si image indisponible */}
          {(error || imageSource === PLACEHOLDER) ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${getSymbolThemeColor(symbol.culture)}`}>
                <div className="text-white text-2xl font-bold">
                  {symbol.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="text-slate-600 text-xs text-center px-2">
                {symbol.name}
              </div>
            </div>
          ) : (
            <img
              src={imageSource}
              alt={symbol.name}
              className={`object-cover w-full h-full transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'} ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              key={`${symbol.id}-${retryCount}`}
            />
          )}
          
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 transition-opacity duration-300">
              <div className="text-white text-xs">
                <div className="font-medium mb-1">{symbol.period}</div>
                {symbol.function && symbol.function.length > 0 && (
                  <div className="opacity-80">
                    {symbol.function.slice(0, 2).join(', ')}
                    {symbol.function.length > 2 && '...'}
                  </div>
                )}
                {/* Debug info en hover */}
                <div className="opacity-60 text-xs mt-1">
                  {isLocalImage ? 'Image locale' : 'Image Supabase'}
                </div>
              </div>
            </div>
          )}
        </AspectRatio>
        
        <div className="p-3 bg-white/90 backdrop-blur-sm relative">
          <h4 className="text-sm font-serif text-slate-900 font-medium truncate">{symbol.name}</h4>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-600 truncate flex-1">{symbol.culture}</span>
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors ml-2" title={`${symbol.name} info`}>
              <Info className="w-3 h-3" />
            </div>
          </div>
          
          {/* Tags */}
          {symbol.tags && symbol.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {symbol.tags.slice(0, 2).map((tag, index) => (
                <span key={index} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
              {symbol.tags.length > 2 && (
                <span className="text-xs text-slate-400">+{symbol.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
});

SymbolCard.displayName = 'SymbolCard';
