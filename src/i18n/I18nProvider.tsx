
import React, { createContext, useContext } from 'react';

interface I18nContextType {
  language: string;
  setLanguage: (lang: string) => void;
}

const I18nContext = createContext<I18nContextType>({
  language: 'fr',
  setLanguage: () => {}
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: React.ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = React.useState('fr');

  return (
    <I18nContext.Provider value={{ language, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};
