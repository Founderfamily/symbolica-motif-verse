
import React from 'react';
import { SymbolData } from '@/types/supabase';
import { SymbolCard } from './SymbolCard';

interface SymbolGridProps {
  symbols: SymbolData[];
  loading?: boolean;
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({ symbols, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="aspect-square bg-slate-200 rounded-lg animate-pulse">
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-slate-300 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg mb-2">Aucun symbole trouvé</div>
        <div className="text-slate-500 text-sm">Essayez de modifier vos critères de recherche</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {symbols.map((symbol, index) => (
        <SymbolCard 
          key={symbol.id} 
          symbol={symbol} 
          priority={index < 4} // Les 4 premiers ont la priorité pour le preloading
        />
      ))}
    </div>
  );
};
