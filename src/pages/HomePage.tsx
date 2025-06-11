import React from 'react';
import Hero from '@/components/sections/Hero';
import QuickAccess from '@/components/sections/QuickAccess';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import UploadTools from '@/components/sections/UploadTools';
import Community from '@/components/sections/Community';
import Gamification from '@/components/sections/Gamification';
import Testimonials from '@/components/sections/Testimonials';
import RoadmapSection from '@/components/sections/RoadmapSection';
import CallToAction from '@/components/sections/CallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';
import EnhancedSymbolDiscovery from '@/components/sections/EnhancedSymbolDiscovery';

const HomePage = () => {
  const handleSectionError = (sectionName: string, error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`Error in ${sectionName} section:`, error, errorInfo);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Hero')
        }
      >
        <Hero />
      </ErrorBoundary>

      {/* Quick Access */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'QuickAccess')
        }
      >
        <div className="py-16">
          <QuickAccess />
        </div>
      </ErrorBoundary>

      {/* Featured Collections */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <FeaturedCollections />
        </div>
      </ErrorBoundary>

      {/* Enhanced Symbol Discovery Section (Replacing SymbolTriptychSection) */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'EnhancedSymbolDiscovery')
        }
      >
        <EnhancedSymbolDiscovery />
      </ErrorBoundary>

      {/* Features */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Features')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Features />
        </div>
      </ErrorBoundary>

      {/* How It Works */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HowItWorks')
        }
      >
        <div className="py-16">
          <HowItWorks />
        </div>
      </ErrorBoundary>

      {/* Upload Tools */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'UploadTools')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <UploadTools />
        </div>
      </ErrorBoundary>

      {/* Community Section (Enhanced) */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <Community />
      </ErrorBoundary>

      {/* Gamification */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Gamification')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Gamification />
        </div>
      </ErrorBoundary>

      {/* Testimonials */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Testimonials')
        }
      >
        <div className="py-16">
          <Testimonials />
        </div>
      </ErrorBoundary>

      {/* Roadmap */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'RoadmapSection')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <RoadmapSection />
        </div>
      </ErrorBoundary>

      {/* Call to Action */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CallToAction')
        }
      >
        <div className="py-16">
          <CallToAction />
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
