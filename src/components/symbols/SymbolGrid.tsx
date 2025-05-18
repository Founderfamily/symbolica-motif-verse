
import React, { useState } from 'react';
import SymbolCard from './SymbolCard';
import { Button } from '@/components/ui/button';
import { Grid, List } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface Symbol {
  id: string;
  name: string;
  culture: string;
  period?: string;
  imageUrl?: string;
  tags?: string[];
}

interface SymbolGridProps {
  symbols: Symbol[];
  loading?: boolean;
  emptyMessage?: string;
}

const SymbolGrid: React.FC<SymbolGridProps> = ({
  symbols,
  loading = false,
  emptyMessage = 'No symbols found'
}) => {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'grid' ? 'list' : 'grid'));
  };
  
  if (loading) {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <Button variant="outline" size="sm" onClick={toggleViewMode}>
            {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
          </Button>
        </div>
        
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          : "space-y-2"
        }>
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={i} 
              className={`animate-pulse ${viewMode === 'list' ? 'h-20' : 'h-64'}`}
            >
              <div className="bg-slate-200 rounded h-full w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (symbols.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">
          <I18nText translationKey="symbols.noSymbolsFound">{emptyMessage}</I18nText>
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleViewMode}
          className="flex items-center"
        >
          {viewMode === 'grid' ? (
            <>
              <List size={16} className="mr-1" />
              <I18nText translationKey="symbols.viewModes.list">List View</I18nText>
            </>
          ) : (
            <>
              <Grid size={16} className="mr-1" />
              <I18nText translationKey="symbols.viewModes.grid">Grid View</I18nText>
            </>
          )}
        </Button>
      </div>
      
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        : "space-y-2"
      }>
        {symbols.map(symbol => (
          <SymbolCard
            key={symbol.id}
            id={symbol.id}
            name={symbol.name}
            culture={symbol.culture}
            period={symbol.period}
            imageUrl={symbol.imageUrl}
            tags={symbol.tags}
            compact={viewMode === 'list'}
          />
        ))}
      </div>
    </div>
  );
};

export default SymbolGrid;
