
import React, { useState } from 'react';
import { useOptimizedCollections } from '@/hooks/useOptimizedCollections';
import { useCollectionCategories } from '@/hooks/useCollectionCategories';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from './sections/FeaturedCollectionsSection';
import { CollectionTabs } from './sections/CollectionTabs';
import { ProgressiveLoader } from './ProgressiveLoader';
import { EnhancedErrorState } from './EnhancedErrorStates';
import { PerformanceTracker } from './PerformanceTracker';
import { AdaptiveGrid } from './AdaptiveGrid';

const CollectionCategories: React.FC = React.memo(() => {
  const { collections, isLoading, error, prefetchFeatured } = useOptimizedCollections();
  const { featured, cultures, periods, others } = useCollectionCategories(collections);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Prefetch des collections populaires au montage
  React.useEffect(() => {
    if (!isLoading && collections.length > 0) {
      prefetchFeatured();
    }
  }, [isLoading, collections.length, prefetchFeatured]);

  const handleRetry = () => {
    window.location.reload();
  };

  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
    console.log('Collections Performance Metrics:', metrics);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <EnhancedErrorState
          error={error}
          context="collections-categories"
          onRetry={handleRetry}
        />
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
    <>
      <PerformanceTracker onMetricsUpdate={handlePerformanceUpdate} />
      
      <ProgressiveLoader
        isLoading={isLoading}
        stage={isLoading ? 'fetching' : 'rendering'}
        estimatedTime={2000}
      >
        <div className="space-y-12">
          <FeaturedCollectionsSection collections={featured} />
          <CollectionTabs 
            cultures={cultures}
            periods={periods}
            others={others}
          />
        </div>
      </ProgressiveLoader>
    </>
  );
});

CollectionCategories.displayName = 'CollectionCategories';

export default CollectionCategories;
