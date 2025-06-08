
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shuffle, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SymbolTriptych from '@/components/symbols/SymbolTriptych';
import { I18nText } from '@/components/ui/i18n-text';
import { EXPANDED_SYMBOLS } from '@/data/expandedSymbols';

const SymbolTriptychSection = () => {
  const [selectedSymbolId, setSelectedSymbolId] = useState<string>('triskele-1');
  const [symbolIndex, setSymbolIndex] = useState(0);
  const navigate = useNavigate();

  // Fonction pour sélectionner un symbole aléatoire
  const selectRandomSymbol = () => {
    const randomIndex = Math.floor(Math.random() * EXPANDED_SYMBOLS.length);
    const randomSymbol = EXPANDED_SYMBOLS[randomIndex];
    setSelectedSymbolId(randomSymbol.id);
    setSymbolIndex(randomIndex);
  };

  // Sélectionner un symbole aléatoire au chargement
  useEffect(() => {
    selectRandomSymbol();
  }, []);

  // Navigation vers la recherche
  const handleExploreMore = () => {
    navigate('/symbols');
  };

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
                {EXPANDED_SYMBOLS.map((symbol, index) => (
                  <button
                    key={symbol.id}
                    onClick={() => {
                      setSelectedSymbolId(symbol.id);
                      setSymbolIndex(index);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                      selectedSymbolId === symbol.id
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 text-blue-900'
                        : 'hover:bg-slate-50 border-transparent text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{symbol.name}</div>
                    <div className="text-xs opacity-75">
                      {symbol.culture} • {symbol.period}
                    </div>
                  </button>
                ))}
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
