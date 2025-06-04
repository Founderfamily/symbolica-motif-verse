
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { SymbolCard } from './SymbolCard';
import { EmptyStateCard } from './EmptyStateCard';

interface SymbolGridProps {
  symbols: SymbolData[];
}

export const SymbolGrid: React.FC<SymbolGridProps> = React.memo(({ symbols }) => {
  if (symbols.length === 0) {
    return <EmptyStateCard />;
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {symbols.map(symbol => (
        <SymbolCard key={symbol.id} symbol={symbol} />
      ))}
    </div>
  );
});

SymbolGrid.displayName = 'SymbolGrid';
