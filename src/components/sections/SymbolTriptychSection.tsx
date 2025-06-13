
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { SymbolData } from '@/types/supabase';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';

const SymbolTriptychSection = () => {
  const [selectedSymbol, setSelectedSymbol] = useState<SymbolData | null>(null);
  const navigate = useNavigate();
  const { data: symbols, isLoading } = useAllSymbols();

  const handleExploreMore = () => {
    navigate('/symbols');
  };

  const handleSymbolSelect = (symbol: SymbolData) => {
    setSelectedSymbol(symbol);
  };

  return (
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Indicateur d'étape */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-100 text-blue-800 font-semibold mb-6">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
          <I18nText translationKey="symbolTriptych.step1">Commencez par un symbole</I18nText>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 bg-clip-text text-transparent">
          <I18nText translationKey="symbolTriptych.title">Découvrez les Symboles</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="symbolTriptych.description">
            Chaque symbole raconte une histoire. Explorez notre collection et laissez-vous guider par votre curiosité.
          </I18nText>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="mr-2 h-5 w-5" />
            <I18nText translationKey="symbolTriptych.exploreCollection">Explorer la Collection Complète</I18nText>
          </Button>
        </div>
      </div>

      {/* Galerie de symboles avec vraies données */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-500" />
            Aperçu de la Collection
          </h3>
          <p className="text-slate-600">Cliquez sur un symbole pour en découvrir l'histoire</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
        )}
      </div>

      {/* Transition narrative vers l'étape suivante */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-3xl p-8 border border-blue-200">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Prêt pour l'étape suivante ?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Une fois que vous avez découvert des symboles qui vous intriguent, 
            organisez-les en collections thématiques pour approfondir votre exploration.
          </p>
          <div className="flex items-center justify-center">
            <ChevronDown className="h-6 w-6 text-blue-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
