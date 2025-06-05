
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { I18nText } from '@/components/ui/i18n-text';

interface FilteredCollectionGridProps {
  collections: any[];
  getCollectionTitle: (collection: any) => string;
  getCollectionDescription: (collection: any) => string;
}

export const FilteredCollectionGrid: React.FC<FilteredCollectionGridProps> = ({
  collections,
  getCollectionTitle,
  getCollectionDescription
}) => {
  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-400 text-lg mb-4">
          <I18nText translationKey="collections.noResults">Aucune collection trouvée</I18nText>
        </div>
        <p className="text-slate-500">
          <I18nText translationKey="collections.noResultsMessage">
            Essayez de modifier vos critères de recherche ou de filtrage.
          </I18nText>
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          to={`/collections/${collection.slug}`}
          className="block transition-transform hover:scale-105"
        >
          <Card className="h-full hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-lg">
                  {getCollectionTitle(collection)}
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
                {getCollectionDescription(collection)}
              </p>
              <div className="mt-4 text-sm text-amber-600 font-medium">
                <I18nText translationKey="collections.explore">Explorer →</I18nText>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
