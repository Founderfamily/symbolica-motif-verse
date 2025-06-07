
import React from 'react';
import SymbolCard from '@/components/symbols/SymbolCard';
import { SYMBOLS } from '@/data/symbols';

const SymbolGrid: React.FC = () => {
  console.log('SymbolGrid: Rendu avec', SYMBOLS.length, 'symboles');
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {SYMBOLS.map((symbol, index) => {
        console.log(`SymbolGrid: Symbole "${symbol.name}" à l'index ${index}`);
        return (
          <SymbolCard 
            key={index} 
            motif={symbol} 
            index={index}
          />
        );
      })}
    </div>
  );
};

export default SymbolGrid;
