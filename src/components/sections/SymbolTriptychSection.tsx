
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
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
      {/* Titre principal avec design épuré */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800">
          <I18nText translationKey="symbolTriptych.title">Découvrez les Symboles</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="symbolTriptych.description">
            Chaque symbole raconte une histoire unique. Explorez notre collection et laissez-vous guider par votre curiosité pour découvrir des trésors culturels du monde entier.
          </I18nText>
        </p>

        <div className="flex justify-center mb-16">
          <Button 
            onClick={handleExploreMore}
            size="lg"
            className="bg-slate-800 hover:bg-slate-900 text-white px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Search className="mr-3 h-5 w-5" />
            <I18nText translationKey="symbolTriptych.exploreCollection">Explorer la Collection</I18nText>
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Galerie de symboles avec design immersif */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-slate-200">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-800">Aperçu de la Collection</span>
          </div>
          <p className="text-slate-600 mt-4">Cliquez sur un symbole pour découvrir son histoire</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <div className="absolute inset-0 rounded-full border-2 border-slate-200"></div>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl">
            <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
          </div>
        )}
      </div>

      {/* Message de transition narratif */}
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Symboles découverts ?
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Parfait ! Maintenant, organisez vos découvertes en collections thématiques 
            pour approfondir votre exploration et créer votre propre parcours culturel.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
