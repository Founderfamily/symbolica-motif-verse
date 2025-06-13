
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
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
          className="block transition-all duration-300 hover:scale-105 hover:shadow-xl group"
        >
          <Card className="h-full bg-white/80 backdrop-blur-sm border-slate-200 hover:border-slate-300 transition-all shadow-lg hover:shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg text-slate-800 group-hover:text-slate-900 transition-colors">
                  {collection.title}
                </CardTitle>
                {collection.is_featured && (
                  <Badge variant="default" className="bg-slate-100 text-slate-700 border-slate-300">
                    <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {collection.description}
              </p>
              <div className="flex items-center text-sm text-slate-700 font-medium group-hover:text-slate-900 transition-colors">
                <BookOpen className="w-4 h-4 mr-2" />
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
    <section className="relative px-4 md:px-8 max-w-7xl mx-auto">
      {/* Titre principal avec design épuré */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-slate-800">
          <I18nText translationKey="collections.featured.title">Collections Thématiques</I18nText>
        </h2>
        
        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8 leading-relaxed">
          <I18nText translationKey="collections.featured.description">
            Organisez vos symboles favoris par thèmes pour approfondir votre compréhension 
            et créer votre propre parcours d'exploration culturelle.
          </I18nText>
        </p>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-xl mb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Show static collections immediately for fast UI */}
          <StaticCollections currentLanguage={currentLanguage} />
          
          {/* Lazy load dynamic collections with Suspense */}
          <Suspense fallback={null}>
            <LazyDynamicCollections />
          </Suspense>
        </div>
      </div>
      
      <div className="text-center mb-16">
        <Link to="/collections">
          <Button 
            size="lg" 
            className="bg-slate-800 hover:bg-slate-900 text-white px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5 mr-3" />
            <I18nText translationKey="collections.featured.discoverAll">Découvrir Toutes les Collections</I18nText>
            <ArrowRight className="w-5 h-5 ml-3" />
          </Button>
        </Link>
      </div>

      {/* Message de transition narratif */}
      <div className="text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Collections créées ?
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Excellent ! Il est temps de partager votre passion avec une communauté 
            mondiale d'explorateurs de symboles et d'enrichir vos découvertes ensemble.
          </p>
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedCollections);
