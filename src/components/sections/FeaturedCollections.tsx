
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Compass, Map, Archive } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { FeaturedCollectionsLoadingSkeleton } from './FeaturedCollectionsLoadingSkeleton';

// Lazy load the data-dependent component
const LazyDynamicCollections = React.lazy(() => import('./LazyDynamicCollections'));

// Collections with refined adventure theme
const StaticCollections: React.FC<{ currentLanguage: string }> = React.memo(({ currentLanguage }) => {
  const staticCollections = React.useMemo(() => [
    {
      id: '1',
      slug: 'geometrie-sacree',
      title: currentLanguage === 'fr' ? 'Géométrie Sacrée' : 'Sacred Geometry',
      description: currentLanguage === 'fr' 
        ? 'Explorez les motifs géométriques des temples anciens et leurs significations spirituelles.'
        : 'Explore geometric patterns of ancient temples and their spiritual meanings.',
      is_featured: true,
      icon: Map
    },
    {
      id: '2', 
      slug: 'mysteres-anciens',
      title: currentLanguage === 'fr' ? 'Mystères Anciens' : 'Ancient Mysteries',
      description: currentLanguage === 'fr'
        ? 'Découvrez les symboles énigmatiques des civilisations perdues.'
        : 'Discover the enigmatic symbols of lost civilizations.',
      is_featured: true,
      icon: BookOpen
    },
    {
      id: '3',
      slug: 'mythologies-mondiales', 
      title: currentLanguage === 'fr' ? 'Mythologies du Monde' : 'World Mythologies',
      description: currentLanguage === 'fr'
        ? 'Plongez dans l\'univers des créatures mythiques et divinités.'
        : 'Dive into the universe of mythical creatures and deities.',
      is_featured: true,
      icon: Archive
    },
    {
      id: '4',
      slug: 'ere-numerique',
      title: currentLanguage === 'fr' ? 'Ère Numérique' : 'Digital Age',
      description: currentLanguage === 'fr'
        ? 'L\'évolution des symboles à l\'ère contemporaine.'
        : 'The evolution of symbols in the contemporary age.',
      is_featured: true,
      icon: Compass
    }
  ], [currentLanguage]);

  return (
    <>
      {staticCollections.slice(0, 4).map((collection) => {
        const IconComponent = collection.icon;
        return (
          <Link
            key={collection.id}
            to={`/collections/${collection.slug}`}
            className="block transition-all duration-300 hover:scale-105 group"
          >
            <Card className="h-full bg-white/90 backdrop-blur-sm border border-stone-200 hover:border-stone-300 hover:shadow-lg transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-stone-800 text-amber-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-lg text-stone-800 group-hover:text-stone-900 transition-colors">
                    {collection.title}
                  </CardTitle>
                </div>
                {collection.is_featured && (
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300 text-xs w-fit">
                    <I18nText translationKey="collections.featuredBadge">Featured</I18nText>
                  </Badge>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-stone-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                  {collection.description}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-700 font-medium group-hover:text-stone-900 transition-colors">
                    <I18nText translationKey="collections.explore">Explore →</I18nText>
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-600 transition-colors" />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </>
  );
});

StaticCollections.displayName = 'StaticCollections';

const FeaturedCollections: React.FC = () => {
  const { currentLanguage } = useTranslation();

  return (
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      <div className="relative">
        {/* Section Header - Simplified */}
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-stone-800">
            <I18nText translationKey="collections.featured.title">Themed Collections</I18nText>
          </h2>
          
          <p className="text-base text-stone-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            <I18nText translationKey="collections.featured.description">
              Organize your discoveries by themes to deepen 
              your exploration of world symbolic heritage.
            </I18nText>
          </p>
        </div>

        {/* Collections Grid */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-stone-200">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaticCollections currentLanguage={currentLanguage} />
              
              <Suspense fallback={null}>
                <LazyDynamicCollections />
              </Suspense>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-8">
          <Button 
            size="lg" 
            className="bg-stone-800 hover:bg-stone-900 text-amber-100 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => window.location.href = '/collections'}
          >
            <Map className="w-4 h-4 mr-2" />
            <I18nText translationKey="collections.featured.discoverAll">View All Collections</I18nText>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Transition Message */}
        <div className="text-center">
          <div className="relative max-w-2xl mx-auto">
            <div className="bg-emerald-50 rounded-xl p-6 border-l-4 border-emerald-600 shadow-sm">
              <h3 className="text-xl font-semibold text-stone-800 mb-3">
                Collections organized?
              </h3>
              <p className="text-base text-stone-600 leading-relaxed">
                Excellent! Now join a community of fellow explorers 
                to share your adventures and discoveries.
              </p>
              
              <div className="mt-4 flex justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <ArrowRight className="h-3 w-3 text-white" />
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
