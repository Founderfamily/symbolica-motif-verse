
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan de parchemin ancien avec carte au trésor */}
      <div className="fixed inset-0 -z-20">
        {/* Base parchemin sépia */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100"></div>
        
        {/* Texture de parchemin */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(139,69,19,0.1)_0%,transparent_50%)]"></div>
          <div className="w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(139,69,19,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        {/* Traces de carte au trésor */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <path id="treasure-path" d="M100,200 Q300,100 500,300 T900,400 Q1100,500 1300,300" />
            </defs>
            <path d="M100,200 Q300,100 500,300 T900,400 Q1100,500 1300,300" 
                  stroke="#8B4513" strokeWidth="3" fill="none" strokeDasharray="10,5"
                  className="animate-pulse" />
            {/* X marquent les spots */}
            <text x="500" y="300" fontSize="24" fill="#B8860B" className="font-bold animate-pulse">✗</text>
            <text x="900" y="400" fontSize="24" fill="#B8860B" className="font-bold animate-pulse">✗</text>
            <text x="1300" y="300" fontSize="24" fill="#B8860B" className="font-bold animate-pulse">✗</text>
          </svg>
        </div>
        
        {/* Particules dorées flottantes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-2 h-2 bg-yellow-400 rounded-full animate-float-slow opacity-60"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-amber-400 rounded-full animate-float-medium opacity-40"></div>
          <div className="absolute bottom-40 left-1/3 w-3 h-3 bg-yellow-300 rounded-full animate-float-fast opacity-50"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-amber-500 rounded-full animate-float-slow opacity-70"></div>
          <div className="absolute top-1/2 left-10 w-1 h-1 bg-yellow-500 rounded-full animate-float-medium opacity-30"></div>
        </div>
        
        {/* Brûlures sur les bords */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-amber-900/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
          <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-amber-900/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-amber-900/20 to-transparent"></div>
        </div>
      </div>

      {/* Parcours de Quête Épique - Ligne directrice centrale */}
      <div className="fixed left-1/2 top-0 bottom-0 w-px transform -translate-x-1/2 -z-10">
        <div className="w-full h-full bg-gradient-to-b from-amber-700 via-yellow-600 to-amber-700 opacity-40"></div>
      </div>

      {/* Hero Section - Entrée de Temple */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Hero')
        }
      >
        <section className="relative">
          {/* Effet torches sur les côtés */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-16 h-32 bg-gradient-to-t from-orange-600/30 via-yellow-500/20 to-transparent rounded-full animate-pulse"></div>
            <div className="absolute top-20 right-10 w-16 h-32 bg-gradient-to-t from-orange-600/30 via-yellow-500/20 to-transparent rounded-full animate-pulse"></div>
          </div>
          
          <Hero />
          
          {/* Étape 1: DÉCOUVERTE - Point de départ */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-full flex items-center justify-center font-bold text-xl shadow-xl border-4 border-yellow-400 animate-pulse">
                  🔍
                </div>
                <div className="absolute -inset-2 border-2 border-yellow-400 rounded-full animate-ping opacity-50"></div>
              </div>
              <div className="mt-4 bg-amber-100/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-amber-600 shadow-lg">
                <span className="font-bold text-amber-900">DÉCOUVERTE</span>
              </div>
              <div className="w-px h-20 bg-gradient-to-b from-amber-600 to-emerald-600 mt-4"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 1: Salle des Trésors - Découverte des Symboles */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'SymbolTriptychSection')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-amber-100/40 via-yellow-50/40 to-amber-100/40">
          {/* Effet d'éclairage dramatique */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-64 h-64 bg-gradient-radial from-yellow-300/20 to-transparent rounded-full"></div>
            <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-gradient-radial from-amber-400/30 to-transparent rounded-full"></div>
          </div>
          
          {/* Étape DÉCOUVERTE */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-yellow-400">
                🗝️
              </div>
              <div className="text-center mt-4 bg-amber-900/80 backdrop-blur-sm px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl">
                TROUVEZ VOTRE PREMIER ARTEFACT
              </div>
            </div>
          </div>
          
          <div className="pt-24">
            <SymbolTriptychSection />
          </div>
          
          {/* Transition vers Collections */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-20 bg-gradient-to-b from-amber-600 to-emerald-600"></div>
              <div className="w-8 h-8 bg-emerald-600 rounded-full transform rotate-45 translate-y-4 shadow-lg"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 2: Cartes de Navigation - Collections */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'FeaturedCollections')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-emerald-100/40 via-green-50/40 to-emerald-100/40">
          {/* Boussoles en arrière-plan */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 border-4 border-emerald-700 rounded-full animate-spin-slow"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-emerald-600 rounded-full animate-spin-reverse"></div>
          </div>
          
          {/* Étape COLLECTION */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-green-400">
                💰
              </div>
              <div className="text-center mt-4 bg-emerald-900/80 backdrop-blur-sm px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl">
                CONSTITUEZ VOTRE TRÉSOR
              </div>
            </div>
          </div>
          
          <div className="pt-24">
            <FeaturedCollections />
          </div>
          
          {/* Transition vers Communauté */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-20 bg-gradient-to-b from-emerald-600 to-blue-600"></div>
              <div className="w-8 h-8 bg-blue-600 rounded-full transform rotate-45 translate-y-4 shadow-lg"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 3: Taverne de Pirates - Communauté */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'Community')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-blue-100/40 via-cyan-50/40 to-blue-100/40">
          {/* Ambiance taverne */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-tl from-blue-500/20 to-cyan-400/20 rounded-full animate-pulse"></div>
          </div>
          
          {/* Étape ÉQUIPAGE */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-cyan-400">
                ⚓
              </div>
              <div className="text-center mt-4 bg-blue-900/80 backdrop-blur-sm px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl">
                REJOIGNEZ L'ÉQUIPAGE
              </div>
            </div>
          </div>
          
          <div className="pt-24">
            <Community />
          </div>
          
          {/* Transition vers Quête finale */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-px h-20 bg-gradient-to-b from-blue-600 to-red-600"></div>
              <div className="w-8 h-8 bg-red-600 rounded-full transform rotate-45 translate-y-4 shadow-lg"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>

      {/* Étape 4: Pont de Navire - Quête Finale */}
      <ErrorBoundary 
        onError={(error, errorInfo) => 
          ErrorHandler.handleComponentError(error, errorInfo, 'CallToAction')
        }
      >
        <section className="relative py-20 bg-gradient-to-r from-red-100/40 via-orange-50/40 to-red-100/40">
          {/* Effet horizon océanique */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-orange-300/20 to-transparent"></div>
          </div>
          
          {/* Étape QUÊTE FINALE */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 z-10">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-2xl border-4 border-orange-400 animate-pulse">
                🧭
              </div>
              <div className="text-center mt-4 bg-red-900/80 backdrop-blur-sm px-8 py-3 rounded-full text-white font-bold text-lg shadow-xl">
                LANCEZ VOTRE EXPÉDITION
              </div>
            </div>
          </div>
          
          <div className="pt-24">
            <CallToAction />
          </div>
          
          {/* Point final de l'aventure */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <div className="w-6 h-6 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
        </section>
      </ErrorBoundary>
    </div>
  );
};

export default HomePage;
