
import React from 'react';
import { CollectionWithTranslations } from '@/types/collections';
import { AdaptiveGrid } from '../AdaptiveGrid';
import { EmptyCategory } from './EmptyCategory';
import { useRouter } from 'react-router-dom';

interface CategoryGridProps {
  collections: CollectionWithTranslations[];
  emptyMessage?: string;
}

export const CategoryGrid: React.FC<CategoryGridProps> = React.memo(({ 
  collections, 
  emptyMessage = "collections.categories.noOthers" 
}) => {
  const router = useRouter();

  const handleCollectionSelect = (collection: CollectionWithTranslations) => {
    router.push(`/collections/${collection.slug}`);
  };

  if (collections.length === 0) {
    return <EmptyCategory message={emptyMessage} />;
  }

  return (
    <AdaptiveGrid 
      collections={collections}
      onCollectionSelect={handleCollectionSelect}
    />
  );
});

CategoryGrid.displayName = 'CategoryGrid';
