
import React from 'react';
import Hero from '@/components/sections/Hero';
import QuickAccess from '@/components/sections/QuickAccess';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import SymbolDiscoverySection from '@/components/sections/SymbolDiscoverySection';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import Community from '@/components/sections/Community';
import Testimonials from '@/components/sections/Testimonials';
import Gamification from '@/components/sections/Gamification';
import CallToAction from '@/components/sections/CallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage rendu');

  // Error handling setup
  React.useEffect(() => {
    const unsubscribe = ErrorHandler.getInstance().onError((error) => {
      console.error('HomePage received error:', error);
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HomePage')
        }
      >
        <Hero />
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'QuickAccess')
        }
      >
        <QuickAccess />
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <FeaturedCollections />
        </div>
      </ErrorBoundary>
      
      {/* Section unifiée de découverte des symboles */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolDiscoverySection')
        }
      >
        <div className="py-16">
          <SymbolDiscoverySection />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Features')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Features />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HowItWorks')
        }
      >
        <div className="py-16">
          <HowItWorks />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Community />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Gamification')
        }
      >
        <div className="py-16">
          <Gamification />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Testimonials')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Testimonials />
        </div>
      </ErrorBoundary>
      
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
