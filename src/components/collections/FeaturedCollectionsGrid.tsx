
import React from 'react';
import { useFeaturedCollections } from '@/features/collections/hooks/useCollections';
import CollectionCard from '@/features/collections/components/cards/CollectionCard';
import { CollectionLoadingSkeleton } from './CollectionLoadingSkeleton';
import { CollectionErrorState } from './CollectionErrorState';
import { CollectionEmptyState } from './CollectionEmptyState';

const FeaturedCollectionsGrid: React.FC = React.memo(() => {
  const { data: collections, isLoading, error } = useFeaturedCollections();

  if (isLoading) {
    return <CollectionLoadingSkeleton />;
  }

  if (error) {
    return <CollectionErrorState />;
  }

  if (!collections || collections.length === 0) {
    return <CollectionEmptyState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
});

FeaturedCollectionsGrid.displayName = 'FeaturedCollectionsGrid';

export default FeaturedCollectionsGrid;
