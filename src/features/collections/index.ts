
// Main exports for the collections feature
export { default as CollectionsPage } from './pages/CollectionsPage';
export { default as CollectionCategories } from './components/main/CollectionCategories';
export { default as CollectionCard } from './components/cards/CollectionCard';
export { UnifiedCollectionGrid } from './components/grids/UnifiedCollectionGrid';
export { FeaturedCollectionsSection } from './components/sections/FeaturedCollectionsSection';

// Debug and utility components
export { CollectionDebugInfo } from './components/debug/CollectionDebugInfo';
export { FallbackNotice } from './components/states/FallbackNotice';
export { CollectionErrorState } from './components/states/CollectionErrorState';
export { CollectionEmptyState } from './components/states/CollectionEmptyState';

// Hooks - main exports
export * from './hooks/useCollections';

// Hooks - utilities
export { useFallbackCollections } from './hooks/useFallbackCollections';
export { useLoadingTimeout } from './hooks/useLoadingTimeout';

// Hooks - specific queries and mutations
export * from './hooks/queries';
export * from './hooks/mutations';

// Services
export { collectionsService } from './services';

// Types
export * from './types/collections';
