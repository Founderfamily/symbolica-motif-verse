
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
import RoadmapSection from '@/components/sections/RoadmapSection';
import Gamification from '@/components/sections/Gamification';
import CallToAction from '@/components/sections/CallToAction';
import { SymbolGrid } from '@/components/search/SymbolGrid';
import { useAllSymbols } from '@/hooks/useSupabaseSymbols';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage rendu');
  const { data: symbols, isLoading } = useAllSymbols();

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
      
      {/* Section des symboles utilisant SymbolGrid qui fonctionne */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolsSection')
        }
      >
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Explorez nos Symboles
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Découvrez la richesse des symboles à travers les cultures et les époques
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
              </div>
            ) : (
              <SymbolGrid symbols={symbols || []} />
            )}
          </div>
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <SymbolTriptychSection />
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
          ErrorHandler.handleComponentError(error, errorInfo, 'UploadTools')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <UploadTools />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <div className="py-16">
          <Community />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Gamification')
        }
      >
        <div className="py-16 bg-slate-50/50">
          <Gamification />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Testimonials')
        }
      >
        <div className="py-16">
          <Testimonials />
        </div>
      </ErrorBoundary>
      
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'RoadmapSection')
        }
      >
        <RoadmapSection />
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
