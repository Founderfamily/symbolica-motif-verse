
import React from 'react';
import Hero from '@/components/sections/Hero';
import QuickAccess from '@/components/sections/QuickAccess';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import Features from '@/components/sections/Features';
import Community from '@/components/sections/Community';
import CallToAction from '@/components/sections/CallToAction';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import CulturalJourney from '@/components/sections/CulturalJourney';
import InteractiveDiscovery from '@/components/sections/InteractiveDiscovery';
import SimpleMap from '@/components/map/SimpleMap';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
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

      {/* Symbol Triptych Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <SymbolTriptychSection />
        </div>
      </ErrorBoundary>

      {/* Interactive Discovery */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'InteractiveDiscovery')
        }
      >
        <InteractiveDiscovery />
      </ErrorBoundary>

      {/* Cultural Journey */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CulturalJourney')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <CulturalJourney />
        </div>
      </ErrorBoundary>

      {/* Simple Map */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SimpleMap')
        }
      >
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Exploration Géographique
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Découvrez les symboles dans leur contexte géographique et culturel
              </p>
            </div>
            <SimpleMap />
          </div>
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

      {/* Features */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Features')
        }
      >
        <div className="py-16">
          <Features />
        </div>
      </ErrorBoundary>

      {/* Community Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Community />
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
