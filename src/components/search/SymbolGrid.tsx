
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { Info, AlertCircle } from 'lucide-react';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { Link } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolGridProps {
  symbols: SymbolData[];
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({ symbols }) => {
  if (symbols.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500">
        <I18nText translationKey="symbols.grid.noSymbolsFound" />
      </Card>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {symbols.map(symbol => (
        <SymbolCard key={symbol.id} symbol={symbol} />
      ))}
    </div>
  );
};

interface SymbolCardProps {
  symbol: SymbolData;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ symbol }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const { toast } = useToast();
  
  // Get symbol image - we'll try to use the pattern image first
  const { images, imageErrors } = useSymbolImages(symbol.id);
  const patternImage = images?.pattern;
  const originalImage = images?.original;
  
  // Fallback image paths
  const PLACEHOLDER = "/placeholder.svg";
  
  // Mapping of symbols to local images (fallback)
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
  
  // Determine image source with fallbacks
  const imageSource = !error && (patternImage?.image_url || originalImage?.image_url)
    ? patternImage?.image_url || originalImage?.image_url
    : symbolToLocalImage[symbol.name] || PLACEHOLDER;
  
  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    console.error(`Error loading image for symbol: ${symbol.name}`);
    setError(true);
    setLoading(false);
  };
  
  // Get culturally appropriate gradient
  const culturalGradient = (culture: string) => {
    const cultures: Record<string, string> = {
      "Celtique": "hover:bg-gradient-to-br from-green-50 to-green-100 hover:border-green-200",
      "Japonaise": "hover:bg-gradient-to-br from-red-50 to-red-100 hover:border-red-200",
      "Grecque": "hover:bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-200",
      "Indienne": "hover:bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-200",
      "Africaine": "hover:bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-200",
      "Viking": "hover:bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-200",
      "Arabe": "hover:bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-200",
      "Aztèque": "hover:bg-gradient-to-br from-amber-50 to-amber-100 hover:border-amber-200"
    };
    
    return cultures[culture] || "hover:bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-200";
  };
  
  return (
    <Link to={`/symbols/${symbol.id}`} className="block">
      <Card 
        className={`overflow-hidden shadow-sm hover:shadow-md border-2 border-white transition-all duration-300 symbol-card ${culturalGradient(symbol.culture)}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AspectRatio ratio={1} className="w-full bg-slate-50 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100/50 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
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
              <span className="text-white text-xs font-medium">
                <I18nText translationKey="symbols.card.period" />: {symbol.period}
              </span>
            </div>
          )}
        </AspectRatio>
        <div className="p-3 bg-white/90 backdrop-blur-sm relative">
          <h4 className="text-sm font-serif text-slate-900 font-medium">{symbol.name}</h4>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-slate-600">{symbol.culture}</span>
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors" title={`${symbol.name} info`}>
              <Info className="w-3 h-3" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};
