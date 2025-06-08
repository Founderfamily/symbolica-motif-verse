
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SymbolTriptych from '@/components/symbols/SymbolTriptych';
import { I18nText } from '@/components/ui/i18n-text';
import { useHybridSymbols } from '@/hooks/useHybridSymbols';

const SymbolTriptychSection = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string | null>(null);
  const [symbolIndex, setSymbolIndex] = useState(0);
  const navigate = useNavigate();
  
  // Utiliser le système hybride comme la page des symboles
  const { symbols, isLoading } = useHybridSymbols();

  // Fonction pour sélectionner un symbole aléatoire
  const selectRandomSymbol = () => {
    if (symbols.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * symbols.length);
    const randomSymbol = symbols[randomIndex];
    setSelectedSymbolId(randomSymbol.id);
    setSymbolIndex(randomIndex);
  };

  // Sélectionner un symbole aléatoire au chargement une fois les données disponibles
  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbolId) {
      selectRandomSymbol();
    }
  }, [symbols, selectedSymbolId]);

  // Navigation vers la recherche
  const handleExploreMore = () => {
    navigate('/symbols');
  };

  // Navigation vers le détail d'un symbole
  const handleSymbolNavigation = (symbolId: string) => {
    navigate(`/symbols/${symbolId}`);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement des symboles...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="px-4 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 inline-block mb-2">
          <I18nText translationKey="symbolTriptych" ns="sections">Analyse Symbolique</I18nText>
        </span>
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          <I18nText translationKey="title" ns="symbolTriptych">Explorez en Détail</I18nText>
        </h2>
        <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">
          <I18nText translationKey="description" ns="symbolTriptych">
            Découvrez l'évolution des symboles à travers le temps et les cultures
          </I18nText>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button 
            onClick={selectRandomSymbol}
            variant="outline"
            className="bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300"
            disabled={symbols.length === 0}
          >
            <Shuffle className="mr-2 h-4 w-4" />
            <I18nText translationKey="randomSymbol" ns="symbolTriptych">Symbole Aléatoire</I18nText>
          </Button>
          <Button 
            onClick={handleExploreMore}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
          >
            <Search className="mr-2 h-4 w-4" />
            <I18nText translationKey="exploreMore" ns="symbolTriptych">Explorer Plus</I18nText>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Liste des symboles */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-slate-800">
                  <I18nText translationKey="symbolCollection" ns="symbolTriptych">Collection de Symboles</I18nText>
                </h3>
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {symbols.slice(0, 20).map((symbol, index) => (
                  <button
                    key={symbol.id}
                    onClick={() => {
                      setSelectedSymbolId(symbol.id);
                      setSymbolIndex(index);
                    }}
                    onDoubleClick={() => handleSymbolNavigation(symbol.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                      selectedSymbolId === symbol.id
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-900'
                        : 'hover:bg-slate-50 border-transparent text-slate-700 hover:text-slate-900'
                    }`}
                    title="Double-cliquez pour voir les détails"
                  >
                    <div className="font-medium text-sm mb-1">{symbol.name}</div>
                    <div className="text-xs opacity-75">
                      {symbol.culture} • {symbol.period}
                    </div>
                  </button>
                ))}
                {symbols.length === 0 && (
                  <div className="text-center py-4 text-slate-500">
                    <p className="text-sm">Aucun symbole disponible</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Triptych principal */}
        <div className="lg:col-span-3">
          <SymbolTriptych symbolId={selectedSymbolId} />
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
