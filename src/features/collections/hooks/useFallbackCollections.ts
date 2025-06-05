
import { useState, useEffect } from 'react';
import { CollectionWithTranslations } from '../types/collections';

const getFallbackCollections = (): CollectionWithTranslations[] => [
  {
    id: 'fallback-1',
    slug: 'geometrie-sacree-fallback',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: true,
    collection_translations: [
      {
        id: 1,
        collection_id: 'fallback-1',
        language: 'fr',
        title: 'Géométrie Sacrée (Debug)',
        description: 'Collection de fallback pour diagnostic - Explorez les motifs géométriques sacrés'
      },
      {
        id: 2,
        collection_id: 'fallback-1',
        language: 'en',
        title: 'Sacred Geometry (Debug)',
        description: 'Fallback collection for debugging - Explore sacred geometric patterns'
      }
    ]
  },
  {
    id: 'fallback-2',
    slug: 'mysteres-anciens-fallback',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_featured: false,
    collection_translations: [
      {
        id: 3,
        collection_id: 'fallback-2',
        language: 'fr',
        title: 'Mystères Anciens (Debug)',
        description: 'Collection de fallback - Découvrez les symboles énigmatiques des civilisations perdues'
      },
      {
        id: 4,
        collection_id: 'fallback-2',
        language: 'en',
        title: 'Ancient Mysteries (Debug)',
        description: 'Fallback collection - Discover enigmatic symbols of lost civilizations'
      }
    ]
  }
];

export const useFallbackCollections = () => {
  const [useFallback, setUseFallback] = useState(false);

  const enableFallback = () => setUseFallback(true);
  const disableFallback = () => setUseFallback(false);

  const fallbackCollections = useFallback ? getFallbackCollections() : [];

  return {
    useFallback,
    fallbackCollections,
    enableFallback,
    disableFallback
  };
};
