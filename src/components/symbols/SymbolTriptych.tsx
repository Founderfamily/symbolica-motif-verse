
import React from 'react';
import SymbolImage from './SymbolImage';
import { EmptyState, LoadingState, ErrorState } from './SymbolTriptychState';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { ImageType } from '@/utils/symbolImageUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { useBreakpoint } from '@/hooks/use-breakpoints';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolTriptychProps {
  symbolId: string | null;
}

const SymbolTriptych: React.FC<SymbolTriptychProps> = ({ symbolId }) => {
  const { 
    symbol, 
    images, 
    loading, 
    error, 
    imageErrors, 
    handleImageError 
  } = useSymbolImages(symbolId);
  
  const { currentLanguage } = useTranslation();
  const isMobile = useBreakpoint('md');
  
  if (!symbolId) {
    return <EmptyState />;
  }
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error || !symbol) {
    return <ErrorState />;
  }
  
  // Calculate total image errors
  const totalErrors = Object.values(imageErrors).filter(Boolean).length;
  
  // Get translated symbol data
  const getSymbolTranslation = (field: 'name' | 'culture' | 'period' | 'description') => {
    if (symbol.translations && symbol.translations[currentLanguage]?.[field]) {
      return symbol.translations[currentLanguage][field];
    }
    return symbol[field];
  };
  
  const renderImage = (type: ImageType) => {
    // Map image types to translation keys
    const titleKeyMap: Record<ImageType, string> = {
      'original': 'symbolTriptych.original',
      'pattern': 'symbolTriptych.pattern',
      'reuse': 'symbolTriptych.reuse'
    };
    
    // Get the appropriate translation key for this image type
    const titleKey = titleKeyMap[type];
    
    return (
      <SymbolImage
        image={images[type]}
        type={type}
        title={<I18nText translationKey={titleKey} />}
        hasError={imageErrors[type]}
        symbolName={getSymbolTranslation('name') || ''}
        onError={() => handleImageError(type)}
        currentLanguage={currentLanguage}
      />
    );
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-lg p-4 sm:p-6 relative">
      {/* Background pattern */}
      <div className="absolute -z-10 inset-0 opacity-[0.03] pattern-dots-lg"></div>
      
      <div className="mb-4 sm:mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-xl sm:text-2xl font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {getSymbolTranslation('name')}
        </h2>
        {symbol && (
          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center">
            <span className="inline-block w-2 sm:w-3 h-2 sm:h-3 rounded-full mr-2" style={{background: `var(--color-${symbol.culture.toLowerCase()})`}}></span>
            {getSymbolTranslation('culture')} · {getSymbolTranslation('period')}
          </p>
        )}
        {getSymbolTranslation('description') && (
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{getSymbolTranslation('description')}</p>
        )}
      </div>
      
      {totalErrors > 0 && (
        <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle><I18nText translationKey="symbolTriptych.imageError" /></AlertTitle>
          <AlertDescription>
            <I18nText translationKey="symbolTriptych.imageErrorDesc" />
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {renderImage('original')}
        {renderImage('pattern')}
        {renderImage('reuse')}
      </div>
    </div>
  );
};

export default SymbolTriptych;
