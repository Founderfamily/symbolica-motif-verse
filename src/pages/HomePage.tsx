
import React from 'react';
import Hero from '@/components/sections/Hero';
import SymbolTriptychSection from '@/components/sections/SymbolTriptychSection';
import FeaturedCollections from '@/components/sections/FeaturedCollections';
import Community from '@/components/sections/Community';
import CallToAction from '@/components/sections/CallToAction';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorHandler } from '@/utils/errorHandler';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Arrière-plan créatif avec motifs symboliques animés */}
      <div className="fixed inset-0 -z-10">
        {/* Patterns géométriques subtils */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-96 h-96 rounded-full border-2 border-slate-400 animate-float-slow"></div>
          <div className="absolute top-40 right-32 w-64 h-64 rotate-45 border-2 border-slate-400 animate-float-medium"></div>
          <div className="absolute bottom-40 left-1/3 w-80 h-80 rounded-full border border-slate-300 animate-float-fast"></div>
          <div className="absolute bottom-20 right-20 w-52 h-52 rotate-12 border border-slate-300 animate-float-slow"></div>
        </div>
        
        {/* Ligne de parcours centrale qui traverse toute la page */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2">
          <div className="w-full h-full bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-30"></div>
        </div>
      </div>

      {/* Hero Section - Point de départ */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Hero')
        }
      >
        <section className="relative">
          <Hero />
          {/* Indicateur de parcours - Départ */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mb-2 animate-pulse"></div>
              <div className="w-px h-16 bg-gradient-to-b from-blue-500 to-blue-400"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 1: Découverte des Symboles */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <section className="relative py-20">
          {/* Indicateur d'étape avec numérotation */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
                1
              </div>
              <div className="text-sm font-medium text-blue-700 bg-blue-50 px-4 py-2 rounded-full">
                Découverte
              </div>
            </div>
          </div>
          
          <div className="pt-16">
            <SymbolTriptychSection />
          </div>
          
          {/* Flèche de progression vers étape suivante */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-blue-400 to-green-500"></div>
              <div className="w-6 h-6 bg-green-500 rounded-full rotate-45 transform translate-y-3"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 2: Organisation en Collections */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-green-50/30 to-green-100/30">
          {/* Indicateur d'étape */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
                2
              </div>
              <div className="text-sm font-medium text-green-700 bg-green-50 px-4 py-2 rounded-full">
                Organisation
              </div>
            </div>
          </div>
          
          <div className="pt-16">
            <FeaturedCollections />
          </div>
          
          {/* Flèche de progression */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-green-500 to-amber-500"></div>
              <div className="w-6 h-6 bg-amber-500 rounded-full rotate-45 transform translate-y-3"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 3: Rejoindre la Communauté */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-amber-50/30 to-orange-100/30">
          {/* Indicateur d'étape */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg">
                3
              </div>
              <div className="text-sm font-medium text-amber-700 bg-amber-50 px-4 py-2 rounded-full">
                Communauté
              </div>
            </div>
          </div>
          
          <div className="pt-16">
            <Community />
          </div>
          
          {/* Flèche de progression finale */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-16 bg-gradient-to-b from-amber-500 to-red-500"></div>
              <div className="w-6 h-6 bg-red-500 rounded-full rotate-45 transform translate-y-3"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 4: Lancer sa Première Quête - FINALITÉ */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CallToAction')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-red-50/30 to-red-100/30">
          {/* Indicateur d'étape finale */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-lg animate-pulse">
                4
              </div>
              <div className="text-sm font-medium text-red-700 bg-red-50 px-4 py-2 rounded-full">
                Action !
              </div>
            </div>
          </div>
          
          <div className="pt-16">
            <CallToAction />
          </div>
          
          {/* Point final du parcours */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
