
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useFeaturedCollections } from '@/hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedCollections: React.FC = () => {
  const { data: collections, isLoading } = useFeaturedCollections();
  const { currentLanguage } = useTranslation();

  const getTranslation = (collection: any, field: string) => {
    // Find translation for current language first
    const currentTranslation = collection.collection_translations?.find(
      (t: any) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing or empty, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations?.find(
      (t: any) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    return '';
  };

  // Static collections fallback if no data is available
  const staticCollections = [
    {
      id: '1',
      slug: 'geometrie-sacree',
      title: 'Géométrie Sacrée',
      description: 'Explorez les motifs géométriques sacrés à travers les cultures : mandalas, spirales dorées, fractales naturelles.',
      is_featured: true
    },
    {
      id: '2', 
      slug: 'mysteres-anciens',
      title: 'Mystères Anciens',
      description: 'Découvrez les symboles énigmatiques des civilisations perdues et leurs significations cachées.',
      is_featured: true
    },
    {
      id: '3',
      slug: 'mythologies-mondiales', 
      title: 'Mythologies Mondiales',
      description: 'Plongez dans l\'univers des créatures mythiques et des divinités à travers les cultures du monde.',
      is_featured: true
    },
    {
      id: '4',
      slug: 'ere-numerique',
      title: 'Ère Numérique',
      description: 'L\'évolution des symboles à l\'ère digitale : émojis, logos, iconographie moderne.',
      is_featured: true
    }
  ];

  const displayCollections = collections && collections.length > 0 ? collections : staticCollections;

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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {displayCollections.map((collection) => (
              <Link
                key={collection.id}
                to={`/collections/${collection.slug}`}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">
                        {collections && collections.length > 0 
                          ? getTranslation(collection, 'title') 
                          : collection.title
                        }
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
                      {collections && collections.length > 0 
                        ? getTranslation(collection, 'description') 
                        : collection.description
                      }
                    </p>
                    <div className="mt-4 text-sm text-amber-600 font-medium">
                      <I18nText translationKey="collections.explore">Explorer →</I18nText>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
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

export default FeaturedCollections;
