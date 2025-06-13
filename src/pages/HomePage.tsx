
import React from 'react';
import Hero from '@/components/sections/Hero';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import Community from '@/components/sections/Community';
import CallToAction from '@/components/sections/CallToAction';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Introduction */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Hero')
        }
      >
        <Hero />
      </ErrorBoundary>

      {/* Étape 1: Découverte des Symboles */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <div className="relative bg-gradient-to-b from-white to-blue-50/50">
          {/* Indicateur de progression visuel */}
          <div className="absolute left-1/2 top-0 w-px h-16 bg-gradient-to-b from-transparent to-blue-300 transform -translate-x-1/2"></div>
          <div className="py-20">
            <SymbolTriptychSection />
          </div>
          {/* Transition vers étape suivante */}
          <div className="absolute left-1/2 bottom-0 w-px h-16 bg-gradient-to-b from-blue-300 to-green-300 transform -translate-x-1/2"></div>
        </div>
      </ErrorBoundary>

      {/* Étape 2: Organisation en Collections */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <div className="relative bg-gradient-to-b from-blue-50/50 to-green-50/50">
          <div className="py-20">
            <FeaturedCollections />
          </div>
          {/* Transition vers étape suivante */}
          <div className="absolute left-1/2 bottom-0 w-px h-16 bg-gradient-to-b from-green-300 to-amber-300 transform -translate-x-1/2"></div>
        </div>
      </ErrorBoundary>

      {/* Étape 3: Rejoindre la Communauté */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <div className="relative bg-gradient-to-b from-green-50/50 to-amber-50/50">
          <div className="py-20">
            <Community />
          </div>
          {/* Transition vers étape finale */}
          <div className="absolute left-1/2 bottom-0 w-px h-16 bg-gradient-to-b from-amber-300 to-red-300 transform -translate-x-1/2"></div>
        </div>
      </ErrorBoundary>

      {/* Étape 4: Lancer sa Première Quête */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CallToAction')
        }
      >
        <div className="bg-gradient-to-b from-amber-50/50 to-red-50/50">
          <div className="py-20">
            <CallToAction />
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
