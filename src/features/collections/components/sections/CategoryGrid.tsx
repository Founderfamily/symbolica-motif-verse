
import React from 'react';
import { CollectionWithTranslations } from '../../types/collections';
import { UnifiedCollectionGrid } from '../grids/UnifiedCollectionGrid';
import { EmptyCategory } from '../states/EmptyCategory';

interface CategoryGridProps {
  collections: CollectionWithTranslations[];
  emptyMessage?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = React.memo(({ 
  collections, 
  emptyMessage = "collections.categories.noOthers" 
}) => {
  if (collections.length === 0) {
    return <EmptyCategory message={emptyMessage} />;
  }

  return (
    <UnifiedCollectionGrid collections={collections} />
  );
});

CategoryGrid.displayName = 'CategoryGrid';
