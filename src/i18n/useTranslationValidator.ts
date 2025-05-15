
import { useEffect } from 'react';
import i18n from './config';
import en from './locales/en.json';
import fr from './locales/fr.json';

/**
 * A development tool to validate translation keys and detect missing translations.
 * This should be used in the root component of the app during development.
 */
export const useTranslationValidator = () => {
  useEffect(() => {
    // Only run in development environment
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    const validateTranslations = () => {
      // Check if all English keys exist in French translations
      const missingInFrench = findMissingKeys(en, fr, 'en');
      
      // Check if all French keys exist in English translations
      const missingInEnglish = findMissingKeys(fr, en, 'fr');
      
      // Log any issues found
      if (missingInFrench.length > 0 || missingInEnglish.length > 0) {
        console.error('🚨 TRANSLATION VALIDATION FAILED 🚨');
        
        if (missingInFrench.length > 0) {
          console.error('⚠️ Missing French translations:', missingInFrench);
        }
        
        if (missingInEnglish.length > 0) {
          console.error('⚠️ Missing English translations:', missingInEnglish);
        }
        
        console.error('🔎 Please add the missing translation keys to maintain complete localization.');
        
        // Show prominent visual warning in development
        displayVisualWarning(missingInFrench.length + missingInEnglish.length);
      } else {
        console.info('✅ Translation validation passed: All keys are present in both languages.');
      }
    };
    
    validateTranslations();
  }, []);
};

/**
 * Creates a visual warning element in the UI for developers
 */
const displayVisualWarning = (missingCount: number) => {
  const existingWarning = document.getElementById('translation-validation-warning');
  if (existingWarning) {
    existingWarning.remove();
  }
  
  const warningElement = document.createElement('div');
  warningElement.id = 'translation-validation-warning';
  warningElement.style.position = 'fixed';
  warningElement.style.top = '0';
  warningElement.style.left = '0';
  warningElement.style.right = '0';
  warningElement.style.backgroundColor = '#ef4444';
  warningElement.style.color = 'white';
  warningElement.style.padding = '4px 8px';
  warningElement.style.textAlign = 'center';
  warningElement.style.fontWeight = 'bold';
  warningElement.style.fontSize = '14px';
  warningElement.style.zIndex = '9999';
  warningElement.style.cursor = 'pointer';
  warningElement.textContent = `⚠️ Translation issues: ${missingCount} missing key(s). Check console for details.`;
  
  warningElement.addEventListener('click', () => {
    console.log('🔍 Translation validation issues detected. Open your browser console for details.');
    toggleMissingTranslationsPanel();
  });
  
  document.body.appendChild(warningElement);
};

/**
 * Creates or toggles a panel showing missing translations
 */
const toggleMissingTranslationsPanel = () => {
  let panel = document.getElementById('missing-translations-panel');
  
  if (panel) {
    panel.remove();
    return;
  }
  
  panel = document.createElement('div');
  panel.id = 'missing-translations-panel';
  panel.style.position = 'fixed';
  panel.style.top = '30px';
  panel.style.right = '20px';
  panel.style.width = '400px';
  panel.style.maxHeight = '80vh';
  panel.style.overflowY = 'auto';
  panel.style.backgroundColor = 'white';
  panel.style.border = '1px solid #e5e7eb';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
  panel.style.zIndex = '9998';
  panel.style.padding = '16px';
  
  const header = document.createElement('div');
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.marginBottom = '12px';
  
  const title = document.createElement('h3');
  title.textContent = 'Missing Translations';
  title.style.fontWeight = 'bold';
  title.style.fontSize = '16px';
  
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.style.backgroundColor = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => panel!.remove();
  
  header.appendChild(title);
  header.appendChild(closeBtn);
  panel.appendChild(header);
  
  // Scan for actual used translations in the current page
  scanPageForMissingTranslations(panel);
  
  document.body.appendChild(panel);
};

/**
 * Scans the current page DOM for potential translation keys and validates them
 */
const scanPageForMissingTranslations = (container: HTMLElement) => {
  // Find potential translation keys in the page content by looking for text with dots
  // that might represent nested translation objects
  const pageContent = document.body.innerText;
  const potentialKeys = pageContent.match(/[\w]+\.[\w]+(\.\w+)*/g) || [];
  
  const validationResults = document.createElement('div');
  validationResults.className = 'missing-translations-list';
  
  const missingKeys = potentialKeys.filter(key => {
    // Skip obvious non-translation keys
    if (key.startsWith('http') || key.includes('@') || key.match(/\d+\.\d+/)) {
      return false;
    }
    
    return !keyExistsInObject(key, en) || !keyExistsInObject(key, fr);
  });
  
  if (missingKeys.length > 0) {
    const uniqueMissingKeys = [...new Set(missingKeys)];
    
    uniqueMissingKeys.forEach(key => {
      const keyItem = document.createElement('div');
      keyItem.style.padding = '8px';
      keyItem.style.borderBottom = '1px solid #e5e7eb';
      
      const keyName = document.createElement('code');
      keyName.textContent = key;
      keyName.style.fontWeight = 'bold';
      keyName.style.color = '#ef4444';
      
      keyItem.appendChild(keyName);
      
      // Show which languages are missing this key
      const statusEl = document.createElement('div');
      statusEl.style.fontSize = '12px';
      statusEl.style.marginTop = '4px';
      
      const enExists = keyExistsInObject(key, en);
      const frExists = keyExistsInObject(key, fr);
      
      if (!enExists) {
        const enMissing = document.createElement('span');
        enMissing.textContent = '🇬🇧 Missing in EN';
        enMissing.style.color = '#ef4444';
        enMissing.style.marginRight = '8px';
        statusEl.appendChild(enMissing);
      }
      
      if (!frExists) {
        const frMissing = document.createElement('span');
        frMissing.textContent = '🇫🇷 Missing in FR';
        frMissing.style.color = '#ef4444';
        statusEl.appendChild(frMissing);
      }
      
      keyItem.appendChild(statusEl);
      validationResults.appendChild(keyItem);
    });
  } else {
    const noIssuesMsg = document.createElement('div');
    noIssuesMsg.textContent = '✅ No missing translations detected in current page.';
    noIssuesMsg.style.padding = '12px';
    noIssuesMsg.style.color = '#10b981';
    validationResults.appendChild(noIssuesMsg);
  }
  
  container.appendChild(validationResults);
};

/**
 * Recursively finds keys that exist in the source object but not in the target object
 */
const findMissingKeys = (
  source: Record<string, any>, 
  target: Record<string, any>, 
  sourceLanguage: string,
  prefix = ''
): string[] => {
  const missingKeys: string[] = [];
  
  Object.entries(source).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's an object, recurse deeper
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey} (entire section missing)`);
      } else if (typeof target[key] !== 'object') {
        missingKeys.push(`${fullKey} (expected object but found ${typeof target[key]})`);
      } else {
        missingKeys.push(...findMissingKeys(value, target[key], sourceLanguage, fullKey));
      }
    } else {
      // For primitive values, just check if the key exists
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey}`);
      }
    }
  });
  
  return missingKeys;
};

/**
 * Use this hook to check if a specific key exists in both locales
 * @returns boolean indicating if the key exists in both locales
 */
export const validateTranslationKey = (key: string): boolean => {
  const keyExists = {
    en: keyExistsInObject(key, en),
    fr: keyExistsInObject(key, fr)
  };
  
  const isValid = keyExists.en && keyExists.fr;
  
  if (!isValid && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Translation key issue detected: '${key}'`);
    if (!keyExists.en) console.warn(`  - Missing English translation`);
    if (!keyExists.fr) console.warn(`  - Missing French translation`);
    
    // Highlight the element in the UI that's using this missing key
    highlightElementWithMissingTranslation(key);
  }
  
  return isValid;
};

/**
 * Highlights elements in the UI that are using missing translation keys
 */
const highlightElementWithMissingTranslation = (key: string) => {
  // This is a simplified approach - in a real implementation, you would need to
  // find the actual elements using this translation key
  setTimeout(() => {
    // Add visual indicator for elements with the text content that matches part of the key
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
      if (el.textContent?.includes(key.split('.').pop() || '')) {
        const originalBorder = el.style.border;
        const originalBg = el.style.backgroundColor;
        
        el.style.border = '2px dashed #ef4444';
        el.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        // Restore original styling after a short delay
        setTimeout(() => {
          el.style.border = originalBorder;
          el.style.backgroundColor = originalBg;
        }, 2000);
      }
    });
  }, 100);
};

/**
 * Helper to check if a nested key exists in an object
 */
const keyExistsInObject = (path: string, obj: Record<string, any>): boolean => {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return true;
};
