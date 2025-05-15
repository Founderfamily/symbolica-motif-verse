
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateTranslationKey } from './useTranslationValidator';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Wrap the original t function to validate keys in development
  // and ensure we always return a string
  const t = (key: string, options?: any): string => {
    // Validate the key in development
    if (process.env.NODE_ENV === 'development') {
      validateTranslationKey(key);
      
      // Enhanced developer experience - warn when a key might be mistyped or missing
      const translated = originalT(key, options);
      if (translated === key) {
        console.warn(`⚠️ Possible missing translation for key: '${key}'`);
        // Detect similar keys that might be typos
        suggestSimilarKeys(key);
      }
    }
    
    // Call the original t function and ensure it returns a string
    const translated = originalT(key, options);
    
    // Convert any non-string values to string to avoid type issues
    return typeof translated === 'string' ? translated : String(translated);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  // A helper function to check if we're missing any translations on the current page
  const validateCurrentPageTranslations = () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Translation validation is only available in development mode');
      return;
    }
    
    // Create or toggle the translations panel
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
    
    // Highlight all missing translations on the page
    highlightAllMissingTranslations();
  };
  
  // Scan the current page and highlight all elements with missing translations
  const highlightAllMissingTranslations = () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const elements = document.querySelectorAll('[data-i18n-key]');
    let missingCount = 0;
    
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n-key');
      if (key) {
        const translatedContent = originalT(key);
        if (translatedContent === key) {
          // This is a missing translation
          (el as HTMLElement).style.outline = '2px dashed #ef4444';
          (el as HTMLElement).style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          missingCount++;
        }
      }
    });
    
    if (missingCount > 0) {
      console.warn(`🔎 Found ${missingCount} missing translations on the current page.`);
    } else {
      console.info('✅ No missing translations detected on the current page.');
    }
    
    return missingCount;
  };
  
  return { 
    t, 
    changeLanguage, 
    currentLanguage: i18n.language, 
    i18n,
    validateCurrentPageTranslations,
    highlightAllMissingTranslations
  };
};

/**
 * Helper function to suggest similar keys when a key might be mistyped
 */
const suggestSimilarKeys = (key: string) => {
  try {
    // This would be implemented to search through the translation objects
    // for keys that are similar to the provided key
    // For now, just a placeholder
    const similarKeys: string[] = [];
    
    if (similarKeys.length > 0) {
      console.info('🔍 Similar translation keys found:');
      similarKeys.forEach(similarKey => {
        console.info(`  - ${similarKey}`);
      });
    }
  } catch (error) {
    // Silently fail for suggestion feature
  }
};

// New utility function to make visual debugging easier
export const displayMissingTranslationsOverlay = (show = true) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  if (show) {
    // Create a button to toggle translation validation panel
    const validationButton = document.createElement('button');
    validationButton.textContent = '🔍 Check Translations';
    validationButton.id = 'translation-validation-button';
    validationButton.style.position = 'fixed';
    validationButton.style.bottom = '20px';
    validationButton.style.right = '20px';
    validationButton.style.backgroundColor = '#3b82f6';
    validationButton.style.color = 'white';
    validationButton.style.padding = '8px 12px';
    validationButton.style.borderRadius = '4px';
    validationButton.style.border = 'none';
    validationButton.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    validationButton.style.zIndex = '9999';
    validationButton.style.cursor = 'pointer';
    
    validationButton.addEventListener('click', () => {
      const event = new CustomEvent('validate-translations');
      window.dispatchEvent(event);
    });
    
    document.body.appendChild(validationButton);
  } else {
    // Remove the button
    const validationButton = document.getElementById('translation-validation-button');
    if (validationButton) {
      validationButton.remove();
    }
  }
};

// Auto-enable the display of translation validation button in development
if (process.env.NODE_ENV === 'development') {
  // Wait for DOM to be ready
  if (document.readyState === 'complete') {
    displayMissingTranslationsOverlay();
  } else {
    window.addEventListener('load', () => {
      displayMissingTranslationsOverlay();
    });
  }
}
