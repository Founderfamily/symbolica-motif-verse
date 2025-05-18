
import React, { useEffect } from 'react';
import { Globe, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n/useTranslation';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const LanguageSelector = () => {
  const { changeLanguage, currentLanguage, i18n } = useTranslation();
  
  // Log the current language when the component renders
  useEffect(() => {
    console.log(`LanguageSelector rendered with language: ${currentLanguage}`);
  }, [currentLanguage]);
  
  const languages = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];
  
  const currentLanguageDisplay = currentLanguage === 'fr' ? 'FR' : 'EN';
  
  const handleLanguageChange = async (langCode: string) => {
    if (langCode === currentLanguage) {
      console.log(`Language is already set to ${langCode}, no change needed`);
      return;
    }
    
    try {
      console.log(`LanguageSelector: changing language from ${currentLanguage} to ${langCode}`);
      await changeLanguage(langCode);
      toast.success(`Language changed to ${langCode === 'fr' ? 'Français' : 'English'}`);
      console.log(`Language manually changed to: ${langCode}, reloading translations...`);
      
      // Force reload translations to ensure everything is updated
      await i18n.reloadResources();
      console.log(`Translations reloaded for ${langCode}`);
    } catch (error) {
      console.error('Failed to change language:', error);
      toast.error('Failed to change language');
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-sm"
        >
          <Languages className="h-4 w-4" />
          <span data-testid="current-language">{currentLanguageDisplay}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => handleLanguageChange(lang.code)}
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
