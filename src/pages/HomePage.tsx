
import React from 'react';
import Hero from '@/components/sections/Hero';
import QuickAccess from '@/components/sections/QuickAccess';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Community from '@/components/sections/Community';
import UploadTools from '@/components/sections/UploadTools';
import Testimonials from '@/components/sections/Testimonials';
import TimelineRoadmap from '@/components/sections/TimelineRoadmap';
import Gamification from '@/components/sections/Gamification';
import CallToAction from '@/components/sections/CallToAction';

const HomePage = () => {
  console.log('HomePage: Rendering home page...');
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <Hero />
      
      {/* Quick Access Section */}
      <div className="py-16">
        <QuickAccess />
      </div>
      
      {/* Featured Collections */}
      <div className="py-16 bg-slate-50/50">
        <FeaturedCollections />
      </div>
      
      {/* Symbol Triptych Interactive Section */}
      <div className="py-16">
        <SymbolTriptychSection />
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-slate-50/50">
        <Features />
      </div>
      
      {/* How It Works */}
      <div className="py-16">
        <HowItWorks />
      </div>
      
      {/* Upload Tools */}
      <div className="py-16 bg-slate-50/50">
        <UploadTools />
      </div>
      
      {/* Community Section */}
      <div className="py-16">
        <Community />
      </div>
      
      {/* Gamification Section */}
      <div className="py-16 bg-slate-50/50">
        <Gamification />
      </div>
      
      {/* Testimonials */}
      <div className="py-16">
        <Testimonials />
      </div>
      
      {/* Roadmap */}
      <div className="py-16 bg-slate-50/50">
        <TimelineRoadmap />
      </div>
      
      {/* Call to Action */}
      <div className="py-16">
        <CallToAction />
      </div>
    </div>
  );
};

export default HomePage;
