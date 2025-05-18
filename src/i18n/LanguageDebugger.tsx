
import React, { useState, useEffect } from 'react';
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { findMissingKeys } from './translationUtils';
import en from './locales/en.json';
import fr from './locales/fr.json';

/**
 * A component that provides a translation debugger panel
 * - Only active in development mode
 * - Shows missing translations and allows switching languages
 */
export const LanguageDebugger = () => {
  const { i18n } = useI18nTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [missingKeys, setMissingKeys] = useState<any>(null);
  
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;
    
    const toggleDebugger = () => {
      setIsOpen(prev => !prev);
    };
    
    // Listen for Ctrl+Alt+T shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === 'KeyT') {
        toggleDebugger();
      }
    };
    
    // Listen for custom event from useTranslation hook
    const handleValidationEvent = () => {
      setIsOpen(true);
      // Call findMissingKeys with the required parameters
      const missingInFr = findMissingKeys(en, fr);
      const missingInEn = findMissingKeys(fr, en);
      
      // Prepare the result in the expected format
      const result = {
        missingInFr,
        missingInEn,
        total: {
          en: countKeys(en),
          fr: countKeys(fr)
        }
      };
      
      setMissingKeys(result);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('validate-translations', handleValidationEvent);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('validate-translations', handleValidationEvent);
    };
  }, []);
  
  // Helper function to count total keys in a translation object
  const countKeys = (obj: any, prefix = ''): number => {
    let count = 0;
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Count keys in nested objects
        count += countKeys(obj[key], fullKey);
      } else {
        count += 1;
      }
    }
    
    return count;
  };
  
  // Don't render in production
  if (process.env.NODE_ENV !== 'development') return null;
  
  if (!isOpen) {
    return (
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 z-50"
        onClick={() => setIsOpen(true)}
      >
        🌐 Debug Translations
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-slate-800 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Translation Debugger</h2>
          <div className="flex gap-2">
            <button 
              className="py-1 px-3 bg-blue-600 rounded hover:bg-blue-700"
              onClick={() => {
                // Call findMissingKeys with the required parameters
                const missingInFr = findMissingKeys(en, fr);
                const missingInEn = findMissingKeys(fr, en);
                
                // Prepare the result in the expected format
                const result = {
                  missingInFr,
                  missingInEn,
                  total: {
                    en: countKeys(en),
                    fr: countKeys(fr)
                  }
                };
                
                setMissingKeys(result);
              }}
            >
              Refresh
            </button>
            <button 
              className="py-1 px-3 bg-red-600 rounded hover:bg-red-700"
              onClick={() => setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Current Language</h3>
            <div className="flex gap-3">
              <button
                className={`px-3 py-1.5 rounded ${i18n.language === 'fr' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => i18n.changeLanguage('fr')}
              >
                🇫🇷 Français
              </button>
              <button
                className={`px-3 py-1.5 rounded ${i18n.language === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => i18n.changeLanguage('en')}
              >
                🇬🇧 English
              </button>
            </div>
          </div>
          
          {missingKeys && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Translation Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-100 p-4 rounded">
                    <p className="text-sm text-slate-600">Total French Keys</p>
                    <p className="text-2xl font-bold">{missingKeys.total.fr}</p>
                  </div>
                  <div className="bg-slate-100 p-4 rounded">
                    <p className="text-sm text-slate-600">Total English Keys</p>
                    <p className="text-2xl font-bold">{missingKeys.total.en}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2 text-amber-600">
                  Missing in French ({missingKeys.missingInFr.length})
                </h3>
                {missingKeys.missingInFr.length > 0 ? (
                  <div className="bg-amber-50 p-3 rounded border border-amber-200 max-h-40 overflow-auto">
                    <ul className="list-disc pl-5 space-y-1">
                      {missingKeys.missingInFr.map((key: string) => (
                        <li key={key} className="text-sm">{key}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-green-600">No missing keys! 🎉</p>
                )}
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2 text-amber-600">
                  Missing in English ({missingKeys.missingInEn.length})
                </h3>
                {missingKeys.missingInEn.length > 0 ? (
                  <div className="bg-amber-50 p-3 rounded border border-amber-200 max-h-40 overflow-auto">
                    <ul className="list-disc pl-5 space-y-1">
                      {missingKeys.missingInEn.map((key: string) => (
                        <li key={key} className="text-sm">{key}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-green-600">No missing keys! 🎉</p>
                )}
              </div>
            </div>
          )}
          
          <div className="border-t mt-6 pt-4">
            <h3 className="text-lg font-medium mb-2">Tips</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
              <li>Press <kbd className="bg-slate-200 px-1 rounded">Ctrl+Alt+L</kbd> to toggle language</li>
              <li>Press <kbd className="bg-slate-200 px-1 rounded">Ctrl+Alt+T</kbd> to show this debugger</li>
              <li>Missing translations are outlined in red on the page</li>
              <li>Check console for detailed warnings about missing keys</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageDebugger;
