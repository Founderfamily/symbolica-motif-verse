
import React, { useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { ContentSection, getContentSectionByKey } from '@/services/contentService';
import { I18nText } from '@/components/ui/i18n-text';
import { useBreakpoint } from '@/hooks/use-breakpoints';

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [heroContent, setHeroContent] = useState<ContentSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useBreakpoint('sm');
  
  useEffect(() => {
    const fetchHeroContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const content = await getContentSectionByKey('hero');
        setHeroContent(content);
        console.log("Fetched hero content:", content);
      } catch (error) {
        console.error('Error fetching hero content:', error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeroContent();
  }, []);
  
  const lang = i18n.language || 'fr';
  
  return (
    <section className="relative pt-8 md:pt-16 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-amber-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="text-center mb-8 sm:mb-10 relative z-10">
        <div className="inline-block p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-full mb-4 animate-pulse-light">
          <div className="bg-gradient-to-r from-amber-800/20 to-amber-700/20 px-3 sm:px-4 py-1 rounded-full text-amber-900 text-xs sm:text-sm font-medium">
            <I18nText translationKey="app.version" />
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="h-8 sm:h-12 w-3/4 mx-auto bg-slate-200 animate-pulse rounded"></div>
            <div className="h-4 sm:h-6 w-2/3 mx-auto bg-slate-200 animate-pulse rounded"></div>
          </div>
        ) : error || !heroContent?.title?.[lang] ? (
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              <I18nText translationKey="hero.heading" />
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-6 sm:mb-8">
              <I18nText translationKey="hero.subheading" />
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent">
              {heroContent.title[lang] || <I18nText translationKey="hero.heading" />}
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-6 sm:mb-8">
              {heroContent.subtitle?.[lang] || <I18nText translationKey="hero.subheading" />}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-6 sm:mt-8">
          <Button size={isMobile ? "default" : "lg"} className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-lg shadow-amber-600/20 transform hover:-translate-y-1 transition-all">
            <I18nText translationKey="hero.community" /> <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button size={isMobile ? "default" : "lg"} variant="outline" className="border-slate-400 text-slate-700 hover:bg-slate-50 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all">
            <I18nText translationKey="hero.explore" /> <MapPin className="ml-2 h-4 w-4 text-amber-600" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
