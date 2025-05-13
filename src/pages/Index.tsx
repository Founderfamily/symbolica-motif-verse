
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NewsletterSignup from '@/components/newsletter/NewsletterSignup';
import Hero from '@/components/sections/Hero';
import SymbolGrid from '@/components/sections/SymbolGrid';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Gamification from '@/components/sections/Gamification';
import Partners from '@/components/sections/Partners';
import Testimonials from '@/components/sections/Testimonials';
import TimelineRoadmap from '@/components/sections/TimelineRoadmap';
import FAQ from '@/components/sections/FAQ';
import CallToAction from '@/components/sections/CallToAction';
import OpenSourceBadge from '@/components/ui/open-source-badge';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with Grid */}
        <div className="bg-gradient-to-b from-amber-50 to-white">
          <Hero />
          <div className="relative max-w-7xl mx-auto">
            <div className="absolute right-6 top-0">
              <OpenSourceBadge />
            </div>
            <SymbolGrid />
          </div>
        </div>
        
        {/* Features Section */}
        <Features />
        
        {/* How It Works */}
        <HowItWorks />
        
        {/* Gamification */}
        <Gamification />
        
        {/* Testimonials */}
        <Testimonials />
        
        {/* Timeline/Roadmap */}
        <TimelineRoadmap />
        
        {/* Partners */}
        <Partners />
        
        {/* FAQ */}
        <FAQ />
        
        {/* Call to Action */}
        <CallToAction />
        
        {/* Newsletter */}
        <NewsletterSignup />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
