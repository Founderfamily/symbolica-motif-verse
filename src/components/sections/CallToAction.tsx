
import React from 'react';
import { ArrowRight, Zap, Target, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Titre principal dramatique */}
      <div className="text-center mb-16">
        <h2 className="text-6xl md:text-7xl font-bold mb-6 text-slate-800">
          <I18nText translationKey="callToAction.joinUs">Votre Aventure Commence</I18nText>
        </h2>
        
        <p className="text-2xl text-slate-600 max-w-4xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="callToAction.description">
            Vous avez découvert les symboles, créé des collections, rejoint la communauté. 
            Il est temps de lancer votre première quête d'exploration !
          </I18nText>
        </p>
      </div>

      {/* Actions finales avec design immersif */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 border border-slate-700 shadow-2xl text-white relative overflow-hidden">
        {/* Effet de background subtil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white animate-float-slow"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 rotate-45 border border-white animate-float-medium"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border border-white animate-float-fast"></div>
        </div>

        <div className="relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <Target className="h-6 w-6 text-white" />
              <span className="font-medium text-white">Mission Finale</span>
            </div>
            <h3 className="text-4xl font-bold text-white mb-6">
              Choisissez Votre Première Mission
            </h3>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Trois façons de commencer votre exploration du patrimoine symbolique mondial
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-center gap-8 mb-12">
            <Button 
              size="lg" 
              className="bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:shadow-2xl px-12 py-6 rounded-2xl text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/auth')}
            >
              <Rocket className="mr-3 h-6 w-6" />
              <I18nText translationKey="callToAction.join">Créer Mon Compte</I18nText> 
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/symbols')}
            >
              <I18nText translationKey="callToAction.explore">Explorer Sans Compte</I18nText>
            </Button>

            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/30 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate('/community')}
            >
              <I18nText translationKey="callToAction.community">Voir la Communauté</I18nText>
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto">
              <I18nText translationKey="callToAction.support">
                Vos contributions aident à préserver le patrimoine symbolique mondial pour les générations futures.
              </I18nText>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
