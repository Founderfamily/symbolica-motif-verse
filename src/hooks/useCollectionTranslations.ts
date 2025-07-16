
import { useTranslation } from '@/i18n/useTranslation';
import { CollectionWithTranslations } from '@/features/collections/types/collections';

export const useCollectionTranslations = () => {
  const { currentLanguage } = useTranslation();

  const getTranslation = (collection: CollectionWithTranslations, field: 'title' | 'description'): string => {
    if (!collection?.collection_translations || collection.collection_translations.length === 0) {
      return getDefaultValue(collection, field);
    }

    // Chercher la traduction dans la langue courante
    const currentTranslation = collection.collection_translations.find(
      (t) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // Fallback vers l'autre langue
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    // Fallback final
    return getDefaultValue(collection, field);
  };

  const getDefaultValue = (collection: CollectionWithTranslations, field: 'title' | 'description'): string => {
    if (field === 'title') {
      return collection.slug?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Collection sans titre';
    }
    return 'Description non disponible';
  };

  return { getTranslation };
};
