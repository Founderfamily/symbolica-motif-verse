
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface CollectionLoadingSkeletonProps {
  count?: number;
}

export const CollectionLoadingSkeleton: React.FC<CollectionLoadingSkeletonProps> = React.memo(({ count = 6 }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
});

CollectionLoadingSkeleton.displayName = 'CollectionLoadingSkeleton';
