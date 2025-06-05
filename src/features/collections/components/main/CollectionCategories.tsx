import React from 'react';
import { UnifiedCollectionGrid } from '../grids/UnifiedCollectionGrid';
import { useCollections } from '../../hooks/useCollections';
import { useFallbackCollections } from '../../hooks/useFallbackCollections';
import { useLoadingTimeout } from '../../hooks/useLoadingTimeout';
import { CollectionDebugInfo } from '../debug/CollectionDebugInfo';
import { FallbackNotice } from '../states/FallbackNotice';
import { CollectionErrorState } from '../states/CollectionErrorState';
import { CollectionEmptyState } from '../states/CollectionEmptyState';
import { useTranslation } from '@/i18n/useTranslation';

const CollectionCategories: React.FC = () => {
  const { currentLanguage } = useTranslation();
  const { data: collections = [], isLoading, error, refetch } = useCollections();
  
  const {
    useFallback,
    fallbackCollections,
    enableFallback,
    disableFallback
  } = useFallbackCollections();

  const onTimeout = () => {
    console.log('🚨 Loading timeout reached - enabling fallback mode');
    enableFallback();
  };

  useLoadingTimeout({ isLoading, onTimeout });

  const handleRetry = () => {
    console.log('🔄 Retry requested - disabling fallback and refetching...');
    disableFallback();
    refetch();
  };

  const handleUseFallback = () => {
    console.log('⚠️ Manual fallback activation requested');
    enableFallback();
  };

  // Use fallback collections if enabled, otherwise use real collections
  const finalCollections = useFallback ? fallbackCollections : collections;

  console.log('🎯 [CollectionCategories] Rendering state:', {
    isLoading,
    error: !!error,
    useFallback,
    collectionsCount: finalCollections.length,
    finalCollections: finalCollections.slice(0, 2) // Sample for debugging
  });

  // Split collections into featured and others
  const featured = finalCollections.filter(collection => collection.is_featured);
  const others = finalCollections.filter(collection => !collection.is_featured);

  // Show fallback notice if we're using fallback data
  const showFallbackNotice = useFallback && !isLoading;

  // Handle error state
  if (error && !useFallback) {
    return (
      <CollectionErrorState
        error={error}
        onRetry={handleRetry}
        onUseFallback={handleUseFallback}
      />
    );
  }

  // Handle empty state (no collections and not using fallback)
  if (!isLoading && finalCollections.length === 0) {
    return (
      <CollectionEmptyState
        onUseFallback={handleUseFallback}
        collections={finalCollections}
        useFallback={useFallback}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {showFallbackNotice && (
        <FallbackNotice onRetry={handleRetry} />
      )}
      
      {/* Featured Collections Section */}
      {featured.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Featured Collections</h2>
          <UnifiedCollectionGrid
            collections={featured}
            isLoading={isLoading}
            maxCols="lg"
          />
        </div>
      )}

      {/* Other Collections Section */}
      {others.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Collections</h2>
          <UnifiedCollectionGrid
            collections={others}
            isLoading={isLoading}
          />
        </div>
      )}

      <CollectionDebugInfo
        collections={finalCollections}
        useFallback={useFallback}
        featured={featured}
        others={others}
      />
    </div>
  );
};

export default CollectionCategories;
