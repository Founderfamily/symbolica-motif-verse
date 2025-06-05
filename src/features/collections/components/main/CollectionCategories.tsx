
import React, { useState, useEffect } from 'react';
import { useCollections } from '../../hooks/useCollections';
import { useCollectionCategories } from '../../hooks/useCollectionCategories';
import { useFallbackCollections } from '../../hooks/useFallbackCollections';
import { useLoadingTimeout } from '../../hooks/useLoadingTimeout';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from '../sections/FeaturedCollectionsSection';
import { CollectionTabs } from '@/components/collections/sections/CollectionTabs';
import { PerformanceTracker } from '@/components/collections/PerformanceTracker';
import { Skeleton } from '@/components/ui/skeleton';
import { FallbackNotice } from '../states/FallbackNotice';
import { CollectionErrorState } from '../states/CollectionErrorState';
import { CollectionEmptyState } from '../states/CollectionEmptyState';
import { CollectionDebugInfo } from '../debug/CollectionDebugInfo';

const CollectionCategories: React.FC = React.memo(() => {
  const { data: collections, isLoading, error } = useCollections();
  const { useFallback, fallbackCollections, enableFallback, disableFallback } = useFallbackCollections();
  const [performanceMetrics, setPerformanceMetrics] = useState(null);

  // LOGS DE DEBUG TRÈS DÉTAILLÉS
  console.log('🔍 [CollectionCategories] DIAGNOSTIC COMPLET:', {
    timestamp: new Date().toISOString(),
    route: '/collections',
    isLoading,
    error: error ? {
      message: error.message,
      name: error.name,
      stack: error.stack?.substring(0, 200)
    } : null,
    collections: {
      type: typeof collections,
      isArray: Array.isArray(collections),
      length: collections?.length || 0,
      isNull: collections === null,
      isUndefined: collections === undefined,
      firstItem: collections?.[0] || null,
      rawValue: collections
    },
    performance: {
      userAgent: navigator.userAgent.substring(0, 50),
      connectionType: (navigator as any).connection?.effectiveType || 'unknown',
      memoryUsage: (performance as any).memory ? {
        used: Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round((performance as any).memory.totalJSHeapSize / 1024 / 1024)
      } : 'unavailable'
    }
  });

  // Setup loading timeout with fallback activation
  useLoadingTimeout({
    isLoading,
    timeoutMs: 8000,
    onTimeout: enableFallback
  });

  // Fallback automatique si pas de données après loading
  useEffect(() => {
    if (!isLoading && !error && (!collections || collections.length === 0)) {
      console.warn('⚠️ [CollectionCategories] Aucune donnée reçue - activation fallback automatique');
      enableFallback();
    }
  }, [isLoading, error, collections, enableFallback]);

  // Déterminer les collections à utiliser
  const finalCollections = useFallback ? fallbackCollections : collections || [];
  const { featured, cultures, periods, sciences, others } = useCollectionCategories(finalCollections);

  console.log('📊 [CollectionCategories] DONNÉES ANALYSÉES:', {
    finalCollections: {
      count: finalCollections.length,
      source: useFallback ? 'FALLBACK' : 'SUPABASE',
      sample: finalCollections.slice(0, 2)
    },
    categorization: {
      featured: featured.length,
      cultures: cultures.length,
      periods: periods.length,
      sciences: sciences.length,
      others: others.length
    }
  });

  const handleRetry = () => {
    console.log('🔄 [CollectionCategories] Retry button clicked');
    disableFallback();
    window.location.reload();
  };

  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
  };

  // État d'erreur avec option de fallback
  if (error && !useFallback) {
    console.log('❌ [CollectionCategories] Showing error state with fallback option');
    return (
      <CollectionErrorState
        error={error}
        onRetry={handleRetry}
        onUseFallback={enableFallback}
      />
    );
  }

  // État de chargement (uniquement si pas de fallback)
  if (isLoading && !useFallback) {
    console.log('⏳ [CollectionCategories] Showing loading state');
    return (
      <div className="space-y-12">
        <div className="text-center py-12">
          <p className="text-slate-600">
            <I18nText translationKey="collections.loading">
              Chargement des collections...
            </I18nText>
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Debug: isLoading={String(isLoading)}, route=/collections
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

  // État vide uniquement si vraiment aucune donnée (même pas de fallback)
  if (!useFallback && (!finalCollections || finalCollections.length === 0)) {
    console.log('📭 [CollectionCategories] Showing empty state');
    return (
      <CollectionEmptyState
        onUseFallback={enableFallback}
        collections={finalCollections}
        useFallback={useFallback}
      />
    );
  }

  console.log('✅ [CollectionCategories] Showing collections content with data source:', useFallback ? 'FALLBACK' : 'SUPABASE');

  return (
    <>
      <PerformanceTracker onMetricsUpdate={handlePerformanceUpdate} />
      
      {useFallback && (
        <FallbackNotice onRetry={handleRetry} />
      )}
      
      <div className="space-y-12">
        <FeaturedCollectionsSection collections={featured} />
        <CollectionTabs 
          cultures={cultures}
          periods={periods}
          sciences={sciences}
          others={others}
        />
      </div>
      
      <CollectionDebugInfo
        collections={finalCollections}
        useFallback={useFallback}
        featured={featured}
        others={cultures.length + periods.length + sciences.length + others.length}
      />
    </>
  );
});

CollectionCategories.displayName = 'CollectionCategories';

export default CollectionCategories;
