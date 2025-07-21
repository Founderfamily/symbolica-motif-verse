
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';

const ImprovedCallToAction = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Main CTA */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-blue-50 p-12 rounded-3xl border border-amber-100 mb-12">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-800 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Prêt pour l'aventure ?
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-slate-800 mb-6 leading-tight">
            Choisissez votre voie
          </h2>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
            Que vous soyez passionné d'histoire ou assoiffé d'aventure, 
            Symbolica vous offre une expérience unique adaptée à vos intérêts.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Academic Path */}
            <div className="bg-white p-8 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-colors">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Voie Académique
              </h3>
              
              <p className="text-slate-600 mb-6">
                Étudiez le patrimoine culturel avec rigueur. 
                Accédez à des analyses expertes et collaborez avec des historiens.
              </p>
              
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Collections curées par des experts</li>
                <li>• Standards UNESCO</li>
                <li>• Timeline interactive complète</li>
                <li>• Communauté d'historiens</li>
              </ul>
              
              <Button 
                onClick={() => navigate('/collections')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Explorer le Patrimoine
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Adventure Path */}
            <div className="bg-white p-8 rounded-2xl border-2 border-amber-200 hover:border-amber-400 transition-colors">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-4">
                Voie Aventure
              </h3>
              
              <p className="text-slate-600 mb-6">
                Partez à la chasse aux trésors ! 
                Résolvez des énigmes et participez à de vraies découvertes.
              </p>
              
              <ul className="text-sm text-slate-600 space-y-2 mb-6">
                <li>• Quêtes en temps réel</li>
                <li>• Indices collaboratifs</li>
                <li>• Vrais trésors à découvrir</li>
                <li>• Communauté d'explorateurs</li>
              </ul>
              
              <Button 
                onClick={() => navigate('/quests')}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                Rejoindre l'Aventure
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary CTA */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Ou découvrez tout ce que Symbolica a à offrir
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => navigate('/auth')}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
          >
            Créer un Compte Gratuit
          </Button>
          
          <Button 
            onClick={() => navigate('/about')}
            size="lg"
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            En Savoir Plus
          </Button>
        </div>
        
        <p className="text-slate-500 mt-4">
          Rejoignez plus de 10 000 passionnés de patrimoine culturel
        </p>
      </div>
    </section>
  );
};

export default ImprovedCallToAction;
