
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

const HomePage = () => {
  const { t } = useTranslation();

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
