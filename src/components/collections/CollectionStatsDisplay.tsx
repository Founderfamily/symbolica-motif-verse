
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CollectionWithTranslations } from '@/features/collections/types/collections';

interface CollectionStatsDisplayProps {
  collections?: CollectionWithTranslations[];
}

export const CollectionStatsDisplay: React.FC<CollectionStatsDisplayProps> = ({ collections }) => {
  if (!collections || collections.length === 0) {
    return null;
  }

  const featuredCount = collections.filter(c => c.is_featured).length;

  return (
    <Badge variant="secondary" className="ml-2">
      {collections.length} {featuredCount > 0 && `(${featuredCount} featured)`}
    </Badge>
  );
};
