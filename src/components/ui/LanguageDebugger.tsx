
import React, { useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Button } from './button';
import { Languages, RefreshCw, Bug } from 'lucide-react';

const LanguageDebugger = () => {
  const { currentLanguage, changeLanguage, validateCurrentPageTranslations } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<{total: number, missing: string[], complete: number}>({
    total: 0,
    missing: [],
    complete: 0
  });

  const toggleLanguage = async () => {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
    await changeLanguage(newLang);
    console.log(`Language switched to: ${newLang}`);
  };

  const runValidation = () => {
    const results = validateCurrentPageTranslations();
    setStats(results);
    console.log('Translation validation results:', results);
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
          
          <div className="mb-2">
            <span className="text-sm font-medium block mb-1">Current language:</span>
            <div className="flex items-center space-x-2">
              <Badge>{currentLanguage}</Badge>
              <Button size="sm" onClick={toggleLanguage}>
                <Languages className="h-3 w-3 mr-1" />
                Switch to {currentLanguage === 'fr' ? 'EN' : 'FR'}
              </Button>
            </div>
          </div>
          
          <Button size="sm" onClick={runValidation} className="mb-2 w-full">
            <Bug className="h-3 w-3 mr-1" />
            Check translations
          </Button>
          
          {stats.total > 0 && (
            <div className="mt-2 text-xs">
              <div className="flex justify-between">
                <span>Total elements:</span>
                <span>{stats.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Complete:</span>
                <span>{stats.complete}</span>
              </div>
              <div className="flex justify-between">
                <span>Missing:</span>
                <span className="text-red-500">{stats.missing.length}</span>
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
