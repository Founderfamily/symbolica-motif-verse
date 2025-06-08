
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, BarChart3, Database, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';

const Hero = () => {
  const navigate = useNavigate();

  const handleCommunityClick = () => {
    navigate('/community');
    // Scroll vers la section des groupes si on est déjà sur la page community
    setTimeout(() => {
      const groupsSection = document.querySelector('[data-testid="community-groups"]');
      if (groupsSection) {
        groupsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleExploreClick = () => {
    navigate('/symbols');
  };

  return (
    <section className="relative pt-10 md:pt-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-10 relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full mb-4 animate-pulse-light">
          <div className="bg-gradient-to-r from-amber-800/20 to-amber-700/20 px-4 py-1 rounded-full text-amber-900 text-sm font-medium">
            <I18nText translationKey="app.version">Version 1.2.0</I18nText>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
            <I18nText translationKey="hero.heading">
              Découvrez le patrimoine symbolique mondial
            </I18nText>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
            <I18nText translationKey="hero.subheading">
              Explorez, contribuez et apprenez sur les symboles culturels à travers les âges
            </I18nText>
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 mb-8">
          <Button 
            size="lg" 
            onClick={handleCommunityClick}
            className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold px-8 py-4 rounded-full border-2 border-orange-800 shadow-lg transform hover:-translate-y-1 transition-all"
          >
            <Users className="mr-2 h-4 w-4" />
            <I18nText translationKey="hero.community">Rejoindre la communauté</I18nText> 
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={handleExploreClick}
            className="bg-white text-slate-700 font-semibold px-8 py-4 rounded-full border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 shadow-lg transform hover:-translate-y-1 transition-all"
          >
            <I18nText translationKey="hero.explore">Commencer l'exploration</I18nText> 
            <MapPin className="ml-2 h-4 w-4 text-orange-600" />
          </Button>
        </div>

        {/* New Features Showcase */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
            <BarChart3 className="w-3 h-3 mr-1" />
            <I18nText translationKey="hero.features.realTimeAnalytics">Analytics temps réel</I18nText>
          </Badge>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
            <Database className="w-3 h-3 mr-1" />
            <I18nText translationKey="hero.features.hybridData">Données hybrides en/hors ligne</I18nText>
          </Badge>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
            <FileText className="w-3 h-3 mr-1" />
            <I18nText translationKey="hero.features.advancedReports">Rapports avancés disponibles</I18nText>
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default Hero;
