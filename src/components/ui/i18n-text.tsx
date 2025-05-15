
import React, { ReactNode, useState, useEffect } from 'react';
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
  /** Whether to highlight missing translations with visual styling */
  highlightMissing?: boolean;
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
  children,
  highlightMissing = true
}: I18nTextProps) => {
  const { t } = useTranslation();
  const [isMissing, setIsMissing] = useState(false);
  
  // Get the translated text
  const translatedText = t(translationKey, params);
  
  // Check if translation is missing
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setIsMissing(translatedText === translationKey);
    }
  }, [translationKey, translatedText]);
  
  // In development, add a data attribute to make it easier to inspect translation keys
  const devAttributes = process.env.NODE_ENV === 'development' 
    ? { 'data-i18n-key': translationKey } 
    : {};
  
  // Add visual styling for missing translations in development
  const missingStyle = process.env.NODE_ENV === 'development' && isMissing && highlightMissing
    ? { 
        outline: '1px dashed #ef4444', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0 2px',
        position: 'relative' as const,
      }
    : {};
  
  // Add tooltip for missing translations in development
  const missingTooltip = process.env.NODE_ENV === 'development' && isMissing && highlightMissing
    ? (
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '0',
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '10px',
          padding: '2px 4px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
        }} className="missing-key-tooltip">
          Missing: {translationKey}
        </div>
      )
    : null;
      
  return (
    <Component 
      className={className} 
      style={missingStyle}
      {...devAttributes} 
      onMouseEnter={isMissing ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.missing-key-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '1';
        }
      } : undefined}
      onMouseLeave={isMissing ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.missing-key-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '0';
        }
      } : undefined}
    >
      {missingTooltip}
      {isMissing && children ? children : translatedText}
    </Component>
  );
};

export default I18nText;
