
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle, Image } from 'lucide-react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert } from "@/components/ui/alert";

interface SymbolDisplayProps {
  symbolId: string | null;
}

const SymbolDisplay: React.FC<SymbolDisplayProps> = ({ symbolId }) => {
  const { t, currentLanguage } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [symbol, setSymbol] = useState<any>(null);
  const [images, setImages] = useState<Record<string, any>>({
    original: null,
    pattern: null,
    reuse: null
  });
  const [imageErrors, setImageErrors] = useState({
    original: false,
    pattern: false,
    reuse: false
  });
  
  // Fetch symbol data when symbolId changes
  React.useEffect(() => {
    if (!symbolId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(false);
    
    const fetchSymbolData = async () => {
      try {
        // Get symbol details
        const { data: symbolData, error: symbolError } = await supabase
          .from('symbols')
          .select('*')
          .eq('id', symbolId)
          .single();
        
        if (symbolError) throw symbolError;
        setSymbol(symbolData);
        
        // Get symbol images
        const { data: imagesData, error: imagesError } = await supabase
          .from('symbol_images')
          .select('*')
          .eq('symbol_id', symbolId);
        
        if (imagesError) throw imagesError;
        
        const organizedImages = {
          original: null,
          pattern: null,
          reuse: null
        };
        
        imagesData.forEach(img => {
          organizedImages[img.image_type] = img;
        });
        
        setImages(organizedImages);
      } catch (err) {
        console.error('Error loading symbol:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSymbolData();
  }, [symbolId]);
  
  // Handle image loading errors
  const handleImageError = (type: string) => {
    setImageErrors(prev => ({
      ...prev,
      [type]: true
    }));
  };
  
  // Get translated field, with fallback to original
  const getTranslation = (field: string) => {
    if (!symbol) return '';
    
    const translations = symbol.translations || {};
    const langData = translations[currentLanguage];
    
    return langData?.[field] || symbol[field] || '';
  };
  
  // Get image translation
  const getImageTranslation = (image: any, field: string) => {
    if (!image) return '';
    
    const translations = image.translations || {};
    const langData = translations[currentLanguage];
    
    return langData?.[field] || image[field] || '';
  };
  
  // Empty state
  if (!symbolId) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg shadow-inner">
        <p className="text-slate-500 text-lg">{t('symbols.noSelection')}</p>
      </div>
    );
  }
  
  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 bg-gradient-to-br from-slate-50 to-amber-50 rounded-lg animate-pulse">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
          <p className="mt-4 text-amber-800">{t('symbols.loading')}</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !symbol) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-red-50 rounded-lg border border-red-100">
        <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-slate-800 text-lg">{t('symbols.error')}</p>
        <p className="text-slate-500">{t('symbols.errorDescription')}</p>
      </div>
    );
  }
  
  // Calculate total image errors
  const totalErrors = Object.values(imageErrors).filter(Boolean).length;
  
  // Success state - Display the symbol with its images
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-lg p-4 sm:p-6 relative">
      {/* Background pattern */}
      <div className="absolute -z-10 inset-0 opacity-[0.03] pattern-dots-lg"></div>
      
      {/* Symbol header */}
      <div className="mb-4 sm:mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {getTranslation('name')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center">
          <span 
            className="inline-block w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2" 
            style={{background: `var(--color-${symbol.culture?.toLowerCase()})`}}
          ></span>
          {getTranslation('culture')} · {getTranslation('period')}
        </p>
        {getTranslation('description') && (
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{getTranslation('description')}</p>
        )}
      </div>
      
      {/* Image errors alert */}
      {totalErrors > 0 && (
        <Alert className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <h4 className="font-medium">{t('symbols.imageError')}</h4>
          <p className="text-sm text-amber-700">{t('symbols.imageErrorDescription')}</p>
        </Alert>
      )}
      
      {/* Symbol images grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Original Image */}
        <div className="flex flex-col space-y-3">
          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
            <AspectRatio ratio={1} className="bg-slate-50 relative overflow-hidden">
              {!images.original && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
              )}
              
              {images.original && (
                <img
                  src={images.original.image_url || '/placeholder.svg'}
                  alt={`${getTranslation('name')} - ${t('symbols.original')}`}
                  className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                  onError={() => handleImageError('original')}
                />
              )}
            </AspectRatio>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-slate-800">{t('symbols.original')}</h4>
            {images.original?.description && (
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {getImageTranslation(images.original, 'description')}
              </p>
            )}
          </div>
        </div>
        
        {/* Pattern Image */}
        <div className="flex flex-col space-y-3">
          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
            <AspectRatio ratio={1} className="bg-slate-50 relative overflow-hidden">
              {!images.pattern && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
              )}
              
              {images.pattern && (
                <img
                  src={images.pattern.image_url || '/placeholder.svg'}
                  alt={`${getTranslation('name')} - ${t('symbols.pattern')}`}
                  className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                  onError={() => handleImageError('pattern')}
                />
              )}
            </AspectRatio>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-slate-800">{t('symbols.pattern')}</h4>
            {images.pattern?.description && (
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {getImageTranslation(images.pattern, 'description')}
              </p>
            )}
          </div>
        </div>
        
        {/* Reuse Image */}
        <div className="flex flex-col space-y-3">
          <div className="rounded-lg overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 group">
            <AspectRatio ratio={1} className="bg-slate-50 relative overflow-hidden">
              {!images.reuse && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
                  <Image className="w-8 h-8 text-slate-400" />
                </div>
              )}
              
              {images.reuse && (
                <img
                  src={images.reuse.image_url || '/placeholder.svg'}
                  alt={`${getTranslation('name')} - ${t('symbols.reuse')}`}
                  className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
                  onError={() => handleImageError('reuse')}
                />
              )}
            </AspectRatio>
          </div>
          <div className="text-center">
            <h4 className="text-sm font-medium text-slate-800">{t('symbols.reuse')}</h4>
            {images.reuse?.description && (
              <p className="text-xs text-slate-600 mt-1 max-w-xs mx-auto">
                {getImageTranslation(images.reuse, 'description')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymbolDisplay;
