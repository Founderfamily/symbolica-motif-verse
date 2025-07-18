
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const FeaturedCollectionsLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
      ))}
    </div>
  );
});

FeaturedCollectionsLoadingSkeleton.displayName = 'FeaturedCollectionsLoadingSkeleton';
