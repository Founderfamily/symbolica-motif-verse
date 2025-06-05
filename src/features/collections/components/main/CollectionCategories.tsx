
import React, { useState, useEffect } from 'react';
import { useCollections } from '../../hooks/useCollections';
import { useCollectionCategories } from '../../hooks/useCollectionCategories';
import { I18nText } from '@/components/ui/i18n-text';
import { FeaturedCollectionsSection } from '../sections/FeaturedCollectionsSection';
import { CollectionTabs } from '@/components/collections/sections/CollectionTabs';
import { EnhancedErrorState } from '@/components/collections/EnhancedErrorStates';
import { PerformanceTracker } from '@/components/collections/PerformanceTracker';
import { Skeleton } from '@/components/ui/skeleton';
import { CollectionWithTranslations } from '../../types/collections';

// Collections de fallback temporaires pour diagnostic
const getFallbackCollections = (): CollectionWithTranslations[] => [
  {
    id: 'fallback-1',
    slug: 'geometrie-sacree-fallback',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    collection_translations: [
      {
        id: 1,
        collection_id: 'fallback-1',
        language: 'fr',
        title: 'Géométrie Sacrée (Debug)',
        description: 'Collection de fallback pour diagnostic - Explorez les motifs géométriques sacrés'
      },
      {
        id: 2,
        collection_id: 'fallback-1',
        language: 'en',
        title: 'Sacred Geometry (Debug)',
        description: 'Fallback collection for debugging - Explore sacred geometric patterns'
      }
    ]
  },
  {
    id: 'fallback-2',
    slug: 'mysteres-anciens-fallback',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false,
    collection_translations: [
      {
        id: 3,
        collection_id: 'fallback-2',
        language: 'fr',
        title: 'Mystères Anciens (Debug)',
        description: 'Collection de fallback - Découvrez les symboles énigmatiques des civilisations perdues'
      },
      {
        id: 4,
        collection_id: 'fallback-2',
        language: 'en',
        title: 'Ancient Mysteries (Debug)',
        description: 'Fallback collection - Discover enigmatic symbols of lost civilizations'
      }
    ]
  }
];

const CollectionCategories: React.FC = React.memo(() => {
  const { data: collections, isLoading, error } = useCollections();
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

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

  // Déterminer les collections à utiliser
  const finalCollections = useFallback ? getFallbackCollections() : collections || [];
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

  // Timeout de sécurité
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading) {
      console.log('⏰ [CollectionCategories] Loading timeout started...');
      timeoutId = setTimeout(() => {
        console.error('❌ [CollectionCategories] TIMEOUT après 8s - activation fallback');
        setLoadingTimeout(true);
        setUseFallback(true);
      }, 8000);
    } else {
      console.log('✅ [CollectionCategories] Loading completed normally');
      setLoadingTimeout(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading]);

  // Fallback automatique si pas de données après loading
  useEffect(() => {
    if (!isLoading && !error && (!collections || collections.length === 0)) {
      console.warn('⚠️ [CollectionCategories] Aucune donnée reçue - activation fallback automatique');
      setUseFallback(true);
    }
  }, [isLoading, error, collections]);

  const handleRetry = () => {
    console.log('🔄 [CollectionCategories] Retry button clicked');
    setUseFallback(false);
    window.location.reload();
  };

  const handlePerformanceUpdate = (metrics: any) => {
    setPerformanceMetrics(metrics);
  };

  // État d'erreur avec option de fallback
  if (error && !useFallback) {
    console.log('❌ [CollectionCategories] Showing error state with fallback option');
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center space-y-4">
          <EnhancedErrorState
            error={error}
            context="collections-categories"
            onRetry={handleRetry}
          />
          <button 
            onClick={() => setUseFallback(true)}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Utiliser les collections de démonstration
          </button>
        </div>
      </div>
    );
  }

  // État de chargement (uniquement si pas de fallback)
  if (isLoading && !useFallback && !loadingTimeout) {
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
      <div className="text-center py-12 space-y-4">
        <h3 className="text-xl font-medium mb-2 text-slate-700">
          <I18nText translationKey="collections.noCollections">No collections available</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey="collections.noCollectionsMessage">
            Collections will be available soon. Come back later!
          </I18nText>
        </p>
        <button 
          onClick={() => setUseFallback(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Voir les collections de démonstration
        </button>
        <p className="text-xs text-slate-400 mt-4">
          Debug: finalCollections = {JSON.stringify(finalCollections?.slice(0, 1))} | source = {useFallback ? 'fallback' : 'supabase'}
        </p>
      </div>
    );
  }

  console.log('✅ [CollectionCategories] Showing collections content with data source:', useFallback ? 'FALLBACK' : 'SUPABASE');

  return (
    <>
      <PerformanceTracker onMetricsUpdate={handlePerformanceUpdate} />
      
      {useFallback && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            🔧 Mode diagnostic activé - Collections de démonstration affichées. 
            <button 
              onClick={() => {setUseFallback(false); window.location.reload();}}
              className="ml-2 underline hover:no-underline"
            >
              Réessayer avec les vraies données
            </button>
          </p>
        </div>
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
      
      {/* Debug info en développement */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-gray-600">
          <strong>Debug Info:</strong> 
          {finalCollections.length} collections loaded from {useFallback ? 'FALLBACK' : 'SUPABASE'} |
          Featured: {featured.length} | 
          Others: {cultures.length + periods.length + sciences.length + others.length}
        </div>
      )}
    </>
  );
});

CollectionCategories.displayName = 'CollectionCategories';

export default CollectionCategories;
