
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CollectionWithTranslations } from '@/types/collections';
import { useTranslation } from '@/i18n/useTranslation';

interface CollectionCardProps {
  collection: CollectionWithTranslations;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
  const { language } = useTranslation();

  const getTranslation = (field: string) => {
    const translation = collection.collection_translations?.find(
      (t: any) => t.language === language
    );
    return translation?.[field] || '';
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
              <Badge variant="default">Featured</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600 line-clamp-3">
            {getTranslation('description')}
          </p>
          <div className="mt-4 text-sm text-amber-600 font-medium">
            Explorer cette collection →
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CollectionCard;
