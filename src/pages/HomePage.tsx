
import React from 'react';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import Hero from '@/components/sections/Hero';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Community from '@/components/sections/Community';
import UploadTools from '@/components/sections/UploadTools';
import Partners from '@/components/sections/Partners';
import Testimonials from '@/components/sections/Testimonials';
import TimelineRoadmap from '@/components/sections/TimelineRoadmap';
import CallToAction from '@/components/sections/CallToAction';
import OpenSourceBadge from '@/components/ui/open-source-badge';
import Gamification from '@/components/sections/Gamification';
import FeaturedCollections from '@/components/sections/FeaturedCollections';

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Grid */}
        <div className="bg-white">
          <Hero />
          <div className="relative max-w-7xl mx-auto">
            <div className="absolute right-6 top-0">
              <OpenSourceBadge />
            </div>
            <SymbolTriptychSection />
          </div>
        </div>
        
        {/* Featured Collections Section */}
        <FeaturedCollections />
        
        {/* Community Section */}
        <Community />
        
        {/* Upload Tools Section */}
        <UploadTools />
        
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
        
        {/* Partners */}
        <Partners />
        
        {/* Call to Action */}
        <CallToAction />
        
        {/* Newsletter */}
        <NewsletterSignup />
      </main>
    </div>
  );
};

export default HomePage;
