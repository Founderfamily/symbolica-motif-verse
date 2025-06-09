
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Globe, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';
import { EnhancedSymbolCard } from '@/components/search/EnhancedSymbolCard';

const InteractiveHero = () => {
  const [animatedCount, setAnimatedCount] = useState({ symbols: 0, cultures: 0, users: 0 });
  const { data: symbols } = useAllSymbols();
  
  const featuredSymbols = symbols?.slice(0, 6) || [];
  
  // Animation des compteurs
  useEffect(() => {
    const targetValues = {
      symbols: symbols?.length || 42,
      cultures: 25,
      users: 1200
    };
    
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedCount({
        symbols: Math.floor(targetValues.symbols * progress),
        cultures: Math.floor(targetValues.cultures * progress),
        users: Math.floor(targetValues.users * progress)
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedCount(targetValues);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [symbols?.length]);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-blue-50/20 overflow-hidden">
      {/* Symboles flottants en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 animate-float-slow">
          <div className="w-16 h-16 bg-amber-300 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-40 right-20 animate-float-medium">
          <div className="w-12 h-12 bg-blue-300 rounded-lg opacity-40 rotate-45"></div>
        </div>
        <div className="absolute bottom-40 left-20 animate-float-fast">
          <div className="w-20 h-20 bg-green-300 rounded-full opacity-50"></div>
        </div>
        <div className="absolute bottom-20 right-10 animate-float-slow">
          <div className="w-14 h-14 bg-purple-300 rounded-lg opacity-60 rotate-12"></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          {/* Badge de présentation */}
          <div className="flex justify-center mb-8">
            <Badge className="px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              <I18nText translationKey="museumPortal" ns="sections">Musée Symbolica</I18nText>
            </Badge>
          </div>

          {/* Titre animé */}
          <h1 className="text-6xl md:text-7xl font-bold mb-8 animate-fade-in-up">
            <span className="bg-gradient-to-r from-slate-800 via-amber-600 to-slate-700 bg-clip-text text-transparent">
              <I18nText translationKey="heading" ns="hero">
                Découvrez le patrimoine symbolique mondial
              </I18nText>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up">
            <I18nText translationKey="subheading" ns="hero">
              Explorez, contribuez et apprenez sur les symboles culturels à travers les âges
            </I18nText>
          </p>

          {/* Statistiques animées */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16">
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg">
              <div className="text-4xl font-bold text-amber-600 mb-2">
                {animatedCount.symbols}+
              </div>
              <div className="text-slate-600 font-medium">Symboles</div>
              <Eye className="w-5 h-5 text-amber-500 mx-auto mt-2" />
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {animatedCount.cultures}+
              </div>
              <div className="text-slate-600 font-medium">Cultures</div>
              <Globe className="w-5 h-5 text-blue-500 mx-auto mt-2" />
            </div>
            <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {animatedCount.users}+
              </div>
              <div className="text-slate-600 font-medium">Membres</div>
              <Users className="w-5 h-5 text-green-500 mx-auto mt-2" />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link to="/symbols">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <Search className="mr-3 h-6 w-6" />
                <I18nText translationKey="explore" ns="hero">Commencer l'exploration</I18nText>
              </Button>
            </Link>
            <Link to="/community">
              <Button variant="outline" size="lg" className="border-2 border-amber-300 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Users className="mr-3 h-6 w-6" />
                <I18nText translationKey="community" ns="hero">Explorer la communauté</I18nText>
              </Button>
            </Link>
          </div>
        </div>

        {/* Mini-explorateur de symboles */}
        {featuredSymbols.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 border border-slate-200/50 shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-slate-800 mb-4 flex items-center justify-center gap-3">
                <Sparkles className="h-8 w-8 text-amber-500" />
                Aperçu de notre Collection
              </h3>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Découvrez quelques-uns de nos symboles les plus fascinants pour commencer votre voyage
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredSymbols.map((symbol) => (
                <div key={symbol.id} className="transform hover:scale-105 transition-all duration-300">
                  <EnhancedSymbolCard symbol={symbol} />
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link to="/symbols">
                <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Voir toute la collection →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InteractiveHero;
