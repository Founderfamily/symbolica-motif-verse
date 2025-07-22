
import React from 'react';
import Hero from '@/components/sections/Hero';
import HeritageSection from '@/components/sections/HeritageSection';
import TreasureHunting from '@/components/sections/TreasureHunting';
import CommunityChat from '@/components/sections/CommunityChat';
import ImprovedCallToAction from '@/components/sections/ImprovedCallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50/50 to-stone-50">
      {/* Symbolic heritage background */}
      <div className="fixed inset-0 -z-20">
        {/* Heritage paper texture base */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50/60 to-stone-100"></div>
        
        {/* Ancient symbols pattern */}
        <div className="absolute top-1/3 left-1/4 opacity-5">
          <div className="w-64 h-64 border-2 border-amber-400 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-60">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center transform rotate-120">
              <div className="w-0.5 h-full bg-amber-400"></div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-1/4 right-1/4 opacity-8">
          <div className="w-32 h-32 border border-yellow-500">
            <div className="absolute inset-2 border border-yellow-500 transform rotate-45"></div>
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

      {/* Heritage Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HeritageSection')
        }
      >
        <section className="relative py-0">
          <HeritageSection />
        </section>
      </ErrorBoundary>

      {/* Treasure Hunting Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'TreasureHunting')
        }
      >
        <section className="relative py-0">
          <TreasureHunting />
        </section>
      </ErrorBoundary>


      {/* Community Chat Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CommunityChat')
        }
      >
        <section className="relative py-0">
          <CommunityChat />
        </section>
      </ErrorBoundary>


      {/* Improved Call to Action Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'ImprovedCallToAction')
        }
      >
        <section className="relative py-0">
          <ImprovedCallToAction />
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
