
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Symbol {
  id: string;
  name: string;
  culture: string;
  period: string;
  description?: string;
}

interface SymbolSelectorProps {
  onSymbolSelect: (symbolId: string) => void;
  selectedSymbol: string | null;
  placeholder?: string;
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  onSymbolSelect,
  selectedSymbol,
  placeholder = "Search and select a symbol"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [symbols, setSymbols] = useState<Symbol[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<Symbol[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadSymbols();
  }, []);

  useEffect(() => {
    filterSymbols();
  }, [searchTerm, symbols]);

  const loadSymbols = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('symbols')
        .select('id, name, culture, period, description')
        .order('name');

      if (error) throw error;
      setSymbols(data || []);
    } catch (error) {
      console.error('Error loading symbols:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSymbols = () => {
    if (!searchTerm.trim()) {
      setFilteredSymbols(symbols.slice(0, 20)); // Show first 20
      return;
    }

    const filtered = symbols.filter(symbol =>
      symbol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symbol.period.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);

    setFilteredSymbols(filtered);
  };

  const handleSymbolSelect = (symbol: Symbol) => {
    onSymbolSelect(symbol.id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const selectedSymbolData = symbols.find(s => s.id === selectedSymbol);

  return (
    <div className="relative">
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-10"
          />
        </div>

        {selectedSymbolData && (
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">{selectedSymbolData.name}</h4>
                  <div className="flex space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {selectedSymbolData.culture}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {selectedSymbolData.period}
                    </Badge>
                  </div>
                </div>
                <Check className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            <ScrollArea className="h-64">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-slate-600 mt-2">Loading symbols...</p>
                </div>
              ) : filteredSymbols.length > 0 ? (
                <div className="divide-y">
                  {filteredSymbols.map((symbol) => (
                    <button
                      key={symbol.id}
                      onClick={() => handleSymbolSelect(symbol)}
                      className="w-full p-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{symbol.name}</h4>
                          <div className="flex space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {symbol.culture}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {symbol.period}
                            </Badge>
                          </div>
                          {symbol.description && (
                            <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                              {symbol.description}
                            </p>
                          )}
                        </div>
                        {selectedSymbol === symbol.id && (
                          <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500">
                  <p className="text-sm">No symbols found</p>
                  <p className="text-xs mt-1">Try adjusting your search terms</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SymbolSelector;
