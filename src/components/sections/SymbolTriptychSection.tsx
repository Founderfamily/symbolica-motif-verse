
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Compass, Map, Scroll } from 'lucide-react';
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

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-stone-800/90 backdrop-blur-sm px-8 py-4 rounded-full mb-8 shadow-lg">
            <Scroll className="h-6 w-6 text-amber-400" />
            <span className="font-semibold text-lg text-amber-100 tracking-wide">DÉCOUVERTE</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-stone-800 font-adventure">
            <I18nText translationKey="symbolTriptych.title">Explorez les Symboles Anciens</I18nText>
          </h2>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            <I18nText translationKey="symbolTriptych.description">
              Chaque symbole raconte une histoire. Explorez notre collection d'artefacts 
              et découvrez les secrets des civilisations perdues.
            </I18nText>
          </p>

          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-amber-100 px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Map className="mr-3 h-5 w-5" />
            <I18nText translationKey="symbolTriptych.exploreCollection">Explorer la Collection</I18nText>
            <Compass className="ml-3 h-5 w-5" />
          </Button>
        </div>

        {/* Symbol Gallery */}
        <div className="mb-16">
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-stone-800 border-t-amber-500"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-stone-200">
                <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
              </div>
            </div>
          )}
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-amber-50 rounded-xl p-8 border-l-4 border-amber-600 shadow-sm">
              <h3 className="text-2xl font-semibold text-stone-800 mb-4">
                Symbols discovered?
              </h3>
              <p className="text-lg text-stone-600 leading-relaxed">
                Perfect! Now organize your findings into collections 
                to create your own treasure map.
              </p>
              
              <div className="mt-6 flex justify-center">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
