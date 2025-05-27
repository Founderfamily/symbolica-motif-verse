
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolData } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';

interface SymbolSelectorProps {
  onSelect: (symbol: SymbolData) => void;
  onClose: () => void;
  excludeIds?: string[];
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({ 
  onSelect, 
  onClose, 
  excludeIds = [] 
}) => {
  const [symbols, setSymbols] = useState<SymbolData[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<SymbolData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    const filtered = symbols.filter(symbol => 
      !excludeIds.includes(symbol.id) &&
      (symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       symbol.culture.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredSymbols(filtered);
  }, [symbols, searchTerm, excludeIds]);

  const fetchSymbols = async () => {
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setSymbols(data || []);
    } catch (error) {
      console.error('Error fetching symbols:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            <I18nText translationKey="analysis.selectSymbol">Select Symbol</I18nText>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search symbols or cultures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="overflow-y-auto max-h-[400px] space-y-2">
            {loading ? (
              <div className="text-center py-8 text-slate-500">
                <I18nText translationKey="common.loading">Loading...</I18nText>
              </div>
            ) : filteredSymbols.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <I18nText translationKey="analysis.noSymbolsFound">No symbols found</I18nText>
              </div>
            ) : (
              filteredSymbols.map((symbol) => (
                <div
                  key={symbol.id}
                  onClick={() => onSelect(symbol)}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{symbol.name}</h4>
                    <p className="text-sm text-slate-600">{symbol.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline">{symbol.culture}</Badge>
                    <Badge variant="secondary" className="text-xs">{symbol.period}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SymbolSelector;
