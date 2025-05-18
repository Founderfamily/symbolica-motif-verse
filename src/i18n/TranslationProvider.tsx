
import React from 'react';
import { i18n } from './config';

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  return (
    <div>{children}</div>
  );
};

export default TranslationProvider;
