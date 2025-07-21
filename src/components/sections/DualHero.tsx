
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Compass, Sparkles, Map } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';

const DualHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-8 md:pt-12 pb-12 md:pb-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-blue-100/20 rounded-full blur-2xl"></div>
      </div>

      {/* Version badge */}
      <div className="text-center mb-8">
        <div className="inline-block p-2 bg-gradient-to-r from-stone-50 to-amber-50 rounded-full">
          <div className="bg-white/75 px-4 py-1 rounded-full text-stone-700 text-sm font-medium border border-amber-100">
            <I18nText translationKey="app.version">Version 1.2.0</I18nText>
          </div>
        </div>
      </div>

      {/* Dual Hero Content */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        
        {/* Left Side - Heritage/Educational */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4 mr-2" />
            Patrimoine Culturel
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
            Découvrez l'héritage 
            <span className="text-blue-600"> symbolique</span> mondial
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            Explorez et apprenez sur les symboles culturels à travers les civilisations. 
            Une approche académique et rigoureuse du patrimoine mondial.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/collections')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Explorer le Patrimoine
            </Button>
            <Button 
              onClick={() => navigate('/analysis')}
              variant="outline"
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              Analyses Académiques
            </Button>
          </div>
        </div>

        {/* Right Side - Adventure/Treasures */}
        <div className="text-center md:text-left space-y-6">
          <div className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            <Compass className="w-4 h-4 mr-2" />
            Chasse aux Trésors
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
            Rejoignez la quête des 
            <span className="text-amber-600"> trésors oubliés</span>
          </h1>
          
          <p className="text-lg text-slate-600 leading-relaxed">
            Participez à de vraies découvertes, suivez des indices en temps réel 
            et rejoignez une communauté d'explorateurs passionnés.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/quests')}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Compass className="w-4 h-4 mr-2" />
              Rejoindre l'Aventure
            </Button>
            <Button 
              onClick={() => navigate('/community')}
              variant="outline"
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <Map className="w-4 h-4 mr-2" />
              Communauté d'Explorateurs
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom CTA with AI highlight */}
      <div className="text-center mt-12 pt-8 border-t border-slate-200">
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full text-purple-800 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 mr-2" />
          Nouvelle possibilité avec l'IA
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Grâce à l'intelligence artificielle, nous découvrons de nouveaux indices 
          et révélons des connexions inattendues entre les symboles du passé.
        </p>
      </div>
    </section>
  );
};

export default DualHero;
