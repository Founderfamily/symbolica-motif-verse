
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';
import { Button } from '@/components/ui/button';
import { Sparkles, Users, BookOpen, Compass } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-20 pb-24 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Symbolic background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-amber-200/40 to-amber-300/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-yellow-200/30 to-amber-300/40 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
          <div className="w-80 h-80 border-2 border-amber-400 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold font-adventure leading-tight tracking-wide">
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-700 bg-clip-text text-transparent">
              DEVENEZ ACTEUR
            </span>
            <br />
            <span className="text-slate-800">DU PATRIMOINE CULTUREL</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto font-light leading-relaxed">
            Ne soyez plus spectateur : contribuez, découvrez et préservez l'héritage symbolique mondial avec une communauté passionnée
          </p>

          {/* Action badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8 mb-12">
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full border border-amber-200">
              <Sparkles className="w-5 h-5 text-amber-700" />
              <span className="text-amber-800 font-medium">Patrimoine Vivant</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 py-2 rounded-full border border-amber-200">
              <Users className="w-5 h-5 text-amber-700" />
              <span className="text-amber-800 font-medium">Communauté Active</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/collections')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Commencer l'Exploration
            </Button>
            <Button 
              onClick={() => navigate('/contribute')}
              variant="outline"
              className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              <Compass className="w-5 h-5 mr-2" />
              Contribuer Maintenant
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
