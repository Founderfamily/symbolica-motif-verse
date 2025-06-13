
import React from 'react';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Indicateur d'étape finale */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-100 text-red-800 font-semibold mb-6">
          <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
          <I18nText translationKey="callToAction.step4">Lancez votre première quête</I18nText>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-red-800 via-red-600 to-red-500 bg-clip-text text-transparent">
          <I18nText translationKey="callToAction.joinUs">Votre Aventure Commence Maintenant</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="callToAction.description">
            Vous avez tout ce qu'il faut : des symboles à explorer, des collections à créer, une communauté pour vous accompagner. Lancez votre première quête !
          </I18nText>
        </p>
      </div>

      {/* Actions finales avec design immersif */}
      <div className="bg-gradient-to-br from-red-50 via-red-100 to-orange-100 rounded-3xl p-8 md:p-12 border border-red-200 shadow-xl">
        <div className="text-center mb-8">
          <Target className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            Choisissez Votre Première Mission
          </h3>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Trois façons de commencer votre exploration du patrimoine symbolique mondial
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg shadow-red-600/20 px-8 py-4 rounded-xl"
            onClick={() => navigate('/auth')}
          >
            <Zap className="mr-2 h-5 w-5" />
            <I18nText translationKey="callToAction.join">Créer Mon Compte</I18nText> 
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="border-red-300 text-red-700 hover:bg-red-50 px-8 py-4 rounded-xl"
            onClick={() => navigate('/symbols')}
          >
            <I18nText translationKey="callToAction.explore">Explorer Sans Compte</I18nText>
          </Button>

          <Button 
            variant="outline" 
            size="lg" 
            className="border-red-300 text-red-700 hover:bg-red-50 px-8 py-4 rounded-xl"
            onClick={() => navigate('/community')}
          >
            <I18nText translationKey="callToAction.community">Voir la Communauté</I18nText>
          </Button>
        </div>
        
        <p className="text-sm text-slate-500 text-center">
          <I18nText translationKey="callToAction.support">
            Vos contributions aident à préserver le patrimoine symbolique mondial pour les générations futures.
          </I18nText>
        </p>
      </div>
    </section>
  );
};

export default CallToAction;
