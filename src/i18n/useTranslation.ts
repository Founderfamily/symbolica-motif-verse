
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateKeyFormat } from './translationKeyConventions';
import { validateTranslationKey } from './useTranslationValidator';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Wrap the original t function to validate keys in development
  // and ensure we always return a string
  const t = (key: string, options?: any): string => {
    // Validate the key in development
    if (process.env.NODE_ENV === 'development') {
      // Check key format against our conventions
      if (!validateKeyFormat(key)) {
        console.warn(`⚠️ Translation key '${key}' doesn't follow the established format conventions.`);
        console.warn(`   Expected format: namespace.section.element[.qualifier]`);
        console.warn(`   See TRANSLATION_STYLE_GUIDE.md for details.`);
      }
      
      validateTranslationKey(key);
      
      // Enhanced developer experience - warn when a key might be mistyped or missing
      const translated = originalT(key, options);
      if (translated === key) {
        console.warn(`⚠️ Possible missing translation for key: '${key}'`);
        // Detect similar keys that might be typos
        suggestSimilarKeys(key);
        
        // Warn about direct t() usage
        if (new Error().stack?.includes('.tsx') || new Error().stack?.includes('.jsx')) {
          console.warn(`⚠️ IMPORTANT: Direct t() usage detected for '${key}'! Use <I18nText> component instead.`);
          console.warn(`   Replace: {t('${key}')} with: <I18nText translationKey="${key}" />`);
        }
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
    
    // New: Generate statistics about direct t() usage vs I18nText
    generateUsageStatistics();
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
  
  // Check for direct t() usage and suggest using I18nText components instead
  const checkDirectTUsage = () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    console.warn(`⚠️ Direct t() usage detected. Consider using the I18nText component instead.`);
    console.log(`Example: <I18nText translationKey="your.key" /> instead of {t('your.key')}`);
    
    // New: Examine the stack to find the offending component
    try {
      const stack = new Error().stack;
      if (stack) {
        // Extract the filename and line number from the stack trace
        const matches = stack.match(/at\s+([^\s]+)\s+\((.+?):(\d+):(\d+)\)/);
        if (matches && matches.length >= 4) {
          const [, fnName, filename, line, column] = matches;
          console.warn(`   Location: ${filename}:${line}:${column}`);
          console.warn(`   Function: ${fnName}`);
        }
      }
    } catch (e) {
      // Silently fail for this debugging feature
    }
  };
  
  // New: Generate statistics about I18nText usage vs direct t() calls
  const generateUsageStatistics = () => {
    if (process.env.NODE_ENV !== 'development') return;
    
    try {
      console.group('📊 Translation Usage Statistics');
      
      // Count I18nText components
      const i18nTextElements = document.querySelectorAll('[data-i18n-key]');
      console.log(`✅ I18nText components: ${i18nTextElements.length}`);
      
      // Try to detect potential direct t() calls by scanning text nodes
      // This is an approximation and may not catch all cases
      const textNodes = [];
      const walk = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      
      let potentialDirectUsage = 0;
      let node;
      while ((node = walk.nextNode())) {
        const text = node.textContent?.trim();
        if (text && text.includes('.') && !text.includes(' ') && text.length > 3) {
          // This might be a translation key directly used
          if (i18n.exists(text)) {
            potentialDirectUsage++;
          }
        }
      }
      
      if (potentialDirectUsage > 0) {
        console.warn(`⚠️ Potential direct t() usage: ~${potentialDirectUsage} instances`);
      } else {
        console.log('✅ No obvious direct t() usage detected');
      }
      
      console.log('📊 Coverage: ' + 
        Math.round((i18nTextElements.length / (i18nTextElements.length + potentialDirectUsage)) * 100) + 
        '% using I18nText');
        
      console.groupEnd();
    } catch (e) {
      console.error('Error generating translation statistics', e);
    }
  };
  
  return { 
    t, 
    changeLanguage, 
    currentLanguage: i18n.language, 
    i18n,
    validateCurrentPageTranslations,
    highlightAllMissingTranslations,
    checkDirectTUsage,
    // New export
    generateUsageStatistics
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

// Add a script to check for direct t() usage in development
if (process.env.NODE_ENV === 'development') {
  // This is just a simple check when the module loads
  console.info('💡 Translation tips: Use <I18nText translationKey="your.key" /> instead of direct t() calls');
  
  // More sophisticated scanning could be implemented here
}
