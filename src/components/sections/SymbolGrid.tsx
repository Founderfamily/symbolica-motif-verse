
import React from 'react';
import SymbolCard from '@/components/symbols/SymbolCard';
import { SYMBOLS } from '@/data/symbols';

const SymbolGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {SYMBOLS.map((symbol, index) => (
        <SymbolCard 
          key={index} 
          motif={symbol} 
          index={index}
        />
      ))}
    </div>
  );
};

export default SymbolGrid;
