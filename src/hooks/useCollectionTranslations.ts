
import { useTranslation } from '@/i18n/useTranslation';
import { CollectionWithTranslations } from '@/features/collections/types/collections';

export const useCollectionTranslations = () => {
  const { currentLanguage } = useTranslation();

  const getTranslation = (collection: CollectionWithTranslations, field: 'title' | 'description'): string => {
    if (!collection?.collection_translations) {
      return '';
    }

    // Find translation for current language first
    const currentTranslation = collection.collection_translations.find(
      (t) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing or empty, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    return '';
  };

  return { getTranslation };
};
