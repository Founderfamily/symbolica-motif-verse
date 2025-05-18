
import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './config';
import LanguageDebugger from './LanguageDebugger';

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // State to force re-renders on language change
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [initialized, setInitialized] = useState(i18n.isInitialized);
  
  // Initialize i18n if needed and handle language changes
  useEffect(() => {
    // Make sure i18n is initialized
    if (!i18n.isInitialized) {
      console.log('i18n not initialized, initializing now...');
      i18n.init()
        .then(() => {
          console.log('i18n successfully initialized');
          setCurrentLang(i18n.language); // Set initial language
          setInitialized(true);
        })
        .catch(err => {
          console.error('i18n initialization error:', err);
          setInitialized(true); // Still set as initialized even if there was an error
        });
    } else {
      setCurrentLang(i18n.language); // Ensure state reflects current language
      console.log(`i18n already initialized, current language: ${i18n.language}`);
    }
    
    // Add language toggle shortcut (Ctrl+Alt+L) in development
    if (process.env.NODE_ENV === 'development') {
      const handleLanguageToggle = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
          const currentLang = i18n.language;
          const newLang = currentLang === 'fr' ? 'en' : 'fr';
          console.log(`Language toggle shortcut detected, switching to: ${newLang}`);
          i18n.changeLanguage(newLang).then(() => {
            setCurrentLang(newLang); // Update state to force re-render
            console.log(`Language switched to: ${newLang}`);
          });
        }
      };
      
      document.addEventListener('keydown', handleLanguageToggle);
      return () => document.removeEventListener('keydown', handleLanguageToggle);
    }
    
    // Listen for language changes
    const handleLanguageChanged = (lng: string) => {
      console.log(`Language changed to: ${lng}`);
      setCurrentLang(lng); // Update state to force re-render
    };
    
    i18n.on('languageChanged', handleLanguageChanged);
    
    // Log translation status on mount in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`TranslationProvider mounted. Current language: ${i18n.language}`);
      console.log('Supported languages:', i18n.options.supportedLngs);
      
      // Force a language reload to ensure fresh translations
      i18n.reloadResources().then(() => {
        console.log('Translations reloaded on mount');
      });
    }
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // Prevent rendering before i18n is initialized
  if (!initialized && !i18n.isInitialized) {
    return <div data-testid="i18n-loading">Loading translations...</div>;
  }

  // Use key to force complete re-render on language change
  return (
    <I18nextProvider i18n={i18n} key={`i18n-provider-${currentLang}`}>
      {children}
      {process.env.NODE_ENV === 'development' && <LanguageDebugger />}
    </I18nextProvider>
  );
};

export default TranslationProvider;
