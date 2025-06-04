
import React from 'react';
import { useFeaturedCollections } from '@/hooks/useCollections';
import CollectionCard from './CollectionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';

const FeaturedCollectionsGrid: React.FC = () => {
  const { data: collections, isLoading, error } = useFeaturedCollections();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-red-600">
          <I18nText translationKey="collections.errorLoading">Error loading collections</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="collections.errorMessage">
            Unable to load featured collections. Please try again later.
          </I18nText>
        </p>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-slate-700">
          <I18nText translationKey="collections.noFeaturedCollections">No featured collections</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="collections.noFeaturedCollectionsMessage">
            Thematic collections coming soon!
          </I18nText>
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default FeaturedCollectionsGrid;
