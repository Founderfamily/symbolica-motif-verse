
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import UploadTools from '@/components/sections/UploadTools';
import Partners from '@/components/sections/Partners';
import HowItWorks from '@/components/sections/HowItWorks';
import CallToAction from '@/components/sections/CallToAction';

const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <Features />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Upload Tools */}
      <UploadTools />
      
      {/* Partners */}
      <Partners />
      
      {/* Call to Action */}
      <CallToAction />
    </div>
  );
};

export default HomePage;
