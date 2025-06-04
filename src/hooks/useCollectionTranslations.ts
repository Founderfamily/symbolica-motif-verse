
import { useCallback } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { CollectionWithTranslations } from '@/types/collections';

export const useCollectionTranslations = () => {
  const { currentLanguage } = useTranslation();

  const getTranslation = useCallback((collection: CollectionWithTranslations, field: string) => {
    // Guard principal : vérifier que la collection et ses traductions existent
    if (!collection || !collection.collection_translations || !Array.isArray(collection.collection_translations)) {
      // Fallback intelligent basé sur le slug si pas de traductions
      if (field === 'title' && collection?.slug) {
        return collection.slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
      }
      return `[${field} missing]`;
    }

    const translations = collection.collection_translations;

    // Find translation for current language first
    const currentTranslation = translations.find(
      (t: any) => t.language === currentLanguage && t[field]
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      return currentTranslation[field];
    }
    
    // If current language translation is missing, use fallback language
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = translations.find(
      (t: any) => t.language === fallbackLang && t[field]
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      return fallbackTranslation[field];
    }
    
    // Last resort: use any translation available
    const anyTranslation = translations.find(
      (t: any) => t[field] && t[field].trim()
    );
    
    if (anyTranslation?.[field]) {
      return anyTranslation[field];
    }
    
    // Final fallback basé sur le slug pour le titre
    if (field === 'title' && collection.slug) {
      return collection.slug.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase());
    }
    
    return `[${field} missing]`;
  }, [currentLanguage]);

  return { getTranslation };
};
