
import React from 'react';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import QuickAccess from '@/components/sections/QuickAccess';
import HowItWorks from '@/components/sections/HowItWorks';
import Gamification from '@/components/sections/Gamification';
import Community from '@/components/sections/Community';
import Testimonials from '@/components/sections/Testimonials';
import TimelineRoadmap from '@/components/sections/TimelineRoadmap';
import Partners from '@/components/sections/Partners';
import CallToAction from '@/components/sections/CallToAction';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <QuickAccess />
      <SymbolTriptychSection />
      <FeaturedCollections />
      <Features />
      <HowItWorks />
      <Gamification />
      <Community />
      <Testimonials />
      <TimelineRoadmap />
      <Partners />
      <CallToAction />
    </div>
  );
};

export default HomePage;
