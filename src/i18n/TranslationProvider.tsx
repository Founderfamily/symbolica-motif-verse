
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
  
  // Initialize i18n if needed and handle language changes
  useEffect(() => {
    // Make sure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init()
        .then(() => {
          console.log('i18n successfully initialized');
          setCurrentLang(i18n.language); // Set initial language
        })
        .catch(err => console.error('i18n initialization error:', err));
    } else {
      setCurrentLang(i18n.language); // Ensure state reflects current language
    }
    
    // Add language toggle shortcut (Ctrl+Alt+L) in development
    if (process.env.NODE_ENV === 'development') {
      const handleLanguageToggle = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
          const currentLang = i18n.language;
          const newLang = currentLang === 'fr' ? 'en' : 'fr';
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
    }
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  // Use key to force complete re-render on language change
  return (
    <I18nextProvider i18n={i18n} key={`i18n-provider-${currentLang}`}>
      {children}
      {process.env.NODE_ENV === 'development' && <LanguageDebugger />}
    </I18nextProvider>
  );
};

export default TranslationProvider;
