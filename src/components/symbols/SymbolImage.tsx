
import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ImageType, PLACEHOLDER } from '@/utils/symbolImageUtils';
import { SymbolImage as SymbolImageType } from '@/types/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';

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
            alt={`${symbolName || 'Symbol'} - ${title}`}
            className={`object-cover w-full h-full transition-all duration-500 group-hover:scale-105 ${!image ? 'opacity-0' : 'opacity-100'}`}
            crossOrigin="anonymous"
            onError={onError}
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

export default SymbolImage;
