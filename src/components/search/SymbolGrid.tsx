
import React from 'react';
import { Link } from 'react-router-dom';
import { SymbolData } from '@/types/supabase';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

interface SymbolGridProps {
  symbols: SymbolData[];
}

export const SymbolGrid: React.FC<SymbolGridProps> = ({ symbols }) => {
  const { currentLanguage } = useTranslation();
  
  if (symbols.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-lg">
        <p className="text-slate-500">
          <I18nText translationKey="symbols.noResults" />
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {symbols.map(symbol => {
        // Use translations if available
        const translations = symbol.translations || {};
        const langData = translations[currentLanguage];
        const displayName = langData?.name || symbol.name;
        const displayCulture = langData?.culture || symbol.culture;
        
        return (
          <Link to={`/symbols/${symbol.id}`} key={symbol.id}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200 border-slate-200">
              <div className="aspect-square w-full bg-amber-50 relative">
                <div 
                  className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                  style={{ 
                    backgroundImage: `url(/images/symbols/${symbol.name.toLowerCase().replace(/\s+/g, '-')}.png)`,
                    backgroundSize: '60%'
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm truncate">{displayName}</h3>
                <p className="text-xs text-slate-500 truncate">{displayCulture}</p>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};
