
import React from 'react';
import { ArrowRight, Compass, Anchor, Skull, Crown, Swords } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Design Pont de Navire face à l'horizon */}
      <div className="relative">
        {/* Effet horizon océanique et coucher de soleil */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue-600/30 via-cyan-400/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-orange-400/30 via-yellow-300/20 to-transparent"></div>
          {/* Vagues stylisées */}
          <div className="absolute bottom-0 left-0 w-full h-20 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z" fill="#3b82f6" className="animate-pulse" />
            </svg>
          </div>
        </div>

        {/* Titre dramatique de capitaine */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-4 bg-red-900/80 backdrop-blur-sm px-10 py-5 rounded-full shadow-2xl border-2 border-orange-400 mb-8">
            <Compass className="h-8 w-8 text-orange-400 animate-spin" />
            <span className="font-bold text-2xl text-orange-100 tracking-wider">EXPÉDITION FINALE</span>
            <Compass className="h-8 w-8 text-orange-400 animate-spin" />
          </div>
          
          <h2 className="text-7xl md:text-8xl font-bold mb-8 text-red-900 text-shadow-lg" style={{ textShadow: '4px 4px 8px rgba(127, 29, 29, 0.5)' }}>
            <I18nText translationKey="callToAction.joinUs">Votre Légende Commence</I18nText>
          </h2>
          
          <p className="text-2xl text-red-800 max-w-4xl mx-auto mb-12 leading-relaxed font-medium">
            <I18nText translationKey="callToAction.description">
              Vous avez découvert les artefacts, tracé vos cartes, recruté votre équipage. 
              Maintenant, hissez les couleurs et lancez-vous dans l'aventure de votre vie !
            </I18nText>
          </p>
        </div>

        {/* Pont de navire avec actions finales */}
        <div className="relative">
          {/* Effet pont de navire */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-yellow-600/20 to-amber-800/40 rounded-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 rounded-3xl p-12 border-4 border-orange-500 shadow-2xl text-white overflow-hidden">
            {/* Effet de tempête dramatique en arrière-plan */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 rounded-full border-2 border-white animate-ping" style={{ animationDuration: '4s' }}></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 rotate-45 border-2 border-white animate-pulse" style={{ animationDuration: '3s' }}></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full border border-white animate-spin" style={{ animationDuration: '8s' }}></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-4 bg-orange-600/80 backdrop-blur-sm px-8 py-4 rounded-full mb-8 border-2 border-yellow-400">
                  <Crown className="h-8 w-8 text-yellow-400 animate-pulse" />
                  <span className="font-bold text-2xl text-yellow-100">MISSION LÉGENDAIRE</span>
                </div>
                <h3 className="text-5xl font-bold text-orange-100 mb-8">
                  Choisissez Votre Destinée
                </h3>
                <p className="text-2xl text-orange-200 max-w-3xl mx-auto">
                  Trois routes s'ouvrent devant vous, Capitaine. Choisissez votre voie vers la gloire !
                </p>
              </div>

              <div className="flex flex-col lg:flex-row justify-center gap-8 mb-12">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-2xl hover:shadow-3xl px-16 py-8 rounded-2xl text-xl font-bold transform hover:-translate-y-2 transition-all duration-500 border-4 border-yellow-400"
                  onClick={() => navigate('/auth')}
                >
                  <Crown className="mr-4 h-8 w-8" />
                  <I18nText translationKey="callToAction.join">Devenir Capitaine</I18nText> 
                  <Swords className="ml-4 h-8 w-8" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-4 border-orange-400 bg-orange-100/20 text-orange-100 hover:bg-orange-100/30 px-16 py-8 rounded-2xl text-xl font-bold transform hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
                  onClick={() => navigate('/symbols')}
                >
                  <Compass className="mr-4 h-8 w-8" />
                  <I18nText translationKey="callToAction.explore">Explorer en Solo</I18nText>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-4 border-orange-400 bg-orange-100/20 text-orange-100 hover:bg-orange-100/30 px-16 py-8 rounded-2xl text-xl font-bold transform hover:-translate-y-2 transition-all duration-500 backdrop-blur-sm"
                  onClick={() => navigate('/community')}
                >
                  <Anchor className="mr-4 h-8 w-8" />
                  <I18nText translationKey="callToAction.community">Rejoindre la Flotte</I18nText>
                </Button>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-red-800/50 backdrop-blur-sm px-8 py-4 rounded-full border-2 border-orange-400">
                  <Skull className="h-6 w-6 text-orange-400" />
                  <p className="text-orange-200 leading-relaxed max-w-2xl font-medium">
                    <I18nText translationKey="callToAction.support">
                      Vos exploits contribuent à préserver les trésors du patrimoine mondial pour les générations futures de corsaires.
                    </I18nText>
                  </p>
                  <Skull className="h-6 w-6 text-orange-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boussole finale pointant vers l'horizon */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-amber-600 to-orange-700 px-8 py-4 rounded-full shadow-2xl border-4 border-yellow-400">
            <Compass className="h-8 w-8 text-yellow-200 animate-spin" />
            <span className="text-2xl font-bold text-yellow-100">L'AVENTURE VOUS ATTEND</span>
            <Compass className="h-8 w-8 text-yellow-200 animate-spin" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
