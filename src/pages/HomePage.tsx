
import React from 'react';
import Hero from '@/components/sections/Hero';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import SimpleFeaturedCollections from '@/components/sections/SimpleFeaturedCollections';
import Community from '@/components/sections/Community';
import QuestsSection from '@/components/sections/QuestsSection';
import CallToAction from '@/components/sections/CallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Subtle adventure background */}
      <div className="fixed inset-0 -z-20">
        {/* Elegant paper texture base */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100"></div>
        
        {/* Subtle compass rose in background */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <div className="w-96 h-96 rounded-full border border-stone-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-stone-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-45">
              <div className="w-px h-full bg-stone-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-90">
              <div className="w-px h-full bg-stone-300"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform -rotate-45">
              <div className="w-px h-full bg-stone-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Hero')
        }
      >
        <section className="relative">
          <Hero />
        </section>
      </ErrorBoundary>

      {/* Symbol Discovery Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <section className="relative py-12">
          <SymbolTriptychSection />
        </section>
      </ErrorBoundary>

      {/* Collections Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SimpleFeaturedCollections')
        }
      >
        <section className="relative py-12 bg-gradient-to-r from-stone-100/50 to-amber-50/30">
          <SimpleFeaturedCollections />
        </section>
      </ErrorBoundary>

      {/* Community Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <section className="relative py-12">
          <Community />
        </section>
      </ErrorBoundary>

      {/* Quests Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'QuestsSection')
        }
      >
        <section className="relative py-12 bg-gradient-to-r from-amber-50/30 to-stone-100/50">
          <QuestsSection />
        </section>
      </ErrorBoundary>

      {/* Call to Action Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CallToAction')
        }
      >
        <section className="relative py-12 bg-gradient-to-r from-amber-50/30 to-stone-100/50">
          <CallToAction />
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
