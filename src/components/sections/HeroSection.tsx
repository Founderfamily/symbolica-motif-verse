
import React from 'react';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-50 to-white opacity-70"></div>
        <div className="absolute w-full h-full pattern-grid-lg opacity-5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero text content */}
          <div>
            <div className="inline-block p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full mb-6">
              <div className="bg-gradient-to-r from-amber-800/20 to-amber-700/20 px-4 py-1 rounded-full text-amber-900 text-sm font-medium">
                <I18nText translationKey="hero.new" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              <I18nText translationKey="hero.heading2" />
            </h1>
            
            <p className="text-xl text-slate-700 mb-8 max-w-lg">
              <I18nText translationKey="hero.subheading2" />
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/explore">
                <Button size="lg" className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/20">
                  <I18nText translationKey="hero.explore" /> 
                  <Search className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/contributions">
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <I18nText translationKey="hero.contribute" /> 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Hero visual */}
          <div className="relative h-full min-h-[400px] flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-100 to-amber-50 rounded-full opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 transform rotate-12">
                  {['mandala', 'triskelion', 'fleur-de-lys', 'viking'].map((symbol, i) => (
                    <div 
                      key={i}
                      className="rounded-lg overflow-hidden shadow-lg hover:scale-110 transition-transform duration-300"
                    >
                      <img 
                        src={`/images/symbols/${symbol}.png`} 
                        alt={symbol}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
