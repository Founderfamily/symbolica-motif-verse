
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { Info, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { Link } from 'react-router-dom';

interface SymbolCardProps {
  symbol: SymbolData;
}

export const SymbolCard: React.FC<SymbolCardProps> = React.memo(({ symbol }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();
  
  // Obtenir les images du symbole
  const { images, imageErrors } = useSymbolImages(symbol.id);
  const patternImage = images?.pattern;
  const originalImage = images?.original;
  
  // Images de fallback locales étendues
  const PLACEHOLDER = "/placeholder.svg";
  
  const symbolToLocalImage: Record<string, string> = React.useMemo(() => ({
    "Triskèle Celtique": "/images/symbols/triskelion.png",
    "Fleur de Lys": "/images/symbols/fleur-de-lys.png", 
    "Méandre Grec": "/images/symbols/greek-meander.png",
    "Mandala": "/images/symbols/mandala.png",
    "Symbole Adinkra": "/images/symbols/adinkra.png",
    "Motif Seigaiha": "/images/symbols/seigaiha.png",
    "Yin Yang": "/images/symbols/mandala.png",
    "Ankh": "/images/symbols/adinkra.png",
    "Hamsa": "/images/symbols/mandala.png",
    "Attrape-rêves": "/images/symbols/triskelion.png",
  }), []);
  
  // Déterminer la source d'image avec fallbacks
  const imageSource = React.useMemo(() => {
    if (!error && (patternImage?.image_url || originalImage?.image_url)) {
      return patternImage?.image_url || originalImage?.image_url;
    }
    return symbolToLocalImage[symbol.name] || PLACEHOLDER;
  }, [error, patternImage, originalImage, symbolToLocalImage, symbol.name]);
  
  // Déterminer si l'image vient d'une source locale ou distante
  const isLocalImage = imageSource.startsWith('/') || imageSource === PLACEHOLDER;
  
  const handleImageLoad = React.useCallback(() => {
    setLoading(false);
  }, []);

  const handleImageError = React.useCallback(() => {
    console.error(`Erreur de chargement d'image pour le symbole: ${symbol.name}`);
    setError(true);
    setLoading(false);
  }, [symbol.name]);
  
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
    };
    
    return cultures[symbol.culture] || "hover:bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-200";
  }, [symbol.culture]);
  
  return (
    <Link to={`/symbols/${symbol.id}`} className="block">
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
          
          {/* Indicateur de source d'image */}
          <div className="absolute top-2 left-2 z-20">
            <div className={`p-1 rounded-full ${isLocalImage ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
              {isLocalImage ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            </div>
          </div>
          
          {error && (
            <div className="absolute top-2 right-2 z-20">
              <div className="bg-red-100 text-red-600 p-1 rounded-full">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>
          )}
          
          <img
            src={imageSource}
            alt={symbol.name}
            className={`object-cover w-full h-full transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'} ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          
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
          
          {/* Tags optionnels */}
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
