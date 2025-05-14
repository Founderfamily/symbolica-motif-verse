
import React from 'react';
import { Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export const LanguageSelector = () => {
  const { changeLanguage, currentLanguage } = useTranslation();
  
  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];
  
  const currentLanguageDisplay = currentLanguage === 'fr' ? 'FR' : 'EN';
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-sm"
        >
          <Languages className="h-4 w-4" />
          <span>{currentLanguageDisplay}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
            className={currentLanguage === lang.code ? "bg-slate-100" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
