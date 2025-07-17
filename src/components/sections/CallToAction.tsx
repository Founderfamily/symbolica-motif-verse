
import React from 'react';
import { ArrowRight, Compass, Globe, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { I18nText } from '@/components/ui/i18n-text';

const CallToAction = () => {
  const navigate = useNavigate();
  
  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-stone-800/90 backdrop-blur-sm px-8 py-4 rounded-full mb-8 shadow-lg">
            <Compass className="h-6 w-6 text-amber-400" />
            <span className="font-semibold text-lg text-amber-100 tracking-wide">
              <I18nText translationKey="callToAction.adventure">AVENTURE</I18nText>
            </span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-stone-800 font-adventure">
            <I18nText translationKey="callToAction.joinUs">Your Journey Begins</I18nText>
          </h2>
          
          <p className="text-xl text-stone-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            <I18nText translationKey="callToAction.description">
              You've discovered symbols, organized collections, and found your community. 
              Now it's time to embark on your greatest adventure yet.
            </I18nText>
          </p>
        </div>

        {/* Main CTA Section */}
        <div className="relative">
          <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-2xl p-12 shadow-2xl text-white overflow-hidden relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-32 h-32 rounded-full border border-white"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 rounded-full border border-white"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full border border-white"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-3 bg-amber-600/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6 border border-amber-400/30">
                  <Crown className="h-6 w-6 text-amber-400" />
                  <span className="font-semibold text-lg text-amber-100"><I18nText translationKey="callToAction.ready">PRÊT POUR L'AVENTURE</I18nText></span>
                </div>
                <h3 className="text-4xl font-bold text-white mb-6">
                  <I18nText translationKey="callToAction.choosePath">Choisissez Votre Voie</I18nText>
                </h3>
                <p className="text-xl text-stone-300 max-w-2xl mx-auto">
                  <I18nText translationKey="callToAction.pathsDesc">Trois chemins s'offrent à vous. Choisissez votre destin et devenez un explorateur légendaire.</I18nText>
                </p>
              </div>

              <div className="flex flex-col lg:flex-row justify-center gap-6 mb-8">
                <Button 
                  size="lg" 
                  className="bg-amber-600 hover:bg-amber-700 text-white shadow-lg hover:shadow-xl px-12 py-4 rounded-full text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300"
                  onClick={() => navigate('/auth')}
                >
                  <Crown className="mr-3 h-5 w-5" />
                  <I18nText translationKey="callToAction.join">Join as Explorer</I18nText> 
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-amber-400 bg-amber-100/10 text-amber-100 hover:bg-amber-100/20 px-12 py-4 rounded-full text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => navigate('/symbols')}
                >
                  <Compass className="mr-3 h-5 w-5" />
                  <I18nText translationKey="callToAction.explore">Explore Solo</I18nText>
                </Button>

                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-amber-400 bg-amber-100/10 text-amber-100 hover:bg-amber-100/20 px-12 py-4 rounded-full text-lg font-semibold transform hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm"
                  onClick={() => navigate('/community')}
                >
                  <Globe className="mr-3 h-5 w-5" />
                  <I18nText translationKey="callToAction.community">Join Community</I18nText>
                </Button>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center gap-3 bg-stone-700/50 backdrop-blur-sm px-6 py-3 rounded-full border border-stone-600/30">
                  <p className="text-stone-300 max-w-xl font-medium">
                    <I18nText translationKey="callToAction.support">
                      Your contributions help preserve world heritage for future generations of explorers.
                    </I18nText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final navigation indicator */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-3 bg-stone-800 px-6 py-3 rounded-full shadow-lg">
            <Compass className="h-5 w-5 text-amber-400" />
            <span className="text-lg font-semibold text-amber-100"><I18nText translationKey="callToAction.awaits">VOTRE AVENTURE VOUS ATTEND</I18nText></span>
            <Compass className="h-5 w-5 text-amber-400" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
