
import React from 'react';
import DualHero from '@/components/sections/DualHero';
import AIDiscoveries from '@/components/sections/AIDiscoveries';
import HeritageSection from '@/components/sections/HeritageSection';
import TreasureHunting from '@/components/sections/TreasureHunting';
import HistoricalTours from '@/components/sections/HistoricalTours';
import CommunityChat from '@/components/sections/CommunityChat';
import ImprovedCallToAction from '@/components/sections/ImprovedCallToAction';
import { ScientificCredibility } from '@/components/sections/ScientificCredibility';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      {/* Elegant adventure background */}
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

      {/* Dual Hero Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'DualHero')
        }
      >
        <section className="relative">
          <DualHero />
        </section>
      </ErrorBoundary>

      {/* AI Discoveries Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'AIDiscoveries')
        }
      >
        <section className="relative py-0">
          <AIDiscoveries />
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

      {/* Historical Tours Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'HistoricalTours')
        }
      >
        <section className="relative py-0">
          <HistoricalTours />
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

      {/* Scientific Credibility Section */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'ScientificCredibility')
        }
      >
        <section className="relative py-0">
          <ScientificCredibility />
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
