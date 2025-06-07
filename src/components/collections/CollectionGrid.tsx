
import React from 'react';
import { useCollections } from '@/features/collections/hooks/useCollections';
import CollectionCard from '@/features/collections/components/cards/CollectionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';

interface CollectionGridProps {
  limit?: number;
  featuredOnly?: boolean;
}

const CollectionGrid: React.FC<CollectionGridProps> = ({ limit, featuredOnly = false }) => {
  const { data: collections, isLoading } = useCollections();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(limit || 12)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-slate-700">
          <I18nText translationKey="collections.noCollections">No collections available</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="collections.noCollectionsMessage">
            Collections will be available soon. Come back later!
          </I18nText>
        </p>
      </div>
    );
  }

  const filteredCollections = featuredOnly 
    ? collections.filter(c => c.is_featured)
    : collections;

  const displayCollections = limit 
    ? filteredCollections.slice(0, limit)
    : filteredCollections;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayCollections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionGrid;
