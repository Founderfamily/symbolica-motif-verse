
import { lazy, Suspense } from 'react';
import { CollectionLoadingSkeleton } from './CollectionLoadingSkeleton';

const CollectionDetailPage = lazy(() => import('@/pages/CollectionDetailPage'));

export const LazyCollectionDetailPage = () => (
  <Suspense fallback={<CollectionLoadingSkeleton count={8} />}>
    <CollectionDetailPage />
  </Suspense>
);

export default LazyCollectionDetailPage;
