
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-8 md:pt-12 pb-8 md:pb-12 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Subtle background elements - aligned with CommunityHub */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-stone-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-amber-50/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-stone-50 to-amber-50 rounded-full mb-4">
          <div className="bg-white/75 px-4 py-1 rounded-full text-stone-700 text-sm font-medium border border-amber-100">
            <I18nText translationKey="app.version">Version 1.2.0</I18nText>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-5xl font-bold text-stone-800 font-adventure leading-tight">
            <I18nText translationKey="hero.heading">Découvrez le patrimoine symbolique mondial</I18nText>
          </h1>
          <p className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto font-light">
            <I18nText translationKey="hero.subheading">Explorez, contribuez et apprenez sur les symboles culturels à travers les âges</I18nText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
