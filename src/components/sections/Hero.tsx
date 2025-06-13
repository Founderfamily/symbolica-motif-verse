
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { I18nText } from '@/components/ui/i18n-text';

const Hero = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/symbols');
  };

  return (
    <section className="relative pt-16 md:pt-24 pb-16 md:pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Subtle background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-stone-200/40 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-amber-50 to-stone-50 rounded-full mb-8">
          <div className="bg-white/80 px-4 py-1 rounded-full text-stone-700 text-sm font-medium border border-stone-200">
            <I18nText translationKey="app.version">Version 1.2.0</I18nText>
          </div>
        </div>

        <div className="space-y-6 mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-stone-800 font-adventure leading-tight">
            Symbol Explorer
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-light">
            Discover the world's heritage
          </p>
        </div>
        
        <Button 
          size="lg" 
          onClick={handleExploreClick}
          className="bg-stone-800 hover:bg-stone-900 text-amber-50 font-semibold px-10 py-4 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300"
        >
          <I18nText translationKey="hero.explore">Start Exploring</I18nText> 
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
