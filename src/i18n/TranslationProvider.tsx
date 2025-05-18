
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { toast } from 'sonner';

type TranslationProviderProps = {
  children: ReactNode;
};

/**
 * Global Translation Provider that manages translation state
 * and provides language consistency across the application
 */
export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const { currentLanguage, refreshLanguage } = useTranslation();
  
  // Initialize and maintain language consistency
  useEffect(() => {
    console.log('TranslationProvider: Initializing with language', currentLanguage);
    refreshLanguage();
    
    // Listen for language changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'app_language' && event.newValue) {
        console.log('Language changed in another tab:', event.newValue);
        refreshLanguage();
        toast.info(`Language changed to ${event.newValue === 'fr' ? 'French' : 'English'}`);
      }
    };
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage, refreshLanguage]);
  
  return <>{children}</>;
};

export default TranslationProvider;
