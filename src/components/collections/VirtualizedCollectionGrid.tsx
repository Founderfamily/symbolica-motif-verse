
import React, { useMemo, useCallback } from 'react';
import { CollectionWithTranslations } from '@/types/collections';
import CollectionCard from './CollectionCard';
import { EmptyCategory } from '@/features/collections/components/states/EmptyCategory';

interface VirtualizedCollectionGridProps {
  collections: CollectionWithTranslations[];
  emptyMessage?: string;
  pageSize?: number;
  currentPage?: number;
}

export const VirtualizedCollectionGrid: React.FC<VirtualizedCollectionGridProps> = React.memo(({ 
  collections, 
  emptyMessage = "collections.categories.noOthers",
  pageSize = 12,
  currentPage = 1
}) => {
  // Pagination virtuelle pour les performances
  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return collections.slice(startIndex, endIndex);
  }, [collections, currentPage, pageSize]);

  // Memoized card renderer pour éviter les re-renders inutiles
  const renderCard = useCallback((collection: CollectionWithTranslations) => (
    <CollectionCard key={collection.id} collection={collection} />
  ), []);

  if (collections.length === 0) {
    return <EmptyCategory message={emptyMessage} />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedCollections.map(renderCard)}
    </div>
  );
});

VirtualizedCollectionGrid.displayName = 'VirtualizedCollectionGrid';
