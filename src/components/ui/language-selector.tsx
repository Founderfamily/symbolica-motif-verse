
import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';

export const LanguageSelector = () => {
  const { changeLanguage, currentLanguage } = useTranslation();
  
  const toggleLanguage = () => {
    if (currentLanguage.startsWith('fr')) {
      changeLanguage('en');
    } else {
      changeLanguage('fr');
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 px-2 py-1 text-sm"
        onClick={toggleLanguage}
      >
        <Globe className="h-4 w-4" />
        <span>{currentLanguage === 'fr' ? 'FR' : 'EN'}</span>
      </Button>
    </div>
  );
};

export default LanguageSelector;
