
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Gem, MapPin, Compass } from 'lucide-react';
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
      {/* Design Salle des Trésors */}
      <div className="relative">
        {/* Éclairage dramatique de trésor */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-radial from-yellow-400/30 via-amber-300/20 to-transparent rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Titre avec style gravure ancienne */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-3 bg-amber-900/80 backdrop-blur-sm px-8 py-4 rounded-full shadow-2xl border-2 border-yellow-400 mb-8">
            <Gem className="h-8 w-8 text-yellow-400 animate-pulse" />
            <span className="font-bold text-2xl text-yellow-100 tracking-wider">SALLE DES ARTEFACTS</span>
            <Gem className="h-8 w-8 text-yellow-400 animate-pulse" />
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-amber-900 text-shadow-lg" style={{ textShadow: '3px 3px 6px rgba(139, 69, 19, 0.5)' }}>
            <I18nText translationKey="symbolTriptych.title">Découvrez les Symboles Anciens</I18nText>
          </h2>
          
          <p className="text-2xl text-amber-800 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
            <I18nText translationKey="symbolTriptych.description">
              Chaque symbole est un trésor oublié, porteur de secrets millénaires. 
              Explorez notre collection d'artefacts et percez les mystères des civilisations perdues.
            </I18nText>
          </p>

          <div className="flex justify-center mb-16">
            <Button 
              onClick={handleExploreMore}
              size="lg"
              className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-800 hover:to-amber-950 text-yellow-100 px-16 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-4 border-yellow-400 text-xl font-bold"
            >
              <MapPin className="mr-4 h-6 w-6" />
              <I18nText translationKey="symbolTriptych.exploreCollection">EXPLORER LE TEMPLE</I18nText>
              <Compass className="ml-4 h-6 w-6 animate-spin" />
            </Button>
          </div>
        </div>

        {/* Galerie style coffre au trésor */}
        <div className="mb-16 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-800/90 to-amber-900/90 backdrop-blur-sm px-8 py-4 rounded-full shadow-xl border-2 border-yellow-500">
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="font-bold text-xl text-yellow-100">Trésor en Vue</span>
              <div className="w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <p className="text-amber-800 mt-6 text-lg font-medium">Cliquez sur un artefact pour révéler ses secrets</p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative">
                <div className="animate-spin rounded-full h-20 w-20 border-4 border-amber-600 border-t-yellow-400"></div>
                <div className="absolute inset-0 rounded-full border-4 border-amber-200"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 opacity-50 animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {/* Effet coffre au trésor ouvert */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-yellow-600/10 to-amber-800/20 rounded-3xl"></div>
              <div className="relative bg-gradient-to-br from-amber-50/90 to-yellow-100/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-amber-600 shadow-2xl">
                {/* Coins décoratifs */}
                <div className="absolute top-4 left-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-yellow-400 rounded-full shadow-lg"></div>
                
                <SymbolGrid symbols={symbols?.slice(0, 6) || []} />
              </div>
            </div>
          )}
        </div>

        {/* Message de transition épique */}
        <div className="text-center">
          <div className="relative max-w-3xl mx-auto">
            {/* Parchemin ancien */}
            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-2xl p-10 border-4 border-amber-700 shadow-2xl relative">
              {/* Effet brûlures */}
              <div className="absolute top-2 left-2 w-4 h-4 bg-amber-800 rounded-full opacity-50"></div>
              <div className="absolute top-2 right-2 w-4 h-4 bg-amber-800 rounded-full opacity-50"></div>
              
              <h3 className="text-3xl font-bold text-amber-900 mb-6 text-shadow" style={{ textShadow: '2px 2px 4px rgba(139, 69, 19, 0.3)' }}>
                Artefacts Découverts ?
              </h3>
              <p className="text-xl text-amber-800 leading-relaxed font-medium">
                Parfait ! Maintenant, classez vos trouvailles dans votre coffre personnel 
                pour créer votre propre carte au trésor et devenir un maître explorateur.
              </p>
              
              {/* Flèche de direction vers l'étape suivante */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <ArrowRight className="h-6 w-6 text-white" />
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
