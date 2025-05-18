
import React from 'react';
import SymbolCard from '@/components/symbols/SymbolCard';
import { I18nText } from '@/components/ui/i18n-text';

interface Symbol {
  id: string;
  name: string;
  culture: string;
  imageUrl?: string;
}

interface SymbolGridProps {
  symbols: Symbol[];
  title?: string;
  translationKey?: string;
}

const SymbolGrid: React.FC<SymbolGridProps> = ({ 
  symbols, 
  title = 'Explore Symbols',
  translationKey = 'sections.symbols.title'
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-8">
          <I18nText translationKey={translationKey}>{title}</I18nText>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {symbols.map((symbol, index) => (
            <SymbolCard
              key={symbol.id || index}
              id={symbol.id}
              name={symbol.name}
              culture={symbol.culture}
              imageUrl={symbol.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SymbolGrid;
