
import React, { useState, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { Languages, Bug, RefreshCw, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageDebugger = () => {
  const { currentLanguage, changeLanguage, validateCurrentPageTranslations, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<{total: number, missing: string[], complete: number}>({
    total: 0,
    missing: [],
    complete: 0
  });
  const [objectTranslations, setObjectTranslations] = useState<string[]>([]);

  // Run validation when opening the debugger
  useEffect(() => {
    if (isOpen) {
      runValidation();
    }
  }, [isOpen]);

  // Check for object translations in the current page
  const findObjectTranslations = () => {
    const result: string[] = [];
    
    // Try accessing some known translation keys
    const commonKeys = ['symbolTriptych', 'triptych', 'symbolDetail'];
    
    commonKeys.forEach(baseKey => {
      try {
        const value = i18n.t(baseKey, { returnObjects: true });
        if (typeof value === 'object' && value !== null) {
          console.log(`Found object translation for key: ${baseKey}`, value);
          result.push(baseKey);
        }
      } catch (e) {
        // Ignore errors
      }
    });
    
    setObjectTranslations(result);
    return result;
  };

  const toggleLanguage = async () => {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
    await changeLanguage(newLang);
    console.log(`Language switched to: ${newLang}`);
    // Force reload the page to ensure all components re-render properly
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const runValidation = () => {
    const results = validateCurrentPageTranslations();
    setStats(results);
    findObjectTranslations();
    console.log('Translation validation results:', results);
  };

  const forceReloadTranslations = async () => {
    await i18n.reloadResources();
    console.log(`Translations reloaded for language: ${currentLanguage}`);
    runValidation();
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200 w-80">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">🌐 Language Debug</h3>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
          </div>
          
          <div className="mb-4 bg-slate-50 p-2 rounded border border-slate-200">
            <span className="text-sm font-medium block mb-2">Current language:</span>
            <div className="flex items-center space-x-2">
              <Badge>{currentLanguage}</Badge>
              <Button size="sm" onClick={toggleLanguage}>
                <Languages className="h-3 w-3 mr-1" />
                Switch to {currentLanguage === 'fr' ? 'EN' : 'FR'}
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <Button size="sm" onClick={runValidation} className="flex-1">
              <Bug className="h-3 w-3 mr-1" />
              Check translations
            </Button>
            <Button size="sm" onClick={forceReloadTranslations} className="flex-1">
              <RefreshCw className="h-3 w-3 mr-1" />
              Reload translations
            </Button>
          </div>
          
          {/* Object translations detection */}
          <div className="mb-4 bg-amber-50 p-2 rounded border border-amber-200 text-xs">
            <div className="font-medium mb-1">Object translations:</div>
            {objectTranslations.length > 0 ? (
              <ul className="list-disc pl-4">
                {objectTranslations.map((key) => (
                  <li key={key}>{key}</li>
                ))}
              </ul>
            ) : (
              <span className="text-green-600 flex items-center">
                <Check className="h-3 w-3 mr-1" /> No object translations found
              </span>
            )}
          </div>
          
          {stats.total > 0 && (
            <div className="mt-2 text-xs">
              <div className="flex justify-between">
                <span>Total elements:</span>
                <span>{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Complete:</span>
                <span className="text-green-500">{stats.complete}</span>
              </div>
              <div className="flex justify-between">
                <span>Missing:</span>
                <span className={stats.missing.length > 0 ? "text-red-500" : "text-green-500"}>
                  {stats.missing.length}
                </span>
              </div>
              
              {stats.missing.length > 0 && (
                <details className="mt-1">
                  <summary className="cursor-pointer">Show missing keys</summary>
                  <div className="mt-1 max-h-40 overflow-y-auto bg-gray-50 p-1 rounded text-xs">
                    {stats.missing.map((key, idx) => (
                      <div key={idx} className="text-red-500">{key}</div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
      ) : (
        <Button 
          size="sm" 
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-white shadow-md border border-gray-200 text-gray-700 hover:bg-gray-100"
        >
          <Languages className="h-4 w-4 mr-1" />
          Debug Translations
        </Button>
      )}
    </div>
  );
};

// Simple Badge component
const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full font-medium">
    {children}
  </span>
);

export default LanguageDebugger;
