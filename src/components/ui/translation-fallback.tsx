
import React from 'react';
import { useTranslation } from '@/i18n/useTranslation';

interface TranslationFallbackProps {
  translationKey: string;
  fallback?: string;
  className?: string;
  as?: 'span' | 'div' | 'p' | 'h1' | 'h2' | 'h3';
}

export const TranslationFallback = ({ 
  translationKey, 
  fallback, 
  className = '', 
  as: Component = 'span' 
}: TranslationFallbackProps) => {
  const { t, currentLanguage } = useTranslation();
  
  // Utiliser la traduction avec fallback personnalisé si fourni
  const text = t(translationKey) === translationKey && fallback 
    ? fallback 
    : t(translationKey);
  
  return (
    <Component className={className} data-translation-key={translationKey}>
      {text}
    </Component>
  );
};

export default TranslationFallback;
