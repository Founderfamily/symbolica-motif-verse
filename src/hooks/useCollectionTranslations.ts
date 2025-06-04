
import { useCallback } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionTranslations = () => {
  const { currentLanguage } = useTranslation();

  const getTranslation = useCallback((collection: CollectionWithTranslations, field: string) => {
    if (!collection.collection_translations || collection.collection_translations.length === 0) {
      return `[${field} missing]`;
    }

    // Find translation for current language first
    const currentTranslation = collection.collection_translations.find(
      (t: any) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing or empty, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t: any) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    // Last resort: use any translation available
    const anyTranslation = collection.collection_translations.find(
      (t: any) => t[field] && t[field].trim()
    );
    
    if (anyTranslation?.[field]) {
      return anyTranslation[field];
    }
    
    return `[${field} missing]`;
  }, [currentLanguage]);

  return { getTranslation };
};
