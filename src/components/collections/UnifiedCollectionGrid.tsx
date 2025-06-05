
import React from 'react';
import { CollectionWithTranslations } from '@/types/collections';
import CollectionCard from './CollectionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { I18nText } from '@/components/ui/i18n-text';

interface UnifiedCollectionGridProps {
  collections: CollectionWithTranslations[];
  isLoading?: boolean;
  error?: Error | null;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  maxCols?: 'sm' | 'md' | 'lg' | 'xl';
}

export const UnifiedCollectionGrid: React.FC<UnifiedCollectionGridProps> = React.memo(({
  collections,
  isLoading = false,
  error = null,
  emptyMessage = "collections.noCollections",
  emptyDescription = "collections.noCollectionsMessage",
  className = "",
  maxCols = 'xl'
}) => {

  const getGridClasses = () => {
    const base = "grid gap-6";
    switch (maxCols) {
      case 'sm': return `${base} md:grid-cols-2`;
      case 'md': return `${base} md:grid-cols-2 lg:grid-cols-3`;
      case 'lg': return `${base} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      case 'xl': return `${base} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
      default: return `${base} md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`;
    }
  };

  if (isLoading) {
    return (
      <div className={`${getGridClasses()} ${className}`}>
        {[...Array(8)].map((_, i) => (
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
        <h3 className="text-xl font-medium mb-2 text-red-700">
          <I18nText translationKey="collections.errorTitle">Error loading collections</I18nText>
        </h3>
        <p className="text-red-600">
          {error.message}
        </p>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2 text-slate-700">
          <I18nText translationKey={emptyMessage}>No collections available</I18nText>
        </h3>
        <p className="text-slate-600">
          <I18nText translationKey={emptyDescription}>
            Collections will be available soon. Come back later!
          </I18nText>
        </p>
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} ${className}`}>
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
});

UnifiedCollectionGrid.displayName = 'UnifiedCollectionGrid';
