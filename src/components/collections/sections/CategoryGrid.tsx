
import React from 'react';
import { CollectionWithTranslations } from '@/types/collections';
import CollectionCard from '../CollectionCard';
import { EmptyCategory } from './EmptyCategory';

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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
});

CategoryGrid.displayName = 'CategoryGrid';
