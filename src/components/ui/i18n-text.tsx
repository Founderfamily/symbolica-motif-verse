
import React, { ReactNode } from 'react';
import { useTranslation } from '@/i18n/useTranslation';

type I18nTextProps = {
  translationKey: string;
  params?: Record<string, string | number>;
  values?: Record<string, string | number>;
  className?: string;
  as?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'label';
  children?: ReactNode;
};

export const I18nText = ({
  translationKey,
  params,
  values,
  className = '',
  as: Component = 'span',
  children
}: I18nTextProps) => {
  const { t } = useTranslation();
  
  const translationParams = values || params;
  const translatedText = t(translationKey, translationParams);
  
  // Use children as fallback if provided and translation appears to be missing
  const isMissing = translatedText === translationKey;
  const displayText = isMissing && children ? children : translatedText;
  
  return (
    <Component className={className}>
      {displayText}
    </Component>
  );
};

export default I18nText;
