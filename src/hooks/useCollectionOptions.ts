
import { useCollections } from '@/hooks/useCollections';

export const useCollectionOptions = () => {
  const { data: collections, isLoading } = useCollections();

  const culturalOptions = collections?.map(collection => {
    // Get French title from translations
    const frTranslation = collection.collection_translations.find(t => t.language === 'fr');
    return {
      value: frTranslation?.title || collection.slug,
      label: frTranslation?.title || collection.slug
    };
  }).filter(Boolean) || [];

  return {
    culturalOptions,
    isLoading
  };
};
