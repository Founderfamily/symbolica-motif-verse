import React from 'react';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Badge } from '@/components/ui/badge';
import { PhotoStatusBadge } from '@/components/ui/photo-status-badge';
import { VerificationBadge } from '@/components/ui/verification-badge';
import { useToast } from '@/hooks/use-toast';
import { Info, Heart, Eye, Wifi, WifiOff, Share2 } from 'lucide-react';
import { useSymbolImages } from '@/hooks/useSupabaseSymbols';
import { useSymbolVerification } from '@/hooks/useSymbolVerification';
import { SymbolVisibilityService } from '@/services/symbolVisibilityService';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EnhancedSymbolCardProps {
  symbol: SymbolData;
  featured?: boolean;
}

export const EnhancedSymbolCard: React.FC<EnhancedSymbolCardProps> = React.memo(({ symbol, featured = false }) => {
  const [error, setError] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFavorited, setIsFavorited] = React.useState(false);
  const { toast } = useToast();
  
  // Obtenir les images du symbole depuis Supabase
  const { data: images } = useSymbolImages(symbol.id);
  
  // Récupérer les vérifications IA pour ce symbole
  const { data: verification } = useSymbolVerification(symbol.id);
  
  const primaryImage = React.useMemo(() => {
    if (!images || images.length === 0) return null;
    return images.find(img => img.image_type === 'original') || images[0];
  }, [images]);

  // Vérifier si le symbole a une photo
  const hasPhoto = React.useMemo(() => {
    return SymbolVisibilityService.hasPhoto({ ...symbol, images: images || [] });
  }, [symbol, images]);
  
  // Images de fallback locales
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
    if (!error && primaryImage?.image_url) {
      return primaryImage.image_url;
    }
    return symbolToLocalImage[symbol.name] || PLACEHOLDER;
  }, [error, primaryImage, symbolToLocalImage, symbol.name]);
  
  const isLocalImage = imageSource.startsWith('/') || imageSource === PLACEHOLDER;
  
  const handleImageLoad = React.useCallback(() => {
    setLoading(false);
  }, []);

  const handleImageError = React.useCallback(() => {
    console.error(`Erreur de chargement d'image pour le symbole: ${symbol.name}`);
    setError(true);
    setLoading(false);
  }, [symbol.name]);

  const handleFavorite = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Retiré des favoris" : "Ajouté aux favoris",
      description: `${symbol.name} ${isFavorited ? 'retiré de' : 'ajouté à'} vos favoris`,
    });
  }, [isFavorited, symbol.name, toast]);

  const handleShare = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.share?.({
      title: symbol.name,
      text: `Découvrez ce symbole ${symbol.culture}: ${symbol.name}`,
      url: window.location.origin + `/symbols/${symbol.id}`
    }).catch(() => {
      navigator.clipboard.writeText(window.location.origin + `/symbols/${symbol.id}`);
      toast({
        title: "Lien copié",
        description: "Le lien du symbole a été copié dans le presse-papier",
      });
    });
  }, [symbol, toast]);
  
  // Gradient culturel adapté avec bonus/malus de visibilité
  const culturalGradient = React.useMemo(() => {
    const baseGradients: Record<string, string> = {
      "Celtique": "hover:bg-gradient-to-br from-green-50 to-green-100 hover:border-green-200",
      "Japonaise": "hover:bg-gradient-to-br from-red-50 to-red-100 hover:border-red-200",
      "Grecque": "hover:bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-200", 
      "Indienne": "hover:bg-gradient-to-br from-orange-50 to-orange-100 hover:border-orange-200",
      "Africaine": "hover:bg-gradient-to-br from-yellow-50 to-yellow-100 hover:border-yellow-200",
      "Française": "hover:bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-200",
    };
    
    const baseGradient = baseGradients[symbol.culture] || "hover:bg-gradient-to-br from-slate-50 to-slate-100 hover:border-slate-200";
    
    // Ajouter un effet subtil basé sur la présence de photos
    if (hasPhoto) {
      return `${baseGradient} ring-1 ring-green-200/50`;
    } else {
      return `${baseGradient} opacity-95`;
    }
  }, [symbol.culture, hasPhoto]);

  const getSymbolLink = () => `/symbols/${symbol.id}`;
  
  return (
    <Link to={getSymbolLink()} className="block group">
      <Card 
        className={`overflow-hidden shadow-sm hover:shadow-xl border-2 transition-all duration-300 symbol-card ${culturalGradient} ${
          featured ? 'transform hover:scale-105' : 'hover:-translate-y-1'
        } ${hasPhoto ? 'border-green-200/30' : 'border-orange-200/30'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <AspectRatio ratio={featured ? 4/3 : 1} className="w-full bg-slate-50 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100/50 backdrop-blur-sm">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Indicateurs et contrôles */}
          <div className="absolute top-2 left-2 z-20 flex gap-2 flex-wrap max-w-[calc(100%-4rem)]">
            {/* Badge de statut photo - NOUVEAU */}
            <PhotoStatusBadge hasPhoto={hasPhoto} size="sm" />
            
            {/* Badge de vérification IA */}
            {verification && (
              <VerificationBadge 
                status={verification.status}
                confidence={verification.averageConfidence}
                verificationCount={verification.verificationCount}
                className="shadow-sm"
              />
            )}
            
            <Badge variant="secondary" className={`${isLocalImage ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'} text-xs`}>
              {isLocalImage ? <WifiOff className="w-3 h-3 mr-1" /> : <Wifi className="w-3 h-3 mr-1" />}
              {isLocalImage ? 'Local' : 'Live'}
            </Badge>
          </div>

          <div className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
          
          <img
            src={imageSource}
            alt={symbol.name}
            className={`object-cover w-full h-full transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'} ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={setError ? () => setError(true) : undefined}
            onLoad={() => setLoading(false)}
          />
          
          {/* Overlay avec information de statut photo */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4 transition-all duration-300">
              <div className="text-white text-sm">
                <div className="font-medium mb-1">{symbol.period}</div>
                {symbol.function && symbol.function.length > 0 && (
                  <div className="opacity-80 text-xs">
                    {symbol.function.slice(0, 2).join(', ')}
                    {symbol.function.length > 2 && '...'}
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                  <Eye className="w-3 h-3" />
                  <span>Voir détails</span>
                  {!hasPhoto && (
                    <span className="ml-2 px-2 py-1 bg-orange-500/80 rounded text-white">
                      📸 Photo manquante
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </AspectRatio>
        
        <div className={`${featured ? 'p-6' : 'p-3'} bg-white/90 backdrop-blur-sm relative`}>
          <h4 className={`${featured ? 'text-lg' : 'text-sm'} font-serif font-medium truncate ${
            hasPhoto ? 'text-slate-900' : 'text-slate-700'
          }`}>
            {symbol.name}
          </h4>
          <div className="flex justify-between items-center mt-2">
            <span className={`${featured ? 'text-sm' : 'text-xs'} truncate flex-1 ${
              hasPhoto ? 'text-slate-600' : 'text-slate-500'
            }`}>
              {symbol.culture}
            </span>
            <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors ml-2" title={`${symbol.name} info`}>
              <Info className="w-3 h-3" />
            </div>
          </div>
          
          {/* Tags améliorés */}
          {symbol.tags && symbol.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {symbol.tags.slice(0, featured ? 3 : 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-slate-50 text-slate-600 border-slate-200">
                  {tag}
                </Badge>
              ))}
              {symbol.tags.length > (featured ? 3 : 2) && (
                <Badge variant="outline" className="text-xs text-slate-400 border-slate-200">
                  +{symbol.tags.length - (featured ? 3 : 2)}
                </Badge>
              )}
            </div>
          )}

          {/* Message d'encouragement pour les symboles sans photo */}
          {!hasPhoto && (
            <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              💡 Ce symbole gagnerait à avoir une illustration
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
});

EnhancedSymbolCard.displayName = 'EnhancedSymbolCard';
