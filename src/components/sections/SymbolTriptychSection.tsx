
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Map } from 'lucide-react';
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
        {/* Section Header - Simplified */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
            <I18nText translationKey="symbolTriptych.title">Explorez en Détail</I18nText>
          </h2>
          
          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <I18nText translationKey="symbolTriptych.description">
              Découvrez l'évolution des symboles à travers le temps et les cultures.
            </I18nText>
          </p>

          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-stone-800 hover:bg-stone-900 text-amber-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Map className="mr-2 h-4 w-4" />
            <I18nText translationKey="symbolTriptych.exploreCollection">View Collection</I18nText>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Symbol Gallery */}
        <div className="mb-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-stone-800 border-t-amber-500"></div>
            </div>
          ) : (
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200">
                <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
              </div>
            </div>
          )}
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-amber-600 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                <I18nText translationKey="symbolTriptych.transitionTitle">Symboles découverts ?</I18nText>
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                <I18nText translationKey="symbolTriptych.transitionMessage">
                  Parfait ! Maintenant organisez vos découvertes en collections 
                  pour créer votre propre carte au trésor.
                </I18nText>
              </p>
              
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-white" />
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
