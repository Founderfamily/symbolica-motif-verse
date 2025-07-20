
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Info, Wifi, WifiOff, RefreshCw, Loader2 } from 'lucide-react';
import { getSymbolThemeColor } from '@/utils/symbolImageUtils';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { useSymbolVerification } from '@/hooks/useSymbolVerification';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { Link } from 'react-router-dom';

interface SymbolCardProps {
  symbol: SymbolData;
  priority?: boolean;
}

export const SymbolCard: React.FC<SymbolCardProps> = React.memo(({ symbol, priority = false }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();
  
  // Obtenir les images du symbole depuis Supabase
  const { data: images, isError: imagesError } = useSymbolImages(symbol.id);
  
  // Obtenir les données de vérification du symbole
  const { data: verificationData } = useSymbolVerification(symbol.id);
  
  const primaryImage = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    return images.find(img => img.image_type === 'original') || images[0];
  }, [images]);
  
  // Utiliser le hook optimisé pour le chargement d'images
  const {
    imageSource,
    isLoading,
    hasError,
    isLocalImage,
    retryLoad,
    loadingProgress
  } = useOptimizedImage({
    supabaseUrl: primaryImage?.image_url,
    symbolName: symbol.name,
    culture: symbol.culture,
    priority
  });

  const handleImageError = React.useCallback(() => {
    console.error(`SymbolCard: Erreur finale pour ${symbol.name}`);
    toast({
      title: "Image non disponible",
      description: `L'image pour "${symbol.name}" n'a pas pu être chargée.`,
      variant: "default",
    });
  }, [symbol.name, toast]);
  
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

  const getSymbolLink = () => `/symbols/${symbol.id}`;
  
  return (
    <Link to={getSymbolLink()} className="block">
      <Card 
        className={`overflow-hidden shadow-sm hover:shadow-md border-2 border-white transition-all duration-300 symbol-card ${culturalGradient}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AspectRatio ratio={1} className="w-full bg-slate-50 relative overflow-hidden">
          {/* Indicateur de chargement amélioré */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-slate-100/80 backdrop-blur-sm">
              <div className="relative mb-3">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-amber-200" 
                     style={{
                       background: `conic-gradient(from 0deg, transparent ${loadingProgress * 3.6}deg, #f3f4f6 ${loadingProgress * 3.6}deg)`
                     }}
                />
              </div>
              <div className="text-xs text-slate-600 text-center px-2">
                Chargement... {Math.round(loadingProgress)}%
              </div>
            </div>
          )}
          
          {/* Indicateurs de statut */}
          <div className="absolute top-2 left-2 z-20 flex gap-1">
            {/* Indicateur de source */}
            <div className={`p-1 rounded-full ${
              hasError 
                ? 'bg-orange-100 text-orange-600' 
                : isLocalImage 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-green-100 text-green-600'
            }`}>
              {hasError ? (
                <RefreshCw className="w-3 h-3" />
              ) : isLocalImage ? (
                <WifiOff className="w-3 h-3" />
              ) : (
                <Wifi className="w-3 h-3" />
              )}
            </div>
            
            {/* Badge qualité image */}
            {!isLoading && (
              <Badge 
                variant="secondary" 
                className={`text-xs ${
                  isLocalImage ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                }`}
              >
                {isLocalImage ? 'Local' : 'HD'}
              </Badge>
            )}
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
          
          {/* Image - TOUJOURS AFFICHER, même si c'est un placeholder */}
          <img
            src={imageSource}
            alt={symbol.name}
            className={`object-cover w-full h-full transition-all duration-500 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={handleImageError}
            loading={priority ? 'eager' : 'lazy'}
          />
          
          {/* Overlay informatif au hover */}
          {isHovered && !isLoading && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 transition-opacity duration-300">
              <div className="text-white text-xs">
                <div className="font-medium mb-1">{symbol.period}</div>
                {symbol.function && symbol.function.length > 0 && (
                  <div className="opacity-80 mb-1">
                    {symbol.function.slice(0, 2).join(', ')}
                    {symbol.function.length > 2 && '...'}
                  </div>
                )}
                <div className="opacity-60 flex items-center gap-2">
                  <span>{isLocalImage ? 'Image locale' : 'Image HD'}</span>
                  {hasError && (
                    <span className="text-orange-300">⚠ Rechargé</span>
                  )}
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
          
          {/* Tags avec indicateur de disponibilité d'image */}
          <div className="flex items-center justify-between mt-2">
            {symbol.tags && symbol.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 flex-1">
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
            
            {/* Bouton retry si erreur */}
            {hasError && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  retryLoad();
                }}
                className="text-xs text-orange-600 hover:text-orange-800 underline ml-2"
                title="Recharger l'image"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
});

SymbolCard.displayName = 'SymbolCard';
