
// src/components/symbols/SymbolCard.tsx
import React, { useState, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Symbol } from '@/data/symbols';
import { culturalGradient } from '@/lib/utils';
import { Info, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

// Image de remplacement locale en cas d'erreur
const PLACEHOLDER = "/placeholder.svg";

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

interface SymbolCardProps {
  motif: Symbol;
}

const SymbolCard: React.FC<SymbolCardProps> = ({ motif }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Réinitialiser l'état d'erreur si le motif change
  useEffect(() => {
    setError(false);
    setLoading(true);
    setUseFallback(false);
  }, [motif.src]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    console.error(`Erreur de chargement de l'image: ${motif.name}`, motif.src);
    setError(true);
    
    // Notifier l'utilisateur de l'erreur uniquement si c'est une image externe
    if (motif.isExternal) {
      toast({
        title: t("symbols.imageError.title"),
        description: t("symbols.imageError.description", { name: motif.name }),
        variant: "default",
      });
    }
    
    // Tenter d'utiliser l'image locale correspondante si disponible
    if (symbolToLocalImage[motif.name]) {
      setUseFallback(true);
    }
    setLoading(false);
  };

  // Déterminer quelle source d'image utiliser
  const imageSource = error && useFallback && symbolToLocalImage[motif.name] 
    ? symbolToLocalImage[motif.name] 
    : error && !symbolToLocalImage[motif.name] 
      ? PLACEHOLDER 
      : motif.src;
      
  // Déterminer si l'image est locale ou distante
  const isLocalImage = imageSource.startsWith('/');

  // Créer des variables traduites pour les écrans de chargement
  const loadingImageText = t("symbols.loading");
  const imageErrorText = t("symbols.error");
  const infoText = t("symbols.info");

  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-xl border-2 border-white transition-all duration-300 symbol-card ${culturalGradient(motif.culture)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AspectRatio ratio={1} className="w-full bg-slate-50 relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-slate-100/50 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        )}
        {error && !useFallback && (
          <div className="absolute top-2 right-2 z-20">
            <div className="bg-red-100 text-red-600 p-1 rounded-full">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
        )}
        <img
          src={imageSource}
          alt={motif.name}
          className={`object-cover w-full h-full transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'} ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          crossOrigin={isLocalImage ? "" : "anonymous"} // N'utiliser crossOrigin que pour les images distantes
        />
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 transition-opacity duration-300">
            <span className="text-white text-xs font-medium">
              {motif.period}
            </span>
          </div>
        )}
      </AspectRatio>
      <div className="p-3 bg-white/90 backdrop-blur-sm relative">
        <h4 className="text-sm font-serif text-slate-900 font-medium">{motif.name}</h4>
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-slate-600">{motif.culture}</span>
          <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 cursor-pointer hover:bg-amber-200 transition-colors" title={infoText}>
            <Info className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolCard;
