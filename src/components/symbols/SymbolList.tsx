
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SymbolData } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/i18n/useTranslation';

interface SymbolListProps {
  onSelectSymbol: (symbolId: string) => void;
  selectedSymbolId: string | null;
}

const SymbolList: React.FC<SymbolListProps> = ({ onSelectSymbol, selectedSymbolId }) => {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, currentLanguage } = useTranslation();
  
  useEffect(() => {
    const fetchSymbols = async () => {
      try {
        const { data, error } = await supabase
          .from('symbols')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        // Cast the data to ensure type compatibility
        const typedData: SymbolData[] = data.map(symbol => ({
          ...symbol,
          translations: symbol.translations as SymbolData['translations']
        }));
        
        setSymbols(typedData);
        
        // Select the first symbol by default if none is selected
        if (typedData && typedData.length > 0 && !selectedSymbolId) {
          onSelectSymbol(typedData[0].id);
        }
      } catch (error) {
        console.error("Error loading symbols:", error);
        toast({
          title: t('symbolList.error.title'),
          description: t('symbolList.error.description'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSymbols();
  }, [onSelectSymbol, selectedSymbolId, toast, t]);
  
  // Helper function to get translated value or fallback to default
  const getSymbolTranslation = (symbol: SymbolData, field: 'name' | 'culture' | 'period' | 'description') => {
    if (symbol.translations && symbol.translations[currentLanguage]?.[field]) {
      return symbol.translations[currentLanguage][field];
    }
    return symbol[field];
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (symbols.length === 0) {
    return (
      <div className="p-4 text-center text-slate-600">
        {t('symbolList.empty')}
      </div>
    );
  }
  
  return (
    <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
      {symbols.map((symbol) => (
        <button
          key={symbol.id}
          onClick={() => onSelectSymbol(symbol.id)}
          className={`w-full text-left px-4 py-2 rounded-md transition ${
            selectedSymbolId === symbol.id
              ? 'bg-amber-100 text-amber-800 font-medium'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <div className="text-sm">{getSymbolTranslation(symbol, 'name')}</div>
          <div className="text-xs text-slate-500">{getSymbolTranslation(symbol, 'culture')}</div>
        </button>
      ))}
    </div>
  );
};

export default SymbolList;
