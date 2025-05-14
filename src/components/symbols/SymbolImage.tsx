
import React, { useState } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageType, PLACEHOLDER } from '@/utils/symbolImageUtils';
import { SymbolImage as SymbolImageType } from '@/types/supabase';
import { AlertCircle, Loader2, Image as ImageIcon, MapPin, Link2, Tag } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslation } from '@/i18n/useTranslation';

interface SymbolImageProps {
  image: SymbolImageType | null;
  type: ImageType;
  title: string;
  hasError: boolean;
  symbolName: string;
  onError: () => void;
}

const SymbolImage: React.FC<SymbolImageProps> = ({
  image,
  type,
  title,
  hasError,
  symbolName,
  onError
}) => {
  const imageUrl = image?.image_url || PLACEHOLDER;
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  
  const handleLoad = () => {
    setLoading(false);
  };
  
  const handleError = () => {
    setLoading(false);
    onError();
  };
  
  // Déterminer si l'image est locale ou distante
  const isLocalImage = imageUrl.startsWith('/');
  
  return (
    <div className="flex flex-col space-y-3">
      <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
        <AspectRatio ratio={1} className="bg-slate-50 relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100/70 backdrop-blur-sm z-10">
              <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
            </div>
          )}
          
          {!image && !loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
              <ImageIcon className="w-8 h-8 text-slate-400" />
            </div>
          )}
          
          <img
            src={imageUrl}
            alt={`${symbolName || 'Symbol'} - ${title}`}
            className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${loading ? 'opacity-0' : 'opacity-100'}`}
            crossOrigin={isLocalImage ? "" : "anonymous"} // N'utiliser crossOrigin que pour les images distantes
            onError={handleError}
            onLoad={handleLoad}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {hasError && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-2 right-2 z-20">
                    <div className="bg-amber-100 text-amber-600 p-1.5 rounded-full shadow-sm">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('symbolTriptych.imageErrorDesc')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </AspectRatio>
      </div>
      <div className="text-center">
        <h4 className="text-sm font-medium text-slate-800">{title}</h4>
        {image?.description && (
          <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">{image.description}</p>
        )}
        
        {/* Display new metadata fields if they exist */}
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          {image?.location && (
            <div className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              <MapPin className="w-3 h-3 mr-1" />
              {image.location}
            </div>
          )}
          
          {image?.source && (
            <div className="inline-flex items-center text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
              <Link2 className="w-3 h-3 mr-1" />
              {image.source}
            </div>
          )}
          
          {image?.tags && image.tags.length > 0 && (
            <div className="w-full mt-1 flex flex-wrap gap-1 justify-center">
              {image.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolImage;
