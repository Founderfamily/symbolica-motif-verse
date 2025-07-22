
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative pt-16 pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Elegant background elements inspired by symbols */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-amber-100/30 to-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 bg-gradient-to-br from-stone-100/40 to-stone-200/30 rounded-full blur-2xl"></div>
      </div>
      
      <div className="text-center relative z-10">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-stone-900 font-adventure leading-tight tracking-wide">
            <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent">
              EXPLOREZ LE PATRIMOINE
            </span>
            <br />
            <span className="text-stone-800">SYMBOLIQUE MONDIAL</span>
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 max-w-4xl mx-auto font-light leading-relaxed">
            <I18nText translationKey="hero.subheading">Découvrez des symboles culturels authentiques, leurs significations et leurs histoires à travers les civilisations</I18nText>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
