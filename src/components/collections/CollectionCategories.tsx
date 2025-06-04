
import React, { useState, useEffect } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useCollectionCategories } from '@/hooks/useCollectionCategories';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from './sections/FeaturedCollectionsSection';
import { CollectionTabs } from './sections/CollectionTabs';
import { EnhancedErrorState } from './EnhancedErrorStates';
import { PerformanceTracker } from './PerformanceTracker';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';

const CollectionCategories: React.FC = React.memo(() => {
  const queryClient = useQueryClient();
  const { data: collections, isLoading, error } = useCollections();
  const { featured, cultures, periods, sciences, others } = useCollectionCategories(collections);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // Vider le cache au démarrage pour forcer un rechargement frais
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['collections'] });
  }, [queryClient]);

  const handleRetry = () => {
    queryClient.clear();
    window.location.reload();
  };

  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
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

  if (isLoading) {
    return (
      <div className="space-y-12">
        <div className="text-center py-12">
          <p className="text-slate-600">
            <I18nText translationKey="collections.loading">
              Chargement des collections...
            </I18nText>
          </p>
        </div>
        {/* Skeleton loader simple */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      
      <div className="space-y-12">
        <FeaturedCollectionsSection collections={featured} />
        <CollectionTabs 
          cultures={cultures}
          periods={periods}
          sciences={sciences}
          others={others}
        />
      </div>
    </>
  );
});

CollectionCategories.displayName = 'CollectionCategories';

export default CollectionCategories;
