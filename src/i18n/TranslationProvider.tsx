
import React, { ReactNode, useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { i18n } from './config';
import LanguageDebugger from './LanguageDebugger';

interface TranslationProviderProps {
  children: ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Initialize i18n if needed
  useEffect(() => {
    // Make sure i18n is initialized
    if (!i18n.isInitialized) {
      i18n.init()
        .then(() => console.log('i18n successfully initialized'))
        .catch(err => console.error('i18n initialization error:', err));
    }
    
    // Add language toggle shortcut (Ctrl+Alt+L) in development
    if (process.env.NODE_ENV === 'development') {
      const handleLanguageToggle = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
          const currentLang = i18n.language;
          const newLang = currentLang === 'fr' ? 'en' : 'fr';
          i18n.changeLanguage(newLang);
          console.log(`Language switched to: ${newLang}`);
        }
      };
      
      document.addEventListener('keydown', handleLanguageToggle);
      return () => document.removeEventListener('keydown', handleLanguageToggle);
    }
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
      {process.env.NODE_ENV === 'development' && <LanguageDebugger />}
    </I18nextProvider>
  );
};

export default TranslationProvider;
