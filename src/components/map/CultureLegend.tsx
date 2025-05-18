
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getSymbolIconByType, getSymbolThemeColor } from '@/utils/symbolImageUtils';

interface CultureLegendProps {
  cultures: string[];
  onFilterChange: (culture: string, active: boolean) => void;
  activeCultures: Set<string>;
}

const CultureLegend: React.FC<CultureLegendProps> = ({ 
  cultures, 
  onFilterChange,
  activeCultures
}) => {
  const { t } = useTranslation();
  
  if (cultures.length === 0) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-xs w-full">
      <h3 className="text-sm font-medium mb-2">
        <I18nText translationKey="map.legend.title" />
      </h3>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-2">
          {cultures.sort().map(culture => (
            <button
              key={culture}
              className={`flex items-center w-full p-1.5 rounded-md transition-colors text-left
                ${activeCultures.has(culture) 
                  ? getSymbolThemeColor(culture) + ' text-white' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              onClick={() => onFilterChange(culture, !activeCultures.has(culture))}
            >
              <div className="w-6 h-6 rounded-full bg-white/90 p-0.5 mr-2 overflow-hidden flex-shrink-0">
                <img 
                  src={getSymbolIconByType(culture)} 
                  alt={culture} 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium truncate">{culture}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CultureLegend;
