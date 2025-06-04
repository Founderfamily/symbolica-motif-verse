
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { CollectionWithTranslations } from '@/types/collections';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';

interface OptimizedCollectionCardProps {
  collection: CollectionWithTranslations;
}

export const OptimizedCollectionCard: React.FC<OptimizedCollectionCardProps> = React.memo(({ collection }) => {
  const { getTranslation } = useCollectionTranslations();

  // Memoized translations pour éviter les recalculs
  const cardData = useMemo(() => ({
    title: getTranslation(collection, 'title'),
    description: getTranslation(collection, 'description'),
    slug: collection.slug,
    isFeatured: collection.is_featured
  }), [collection, getTranslation]);

  return (
    <Link
      to={`/collections/${cardData.slug}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">
              {cardData.title}
            </CardTitle>
            {cardData.isFeatured && (
              <Badge variant="default">
                <I18nText translationKey="collections.featuredBadge">Featured</I18nText>
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 line-clamp-3">
            {cardData.description}
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            <I18nText translationKey="collections.explore">Explore →</I18nText>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

OptimizedCollectionCard.displayName = 'OptimizedCollectionCard';
