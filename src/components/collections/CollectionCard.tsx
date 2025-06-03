
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { CollectionWithTranslations } from '@/types/collections';
import { useTranslation } from '@/i18n/useTranslation';

interface CollectionCardProps {
  collection: CollectionWithTranslations;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const { currentLanguage } = useTranslation();

  const getTranslation = (field: string) => {
    const translation = collection.collection_translations?.find(
      (t: any) => t.language === currentLanguage
    );
    const value = translation?.[field];
    
    // Fallback logic: if current language translation is missing, try the other language
    if (!value && collection.collection_translations?.length > 0) {
      const fallbackTranslation = collection.collection_translations.find(
        (t: any) => t.language !== currentLanguage
      );
      console.log('Using fallback translation for', field, ':', fallbackTranslation?.[field]);
      return fallbackTranslation?.[field] || `[${field} missing]`;
    }
    
    return value || `[${field} missing]`;
  };

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">
              {getTranslation('title')}
            </CardTitle>
            {collection.is_featured && (
              <Badge variant="default">
                <I18nText translationKey="collections.featuredBadge">Featured</I18nText>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 line-clamp-3">
            {getTranslation('description')}
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            <I18nText translationKey="collections.explore">Explore →</I18nText>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CollectionCard;
