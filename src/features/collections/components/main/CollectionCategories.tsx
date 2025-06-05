import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useCollections } from '../../hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

// Static collections data function - not a component
const getStaticCollections = (currentLanguage: string) => [
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
    is_featured: false
  },
  {
    id: '4',
    slug: 'ere-numerique',
    title: currentLanguage === 'fr' ? 'Ère Numérique' : 'Digital Era',
    description: currentLanguage === 'fr'
      ? 'L\'évolution des symboles à l\'ère digitale : émojis, logos, iconographie moderne.'
      : 'The evolution of symbols in the digital age: emojis, logos, modern iconography.',
    is_featured: false
  },
  {
    id: '5',
    slug: 'alchimie-esoterisme',
    title: currentLanguage === 'fr' ? 'Alchimie & Ésotérisme' : 'Alchemy & Esotericism',
    description: currentLanguage === 'fr'
      ? 'Les symboles hermétiques et alchimiques : pentagrammes, ouroboros, signes planétaires.'
      : 'Hermetic and alchemical symbols: pentagrams, ouroboros, planetary signs.',
    is_featured: false
  },
  {
    id: '6',
    slug: 'art-religieux',
    title: currentLanguage === 'fr' ? 'Art Religieux' : 'Religious Art',
    description: currentLanguage === 'fr'
      ? 'Symboles sacrés des grandes traditions spirituelles : christianisme, islam, bouddhisme, hindouisme.'
      : 'Sacred symbols from major spiritual traditions: Christianity, Islam, Buddhism, Hinduism.',
    is_featured: false
  }
];

// Skeleton de chargement
const CollectionsLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-12">
      {/* Featured Collections Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Other Collections Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

CollectionsLoadingSkeleton.displayName = 'CollectionsLoadingSkeleton';

// Component principal
const CollectionCategories: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const { data: collections = [], isLoading, error } = useCollections();

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

  // Get static collections and ensure proper typing
  const staticCollections = React.useMemo(() => getStaticCollections(currentLanguage), [currentLanguage]);
  
  const hasValidCollections = collections && collections.length > 0;
  const finalCollections = hasValidCollections ? collections : staticCollections;

  // Split collections into featured and others
  const featured = finalCollections.filter(collection => collection.is_featured);
  const others = finalCollections.filter(collection => !collection.is_featured);

  // Loading state
  if (isLoading) {
    return <CollectionsLoadingSkeleton />;
  }

  // Error state - but still show static content
  if (error && !hasValidCollections) {
    console.warn('Collections API error, using static fallback:', error);
  }

  return (
    <div className="space-y-12">
      {/* Featured Collections Section */}
      {featured.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              <I18nText translationKey="collections.featured.title">Collections en Vedette</I18nText>
            </h2>
            <Badge className="bg-amber-600 hover:bg-amber-700">
              <I18nText translationKey="collections.featuredBadge">En vedette</I18nText>
            </Badge>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">
                        {hasValidCollections ? getTranslation(collection, 'title') : collection.title}
                      </CardTitle>
                      <Badge variant="default">
                        <I18nText translationKey="collections.featuredBadge">Vedette</I18nText>
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {hasValidCollections ? getTranslation(collection, 'description') : collection.description}
                    </p>
                    <div className="mt-4 text-sm text-amber-600 font-medium">
                      <I18nText translationKey="collections.explore">Explorer →</I18nText>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other Collections Section */}
      {others.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            <I18nText translationKey="collections.allCollections">Toutes les Collections</I18nText>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {others.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {hasValidCollections ? getTranslation(collection, 'title') : collection.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 text-sm line-clamp-3">
                      {hasValidCollections ? getTranslation(collection, 'description') : collection.description}
                    </p>
                    <div className="mt-4 text-sm text-amber-600 font-medium">
                      <I18nText translationKey="collections.explore">Explorer →</I18nText>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Call to Action for more collections */}
      <section className="text-center py-8 bg-slate-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">
          <I18nText translationKey="collections.discoverMore">Découvrez plus de collections</I18nText>
        </h3>
        <p className="text-slate-600 mb-6">
          <I18nText translationKey="collections.discoverMoreDescription">
            De nouvelles collections thématiques sont ajoutées régulièrement
          </I18nText>
        </p>
        <Link to="/symbols">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
            <I18nText translationKey="collections.exploreSymbols">Explorer les Symboles</I18nText>
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default CollectionCategories;
