
import React from 'react';
import Hero from '@/components/sections/Hero';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage: React.FC = () => {
  console.log('🏠 HomePage component loaded');

  // Error handling setup
  React.useEffect(() => {
    console.log('🏠 HomePage useEffect running');
    const unsubscribe = ErrorHandler.getInstance().onError((error) => {
      console.error('HomePage received error:', error);
    });

    return unsubscribe;
  }, []);

  try {
    console.log('🏠 HomePage rendering...');
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <ErrorBoundary 
          onError={(error, errorInfo) => 
            ErrorHandler.handleComponentError(error, errorInfo, 'HomePage')
          }
        >
          <Hero />
        </ErrorBoundary>
        
        {/* Temporarily comment out other sections to isolate the issue */}
        {/*
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
        
        <ErrorBoundary 
          onError={(error, errorInfo) => 
            ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
          }
        >
          <div className="py-16">
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
        */}
      </div>
    );
  } catch (error) {
    console.error('❌ Error in HomePage component:', error);
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-red-600 mb-4">HomePage Error</h1>
          <p className="text-gray-700 mb-4">Something went wrong while loading the home page.</p>
          <pre className="text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    );
  }
};

export default HomePage;
