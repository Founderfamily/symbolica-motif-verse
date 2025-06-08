
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { useFeaturedCollections } from '@/features/collections/hooks/useCollections';
import { useTranslation } from '@/i18n/useTranslation';

const LazyDynamicCollections: React.FC = () => {
  const { data: collections, isLoading, error } = useFeaturedCollections();
  const { currentLanguage } = useTranslation();

  // Don't render anything while loading to avoid layout shift
  if (isLoading || error || !collections || collections.length === 0) {
    return null;
  }

  const getTranslation = (collection: any, field: string) => {
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
  };

  return (
    <>
      {/* Only show additional collections if we have dynamic data and avoid duplicates */}
      {collections.slice(4, 8).map((collection) => (
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
};

export default LazyDynamicCollections;
