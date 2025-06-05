
import React from 'react';
import { CollectionWithTranslations } from '../../types/collections';

interface CollectionDebugInfoProps {
  collections: CollectionWithTranslations[];
  useFallback: boolean;
  featured: CollectionWithTranslations[];
  others: CollectionWithTranslations[];
}

export const CollectionDebugInfo: React.FC<CollectionDebugInfoProps> = ({
  collections,
  useFallback,
  featured,
  others
}) => {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="mt-8 p-4 bg-gray-100 rounded text-xs text-gray-600">
      <strong>Debug Info:</strong> 
      {collections.length} collections loaded from {useFallback ? 'FALLBACK' : 'SUPABASE'} |
      Featured: {featured.length} | 
      Others: {others.length}
    </div>
  );
};
