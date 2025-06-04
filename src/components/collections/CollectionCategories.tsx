
import React, { useState, useEffect } from 'react';
import { useCollections } from '@/hooks/useCollections';
import { useCollectionCategories } from '@/hooks/useCollectionCategories';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from './sections/FeaturedCollectionsSection';
import { CollectionTabs } from './sections/CollectionTabs';
import { EnhancedErrorState } from './EnhancedErrorStates';
import { PerformanceTracker } from './PerformanceTracker';
import { Skeleton } from '@/components/ui/skeleton';

const CollectionCategories: React.FC = React.memo(() => {
  const { data: collections, isLoading, error } = useCollections();
  const { featured, cultures, periods, sciences, others } = useCollectionCategories(collections);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Debug logs détaillés
  console.log('🔍 CollectionCategories render state:', {
    isLoading,
    error: error ? error.message : null,
    collectionsCount: collections?.length || 0,
    collections: collections?.slice(0, 2), // Premiers éléments pour debug
    timestamp: new Date().toISOString()
  });

  // Force un timeout si loading trop long
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      console.log('⏰ Loading started...');
      timeoutId = setTimeout(() => {
        console.error('❌ Loading timeout after 10s - forcing display with empty state');
        setLoadingTimeout(true);
      }, 10000);
    } else {
      console.log('✅ Loading completed');
      setLoadingTimeout(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  const handleRetry = () => {
    console.log('🔄 Retry button clicked');
    window.location.reload();
  };

  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
  };

  if (error || loadingTimeout) {
    console.log('❌ Showing error state:', { error: error?.message, loadingTimeout });
    return (
      <div className="flex justify-center items-center min-h-96">
        <EnhancedErrorState
          error={error || new Error('Loading timeout')}
          context="collections-categories"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  if (isLoading && !loadingTimeout) {
    console.log('⏳ Showing loading state');
    return (
      <div className="space-y-12">
        <div className="text-center py-12">
          <p className="text-slate-600">
            <I18nText translationKey="collections.loading">
              Chargement des collections...
            </I18nText>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Debug: isLoading={String(isLoading)}, collections={collections?.length ?? 0}
          </p>
        </div>
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
    console.log('📭 Showing empty state');
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
        <p className="text-xs text-slate-400 mt-4">
          Debug: collections array = {JSON.stringify(collections)}
        </p>
      </div>
    );
  }

  console.log('✅ Showing collections content:', {
    featuredCount: featured.length,
    culturesCount: cultures.length,
    periodsCount: periods.length,
    sciencesCount: sciences.length,
    othersCount: others.length
  });

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
