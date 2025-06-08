
// Main collections hooks - migrated to new architecture
export { useCollectionsQuery as useCollections } from '@/features/collections/hooks/queries/useCollectionsQuery';
export { useFeaturedCollectionsQuery as useFeaturedCollections } from '@/features/collections/hooks/queries/useFeaturedCollectionsQuery';
export { useCollectionBySlugQuery as useCollection } from '@/features/collections/hooks/queries/useCollectionBySlugQuery';
export { useCreateCollectionMutation as useCreateCollection } from '@/features/collections/hooks/mutations/useCreateCollectionMutation';
export { useUpdateCollectionMutation as useUpdateCollection } from '@/features/collections/hooks/mutations/useUpdateCollectionMutation';
export { useDeleteCollectionMutation as useDeleteCollection } from '@/features/collections/hooks/mutations/useDeleteCollectionMutation';
export { useUpdateSymbolsOrderMutation as useUpdateSymbolsOrder } from '@/features/collections/hooks/mutations/useUpdateSymbolsOrderMutation';

// Re-export query keys for external use
export { COLLECTIONS_QUERY_KEYS } from '@/features/collections/hooks/queries/useCollectionsQuery';

// Re-export collection categories hook
export { useCollectionCategories } from '@/features/collections/hooks/useCollectionCategories';
