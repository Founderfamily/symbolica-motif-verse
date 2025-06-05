
// Main exports for the collections feature
export { default as CollectionsPage } from './pages/CollectionsPage';
export { default as CollectionCategories } from './components/main/CollectionCategories';
export { default as CollectionCard } from './components/cards/CollectionCard';
export { UnifiedCollectionGrid } from './components/grids/UnifiedCollectionGrid';
export { FeaturedCollectionsSection } from './components/sections/FeaturedCollectionsSection';

// Hooks - main exports
export * from './hooks/useCollections';

// Hooks - specific queries and mutations
export * from './hooks/queries';
export * from './hooks/mutations';

// Services
export { collectionsService } from './services';

// Types
export * from './types/collections';
