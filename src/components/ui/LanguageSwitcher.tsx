
import React from 'react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { I18nText } from '@/components/ui/i18n-text';

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = currentLanguage === 'fr' ? 'en' : 'fr';
    changeLanguage(newLang);
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="text-xs px-2 py-1 h-auto"
    >
      {currentLanguage === 'fr' ? 'EN' : 'FR'}
    </Button>
  );
};

export default LanguageSwitcher;
