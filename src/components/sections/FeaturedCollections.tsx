
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, ChevronDown, BookOpen, Sparkles } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useTranslation } from '@/i18n/useTranslation';
import { FeaturedCollectionsLoadingSkeleton } from './FeaturedCollectionsLoadingSkeleton';

// Lazy load the data-dependent component
const LazyDynamicCollections = React.lazy(() => import('./LazyDynamicCollections'));

// Optimized static collections component
const StaticCollections: React.FC<{ currentLanguage: string }> = React.memo(({ currentLanguage }) => {
  const staticCollections = React.useMemo(() => [
    {
      id: '1',
      slug: 'geometrie-sacree',
      title: currentLanguage === 'fr' ? 'Géométrie Sacrée' : 'Sacred Geometry',
      description: currentLanguage === 'fr' 
        ? 'Explorez les motifs géométriques sacrés à travers les cultures : mandalas, spirales dorées, fractales naturelles.'
        : 'Explore sacred geometric patterns across cultures: mandalas, golden spirals, natural fractals.',
      is_featured: true
    },
    {
      id: '2', 
      slug: 'mysteres-anciens',
      title: currentLanguage === 'fr' ? 'Mystères Anciens' : 'Ancient Mysteries',
      description: currentLanguage === 'fr'
        ? 'Découvrez les symboles énigmatiques des civilisations perdues et leurs significations cachées.'
        : 'Discover the enigmatic symbols of lost civilizations and their hidden meanings.',
      is_featured: true
    },
    {
      id: '3',
      slug: 'mythologies-mondiales', 
      title: currentLanguage === 'fr' ? 'Mythologies Mondiales' : 'World Mythologies',
      description: currentLanguage === 'fr'
        ? 'Plongez dans l\'univers des créatures mythiques et des divinités à travers les cultures du monde.'
        : 'Dive into the universe of mythical creatures and deities across world cultures.',
      is_featured: true
    },
    {
      id: '4',
      slug: 'ere-numerique',
      title: currentLanguage === 'fr' ? 'Ère Numérique' : 'Digital Era',
      description: currentLanguage === 'fr'
        ? 'L\'évolution des symboles à l\'ère digitale : émojis, logos, iconographie moderne.'
        : 'The evolution of symbols in the digital age: emojis, logos, modern iconography.',
      is_featured: true
    }
  ], [currentLanguage]);

  return (
    <>
      {staticCollections.slice(0, 4).map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.slug}`}
          className="block transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <Card className="h-full border-green-200 hover:border-green-400 transition-colors">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg text-green-800">
                  {collection.title}
                </CardTitle>
                {collection.is_featured && (
                  <Badge variant="default" className="bg-green-100 text-green-700 border-green-300">
                    <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                {collection.description}
              </p>
              <div className="flex items-center text-sm text-green-600 font-medium">
                <BookOpen className="w-4 h-4 mr-1" />
                <I18nText translationKey="collections.explore">Explorer →</I18nText>
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
    <section className="relative py-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Indicateur d'étape */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-100 text-green-800 font-semibold mb-6">
          <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
          <I18nText translationKey="collections.step2">Organisez vos découvertes</I18nText>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-800 via-green-600 to-green-500 bg-clip-text text-transparent">
          <I18nText translationKey="collections.featured.title">Collections Thématiques</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="collections.featured.description">
            Organisez vos symboles favoris en collections pour approfondir votre compréhension et partager vos découvertes.
          </I18nText>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Show static collections immediately for fast UI */}
        <StaticCollections currentLanguage={currentLanguage} />
        
        {/* Lazy load dynamic collections with Suspense */}
        <Suspense fallback={null}>
          <LazyDynamicCollections />
        </Suspense>
      </div>
      
      <div className="text-center mb-16">
        <Link to="/collections">
          <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
            <Sparkles className="w-5 h-5 mr-2" />
            <I18nText translationKey="collections.featured.discoverAll">Découvrir Toutes les Collections</I18nText>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Transition narrative vers l'étape suivante */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-3xl p-8 border border-green-200">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Prêt à rejoindre la communauté ?
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Maintenant que vous avez organisé vos découvertes, partagez votre passion 
            avec une communauté mondiale d'explorateurs de symboles.
          </p>
          <div className="flex items-center justify-center">
            <ChevronDown className="h-6 w-6 text-green-500 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedCollections);
