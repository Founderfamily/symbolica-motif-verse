
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';
import { CollectionWithTranslations } from '@/types/collections';
import { useCollectionTranslations } from '@/hooks/useCollectionTranslations';

interface CollectionCardProps {
  collection: CollectionWithTranslations;
}

const CollectionCard: React.FC<CollectionCardProps> = React.memo(({ collection }) => {
  const { getTranslation } = useCollectionTranslations();

  // Fallbacks robustes pour les traductions
  const title = getTranslation(collection, 'title') || collection.slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
  const description = getTranslation(collection, 'description') || `Découvrez la collection ${title}`;

  return (
    <Link
      to={`/collections/${collection.slug}`}
      className="block transition-transform hover:scale-105"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <CardTitle className="text-xl">
              {title}
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
            {description}
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            <I18nText translationKey="collections.explore">Explore →</I18nText>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
});

CollectionCard.displayName = 'CollectionCard';

export default CollectionCard;
