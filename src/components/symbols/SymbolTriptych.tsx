
import React from 'react';
import SymbolImage from './SymbolImage';
import { EmptyState, LoadingState, ErrorState } from './SymbolTriptychState';
import { useSymbolImages } from '@/hooks/useSymbolImages';
import { ImageType } from '@/utils/symbolImageUtils';

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

  if (!symbolId) {
    return <EmptyState message="Sélectionnez un symbole pour voir ses détails" />;
  }
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (error || !symbol) {
    return <ErrorState />;
  }
  
  const renderImage = (type: ImageType, title: string) => {
    return (
      <SymbolImage
        image={images[type]}
        type={type}
        title={title}
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderImage('original', 'Image originale')}
        {renderImage('pattern', 'Extraction du motif')}
        {renderImage('reuse', 'Nouvelle utilisation')}
      </div>
    </div>
  );
};

export default SymbolTriptych;
