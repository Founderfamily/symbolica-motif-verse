
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
  const { t } = useTranslation();
  
  // Get translation and use fallback only if translation is truly missing
  const translatedText = t(translationKey);
  const text = translatedText === translationKey && fallback 
    ? fallback 
    : translatedText;
  
  return (
    <Component className={className} data-translation-key={translationKey}>
      {text}
    </Component>
  );
};

export default TranslationFallback;
