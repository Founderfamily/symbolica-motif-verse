
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import UploadTools from '@/components/sections/UploadTools';
import Partners from '@/components/sections/Partners';
import HowItWorks from '@/components/sections/HowItWorks';
import CallToAction from '@/components/sections/CallToAction';
import Gamification from '@/components/sections/Gamification';
import Community from '@/components/sections/Community';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import Testimonials from '@/components/sections/Testimonials';
import TimelineRoadmap from '@/components/sections/TimelineRoadmap';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import OpenSourceBadge from '@/components/ui/open-source-badge';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { t } = useTranslation();
  
  // Create translation variables for texts used in attributes
  const exploreGroupsText = t('groups.exploreBanner.title');
  const groupsBannerDesc = t('groups.exploreBanner.description');
  const groupsBannerAction = t('groups.exploreBanner.action');

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* SymbolTriptych Section with OpenSourceBadge */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="absolute right-4 sm:right-6 top-0 z-10">
          <OpenSourceBadge />
        </div>
        <SymbolTriptychSection />
      </div>
      
      {/* Community Section */}
      <Community />
      
      {/* Groups Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-amber-100 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-amber-900">
            <I18nText translationKey="groups.exploreBanner.title" />
          </h2>
          <p className="mb-6 max-w-3xl mx-auto text-amber-800">
            <I18nText translationKey="groups.exploreBanner.description" />
          </p>
          <Link to="/groups">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              <Users className="mr-2 h-5 w-5" />
              <I18nText translationKey="groups.exploreBanner.action" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Gamification Section */}
      <Gamification />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Timeline/Roadmap */}
      <TimelineRoadmap />
      
      {/* Upload Tools */}
      <UploadTools />
      
      {/* Partners */}
      <Partners />
      
      {/* Call to Action */}
      <CallToAction />
      
      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
};

export default HomePage;
