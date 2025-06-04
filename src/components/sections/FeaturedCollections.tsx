
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useFeaturedCollections } from '@/hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { FeaturedCollectionsLoadingSkeleton } from './FeaturedCollectionsLoadingSkeleton';

// Extracted static collections to a separate memoized component
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
          className="block transition-transform hover:scale-105"
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">
                  {collection.title}
                </CardTitle>
                {collection.is_featured && (
                  <Badge variant="default">
                    <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3">
                {collection.description}
              </p>
              <div className="mt-4 text-sm text-amber-600 font-medium">
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

// Extracted dynamic collections to a separate component
const DynamicCollections: React.FC<{ collections: any[]; getTranslation: (collection: any, field: string) => string }> = React.memo(({ collections, getTranslation }) => {
  return (
    <>
      {collections.slice(0, 4).map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.slug}`}
          className="block transition-transform hover:scale-105"
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">
                  {getTranslation(collection, 'title')}
                </CardTitle>
                {collection.is_featured && (
                  <Badge variant="default">
                    <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 text-sm line-clamp-3">
                {getTranslation(collection, 'description')}
              </p>
              <div className="mt-4 text-sm text-amber-600 font-medium">
                <I18nText translationKey="collections.explore">Explorer →</I18nText>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </>
  );
});

DynamicCollections.displayName = 'DynamicCollections';

const FeaturedCollections: React.FC = () => {
  const { data: collections, isLoading, error } = useFeaturedCollections();
  const { currentLanguage } = useTranslation();

  const getTranslation = React.useCallback((collection: any, field: string) => {
    if (!collection?.collection_translations) {
      return '';
    }

    // Find translation for current language first
    const currentTranslation = collection.collection_translations.find(
      (t: any) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing or empty, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t: any) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    return '';
  }, [currentLanguage]);

  const hasValidCollections = collections && collections.length > 0;

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              <I18nText translationKey="collections.featured.title">Collections en Vedette</I18nText>
            </h2>
            <p className="text-red-600 mb-8">
              <I18nText translationKey="collections.featured.error">
                Unable to load collections at the moment.
              </I18nText>
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            <I18nText translationKey="collections.featured.title">Collections en Vedette</I18nText>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            <I18nText translationKey="collections.featured.description">
              Explorez des parcours thématiques à travers les symboles du monde entier
            </I18nText>
          </p>
        </div>

        {isLoading ? (
          <FeaturedCollectionsLoadingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {hasValidCollections ? (
              <DynamicCollections collections={collections} getTranslation={getTranslation} />
            ) : (
              <StaticCollections currentLanguage={currentLanguage} />
            )}
          </div>
        )}
        
        <div className="text-center">
          <Link to="/collections">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
              <I18nText translationKey="collections.featured.discoverAll">Découvrir Toutes les Collections</I18nText>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default React.memo(FeaturedCollections);
