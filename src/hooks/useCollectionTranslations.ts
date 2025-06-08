
import { useTranslation } from '@/i18n/useTranslation';
import { CollectionWithTranslations } from '@/features/collections/types/collections';

export const useCollectionTranslations = () => {
  const { currentLanguage } = useTranslation();

  const getTranslation = (collection: CollectionWithTranslations, field: 'title' | 'description'): string => {
    console.log(`🌍 [useCollectionTranslations] Getting ${field} for collection ${collection.id} in ${currentLanguage}`);
    
    if (!collection?.collection_translations || collection.collection_translations.length === 0) {
      console.warn(`⚠️ [useCollectionTranslations] Collection ${collection.id} has no translations`);
      return getDefaultValue(collection, field);
    }

    // Chercher la traduction dans la langue courante
    const currentTranslation = collection.collection_translations.find(
      (t) => t.language === currentLanguage
    );
    
    if (currentTranslation?.[field] && currentTranslation[field].trim()) {
      console.log(`✅ [useCollectionTranslations] Found ${field} in ${currentLanguage}`);
      return currentTranslation[field];
    }
    
    // Fallback vers l'autre langue
    const fallbackLang = currentLanguage === 'fr' ? 'en' : 'fr';
    const fallbackTranslation = collection.collection_translations.find(
      (t) => t.language === fallbackLang
    );
    
    if (fallbackTranslation?.[field] && fallbackTranslation[field].trim()) {
      console.log(`✅ [useCollectionTranslations] Found ${field} in fallback ${fallbackLang}`);
      return fallbackTranslation[field];
    }
    
    // Fallback final
    console.warn(`⚠️ [useCollectionTranslations] No translation found, using default for ${field}`);
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
