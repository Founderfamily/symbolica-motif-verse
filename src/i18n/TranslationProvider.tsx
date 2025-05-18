
import React, { useEffect } from 'react';
import { i18n } from './config';
import { initializeFromLocalFiles } from './services/translationDatabaseService';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  // Initialize translations when component mounts
  useEffect(() => {
    initializeFromLocalFiles()
      .catch(err => console.error('[i18n] init failed', err));
  }, []);

  return (
    <div>{children}</div>
  );
};

export default TranslationProvider;
