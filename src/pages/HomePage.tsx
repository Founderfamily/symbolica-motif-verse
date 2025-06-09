
import React from 'react';
import InteractiveHero from '@/components/sections/InteractiveHero';
import InteractiveDiscovery from '@/components/sections/InteractiveDiscovery';
import CulturalJourney from '@/components/sections/CulturalJourney';
import CreativeCommunity from '@/components/sections/CreativeCommunity';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import SymbolDiscoverySection from '@/components/sections/SymbolDiscoverySection';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Testimonials from '@/components/sections/Testimonials';
import Gamification from '@/components/sections/Gamification';
import CallToAction from '@/components/sections/CallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage rendu avec nouvelle interface visuelle');

  // Error handling setup
  React.useEffect(() => {
    const unsubscribe = ErrorHandler.getInstance().onError((error) => {
      console.error('HomePage received error:', error);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero interactif remplace l'ancien Hero */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'InteractiveHero')
        }
      >
        <InteractiveHero />
      </ErrorBoundary>
      
      {/* Découverte interactive remplace QuickAccess */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'InteractiveDiscovery')
        }
      >
        <InteractiveDiscovery />
      </ErrorBoundary>

      {/* Voyage culturel - nouvelle section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CulturalJourney')
        }
      >
        <div className="py-16 bg-gradient-to-br from-purple-50/50 to-pink-50/30">
          <CulturalJourney />
        </div>
      </ErrorBoundary>
      
      {/* Collections mises en avant */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <FeaturedCollections />
        </div>
      </ErrorBoundary>
      
      {/* Section de découverte des symboles améliorée */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolDiscoverySection')
        }
      >
        <div className="py-16">
          <SymbolDiscoverySection />
        </div>
      </ErrorBoundary>

      {/* Communauté créative - remplace Community */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CreativeCommunity')
        }
      >
        <div className="py-16 bg-gradient-to-br from-rose-50/50 to-pink-50/30">
          <CreativeCommunity />
        </div>
      </ErrorBoundary>
      
      {/* Features avec design mis à jour */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Features')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Features />
        </div>
      </ErrorBoundary>
      
      {/* Comment ça marche */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HowItWorks')
        }
      >
        <div className="py-16">
          <HowItWorks />
        </div>
      </ErrorBoundary>
      
      {/* Gamification */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Gamification')
        }
      >
        <div className="py-16 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
          <Gamification />
        </div>
      </ErrorBoundary>
      
      {/* Témoignages */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Testimonials')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Testimonials />
        </div>
      </ErrorBoundary>
      
      {/* Call to action final */}
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
