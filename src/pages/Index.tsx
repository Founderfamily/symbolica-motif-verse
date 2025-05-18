
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header />
      
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
        
        {/* Community Section (New) */}
        <Community />
        
        {/* Upload Tools Section (New) */}
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
      
      {/* Footer with FAQ */}
      <Footer />
    </div>
  );
};

export default Index;
