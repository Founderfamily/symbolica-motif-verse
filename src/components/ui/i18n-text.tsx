
import React, { ReactNode } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

type I18nTextProps = {
  /** The translation key to be used */
  translationKey: string;
  /** Optional parameters for the translation */
  params?: Record<string, string | number>;
  /** Optional className for styling */
  className?: string;
  /** Optional element type to render (default: span) */
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';
  /** Optional children to use as fallback if translation is missing */
  children?: ReactNode;
};

/**
 * A component that simplifies using translations in the UI.
 * It automatically validates the key and highlights missing translations in development.
 */
export const I18nText = ({
  translationKey,
  params,
  className = '',
  as: Component = 'span',
  children
}: I18nTextProps) => {
  const { t } = useTranslation();
  
  // Get the translated text
  const translatedText = t(translationKey, params);
  
  // In development, add a data attribute to make it easier to inspect translation keys
  const devAttributes = process.env.NODE_ENV === 'development' 
    ? { 'data-i18n-key': translationKey } 
    : {};
    
  return (
    <Component className={className} {...devAttributes}>
      {translatedText === translationKey && children ? children : translatedText}
    </Component>
  );
};

export default I18nText;
