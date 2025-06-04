
import React from 'react';
import { useOptimizedCollections } from '@/hooks/useOptimizedCollections';
import { useCollectionCategories } from '@/hooks/useCollectionCategories';
import { useOptimizedLoading } from '@/hooks/useOptimizedLoading';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from './sections/FeaturedCollectionsSection';
import { CollectionTabs } from './sections/CollectionTabs';

const CollectionCategories: React.FC = React.memo(() => {
  const { collections, isLoading, error, prefetchFeatured } = useOptimizedCollections();
  const { featured, cultures, periods, others } = useCollectionCategories(collections);
  const { isInitialLoading } = useOptimizedLoading(isLoading);

  // Prefetch des collections populaires au montage
  React.useEffect(() => {
    if (!isLoading && collections.length > 0) {
      prefetchFeatured();
    }
  }, [isLoading, collections.length, prefetchFeatured]);

  if (isInitialLoading) {
    return (
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
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
            Unable to load collections. Please try again later.
          </I18nText>
        </p>
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

  return (
    <div className="space-y-12">
      <FeaturedCollectionsSection collections={featured} />
      <CollectionTabs 
        cultures={cultures}
        periods={periods}
        others={others}
      />
    </div>
  );
});

CollectionCategories.displayName = 'CollectionCategories';

export default CollectionCategories;
