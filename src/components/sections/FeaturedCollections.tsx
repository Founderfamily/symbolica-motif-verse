
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Compass, Map, Anchor } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { FeaturedCollectionsLoadingSkeleton } from './FeaturedCollectionsLoadingSkeleton';

// Lazy load the data-dependent component
const LazyDynamicCollections = React.lazy(() => import('./LazyDynamicCollections'));

// Collections avec thème aventure
const StaticCollections: React.FC<{ currentLanguage: string }> = React.memo(({ currentLanguage }) => {
  const staticCollections = React.useMemo(() => [
    {
      id: '1',
      slug: 'geometrie-sacree',
      title: currentLanguage === 'fr' ? 'Cartes Sacrées' : 'Sacred Maps',
      description: currentLanguage === 'fr' 
        ? 'Explorez les motifs géométriques des temples perdus : mandalas mystiques, spirales dorées, fractales anciennes.'
        : 'Explore geometric patterns of lost temples: mystical mandalas, golden spirals, ancient fractals.',
      is_featured: true,
      icon: '🗺️'
    },
    {
      id: '2', 
      slug: 'mysteres-anciens',
      title: currentLanguage === 'fr' ? 'Trésors Oubliés' : 'Forgotten Treasures',
      description: currentLanguage === 'fr'
        ? 'Découvrez les symboles énigmatiques des civilisations perdues et leurs secrets bien gardés.'
        : 'Discover the enigmatic symbols of lost civilizations and their well-guarded secrets.',
      is_featured: true,
      icon: '💎'
    },
    {
      id: '3',
      slug: 'mythologies-mondiales', 
      title: currentLanguage === 'fr' ? 'Légendes Épiques' : 'Epic Legends',
      description: currentLanguage === 'fr'
        ? 'Plongez dans l\'univers des créatures mythiques et des divinités à travers les océans du monde.'
        : 'Dive into the universe of mythical creatures and deities across the world\'s oceans.',
      is_featured: true,
      icon: '⚔️'
    },
    {
      id: '4',
      slug: 'ere-numerique',
      title: currentLanguage === 'fr' ? 'Navigation Moderne' : 'Modern Navigation',
      description: currentLanguage === 'fr'
        ? 'L\'évolution des symboles à l\'ère des explorateurs modernes : nouveaux codes, icônes contemporaines.'
        : 'The evolution of symbols in the age of modern explorers: new codes, contemporary icons.',
      is_featured: true,
      icon: '🧭'
    }
  ], [currentLanguage]);

  return (
    <>
      {staticCollections.slice(0, 4).map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.slug}`}
          className="block transition-all duration-500 hover:scale-110 hover:shadow-2xl group"
        >
          <Card className="h-full bg-gradient-to-br from-amber-50/90 to-yellow-100/90 backdrop-blur-sm border-2 border-amber-600 hover:border-amber-800 transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-2">
            <CardHeader className="pb-4 relative">
              {/* Icône de collection en grand */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-400">
                  {collection.icon}
                </div>
              </div>
              
              <div className="flex justify-between items-start mb-2 pt-8">
                <CardTitle className="text-xl text-amber-900 group-hover:text-amber-950 transition-colors font-bold">
                  {collection.title}
                </CardTitle>
                {collection.is_featured && (
                  <Badge variant="default" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 border-amber-700 font-bold">
                    <I18nText translationKey="collections.featuredBadge">TRÉSOR</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-amber-800 text-sm line-clamp-3 mb-6 leading-relaxed">
                {collection.description}
              </p>
              
              {/* Boussole de navigation */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-amber-900 font-bold group-hover:text-amber-950 transition-colors">
                  <Map className="w-5 h-5 mr-2" />
                  <I18nText translationKey="collections.explore">Explorer →</I18nText>
                </div>
                <Compass className="w-6 h-6 text-amber-700 group-hover:animate-spin transition-all" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
});

StaticCollections.displayName = 'StaticCollections';

const FeaturedCollections: React.FC = () => {
  const { currentLanguage } = useTranslation();

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Design Cartes de Navigation */}
      <div className="relative">
        {/* Boussoles tournantes en arrière-plan */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-emerald-700 rounded-full animate-spin" style={{ animationDuration: '20s' }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-8 bg-emerald-700"></div>
          </div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-emerald-600 rounded-full" style={{ animation: 'spin 15s linear infinite reverse' }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-6 bg-emerald-600"></div>
          </div>
        </div>

        {/* Titre avec style cartes anciennes */}
        <div className="text-center mb-16 relative z-10">
          <div className="inline-flex items-center gap-4 bg-emerald-900/80 backdrop-blur-sm px-10 py-5 rounded-full shadow-2xl border-2 border-green-400 mb-8">
            <Anchor className="h-8 w-8 text-green-400 animate-pulse" />
            <span className="font-bold text-2xl text-green-100 tracking-wider">CARTES AU TRÉSOR</span>
            <Anchor className="h-8 w-8 text-green-400 animate-pulse" />
          </div>
          
          <h2 className="text-6xl md:text-7xl font-bold mb-8 text-emerald-900 text-shadow-lg" style={{ textShadow: '3px 3px 6px rgba(6, 78, 59, 0.5)' }}>
            <I18nText translationKey="collections.featured.title">Collections Légendaires</I18nText>
          </h2>
          
          <p className="text-2xl text-emerald-800 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
            <I18nText translationKey="collections.featured.description">
              Organisez vos trésors par routes d'exploration pour approfondir vos découvertes 
              et tracer votre propre légende dans l'histoire des aventuriers.
            </I18nText>
          </p>
        </div>

        {/* Coffres de collections style navigation */}
        <div className="mb-16 relative">
          {/* Fond style pont de navire */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-green-600/5 to-emerald-800/10 rounded-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-emerald-50/90 to-green-100/90 backdrop-blur-lg rounded-3xl p-10 border-4 border-emerald-600 shadow-2xl">
            {/* Cordages décoratifs */}
            <div className="absolute top-4 left-4 w-16 h-4 border-t-4 border-emerald-700 rounded-full"></div>
            <div className="absolute top-4 right-4 w-16 h-4 border-t-4 border-emerald-700 rounded-full"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Show static collections immediately for fast UI */}
              <StaticCollections currentLanguage={currentLanguage} />
              
              {/* Lazy load dynamic collections with Suspense */}
              <Suspense fallback={null}>
                <LazyDynamicCollections />
              </Suspense>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-950 text-green-100 px-16 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-4 border-green-400 text-xl font-bold"
            onClick={() => window.location.href = '/collections'}
          >
            <Map className="w-6 h-6 mr-4" />
            <I18nText translationKey="collections.featured.discoverAll">DÉCOUVRIR TOUTES LES CARTES</I18nText>
            <Compass className="w-6 h-6 ml-4 animate-spin" />
          </Button>
        </div>

        {/* Message de transition pirate */}
        <div className="text-center">
          <div className="relative max-w-3xl mx-auto">
            {/* Parchemin de navigation */}
            <div className="bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl p-10 border-4 border-emerald-700 shadow-2xl relative">
              {/* Taches d'encre de carte */}
              <div className="absolute top-2 left-2 w-4 h-4 bg-emerald-800 rounded-full opacity-50"></div>
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-800 rounded-full opacity-30"></div>
              
              <h3 className="text-3xl font-bold text-emerald-900 mb-6 text-shadow" style={{ textShadow: '2px 2px 4px rgba(6, 78, 59, 0.3)' }}>
                Cartes Tracées ?
              </h3>
              <p className="text-xl text-emerald-800 leading-relaxed font-medium">
                Excellent ! Il est temps de recruter votre équipage et rejoindre une 
                fraternité mondiale d'explorateurs pour partager vos aventures.
              </p>
              
              {/* Ancre de navigation vers l'étape suivante */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <Anchor className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedCollections);
