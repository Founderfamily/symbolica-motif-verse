
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Palette, Zap } from 'lucide-react';
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
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-100 to-orange-200 text-amber-800 inline-block mb-4">
          <I18nText translationKey="symbolTriptych" ns="sections">Galerie Moderne</I18nText>
        </span>
        <h2 className="text-5xl font-bold mb-6 text-center bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
          <I18nText translationKey="title" ns="symbolTriptych">Motifs & Inspirations</I18nText>
        </h2>
        <p className="text-center text-slate-600 mb-8 max-w-3xl mx-auto text-lg leading-relaxed">
          <I18nText translationKey="description" ns="symbolTriptych">
            Découvrez l'évolution des symboles ancestraux vers leurs réinterprétations modernes
          </I18nText>
        </p>

        {/* Indicateurs visuels */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="flex items-center space-x-2 text-blue-600">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium">Motifs Traditionnels</span>
          </div>
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium">Réutilisations Modernes</span>
          </div>
          <div className="flex items-center space-x-2 text-amber-600">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm font-medium">Inspirations Contemporaines</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            onClick={handleExploreMore}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="mr-2 h-5 w-5" />
            <I18nText translationKey="exploreMore" ns="symbolTriptych">Explorer la Collection</I18nText>
          </Button>
        </div>
      </div>

      {/* Galerie moderne utilisant SymbolGrid qui fonctionne */}
      <div className="mb-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          </div>
        ) : (
          <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
        )}
      </div>

      {/* Détails du symbole sélectionné - version simplifiée */}
      {selectedSymbol && (
        <div className="mt-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Zoom sur: {selectedSymbol.name}
            </h3>
            <p className="text-slate-600">
              Explorez les détails et les inspirations de ce symbole
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-slate-800 mb-2">{selectedSymbol.name}</h4>
              <p className="text-slate-600 mb-4">{selectedSymbol.culture} • {selectedSymbol.period}</p>
              {selectedSymbol.description && (
                <p className="text-slate-700">{selectedSymbol.description}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Section d'inspiration */}
      <div className="mt-16 bg-gradient-to-br from-slate-50 to-white rounded-3xl p-8 border border-slate-200">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
            <Palette className="h-8 w-8 text-amber-500" />
            Du Traditionnel au Moderne
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Chaque symbole raconte une histoire millénaire qui continue d'inspirer 
            les créateurs contemporains dans l'art, le design et l'architecture.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Patrimoine Ancestral</h4>
            <p className="text-sm text-slate-600">
              Préservation des techniques et significations originelles
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Innovation Moderne</h4>
            <p className="text-sm text-slate-600">
              Réinterprétation créative dans les nouveaux médias
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="h-6 w-6 text-amber-600" />
            </div>
            <h4 className="font-semibold text-slate-800 mb-2">Fusion Créative</h4>
            <p className="text-sm text-slate-600">
              Synthèse harmonieuse entre tradition et modernité
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SymbolTriptychSection;
