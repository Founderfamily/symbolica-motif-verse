
import React from 'react';
import SymbolImage from './SymbolImage';
import { EmptyState, LoadingState, ErrorState } from './SymbolTriptychState';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { ImageType } from '@/utils/symbolImageUtils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';

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
  
  const { t } = useTranslation();

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
  
  const renderImage = (type: ImageType) => {
    // Translate image titles based on image type
    const titleKey = 
      type === 'original' ? 'symbolTriptych.original' :
      type === 'pattern' ? 'symbolTriptych.pattern' : 'symbolTriptych.reuse';
    
    // Get translated title
    const translatedTitle = t(titleKey);
    
    return (
      <SymbolImage
        image={images[type]}
        type={type}
        title={translatedTitle}
        hasError={imageErrors[type]}
        symbolName={symbol?.name || ''}
        onError={() => handleImageError(type)}
      />
    );
  };
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-lg p-6 relative">
      {/* Background pattern */}
      <div className="absolute -z-10 inset-0 opacity-[0.03] pattern-dots-lg"></div>
      
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-2xl font-serif bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">{symbol?.name}</h2>
        {symbol && (
          <p className="text-sm text-slate-600 mt-1 flex items-center">
            <span className="inline-block w-3 h-3 rounded-full mr-2" style={{background: `var(--color-${symbol.culture.toLowerCase()})`}}></span>
            {symbol.culture} · {symbol.period}
          </p>
        )}
        {symbol?.description && (
          <p className="text-slate-700 mt-3 leading-relaxed">{symbol.description}</p>
        )}
      </div>
      
      {totalErrors > 0 && (
        <Alert variant="default" className="mb-4 bg-amber-50 border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>{t('symbolTriptych.imageError')}</AlertTitle>
          <AlertDescription>
            {t('symbolTriptych.imageErrorDesc')}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderImage('original')}
        {renderImage('pattern')}
        {renderImage('reuse')}
      </div>
    </div>
  );
};

export default SymbolTriptych;
