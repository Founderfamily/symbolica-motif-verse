
import React, { ReactNode } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { keyExistsInBothLanguages } from '@/i18n/translationUtils';

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
 * A simplified component that handles translations with proper fallbacks
 */
export const I18nText = ({
  translationKey,
  params,
  className = '',
  as: Component = 'span',
  children,
  highlightMissing = true
}: I18nTextProps) => {
  const { t, i18n } = useTranslation();
  
  // Get the translated text
  const translatedText = t(translationKey, params);
  const keyExists = i18n.exists(translationKey);
  const isMissing = !keyExists || translatedText === translationKey;
  
  // Check if translation exists in both languages
  const existsInBothLanguages = keyExistsInBothLanguages(translationKey);
  
  // Add visual styling for missing translations in development
  const warningStyle = process.env.NODE_ENV === 'development' && highlightMissing && isMissing
    ? { 
        outline: '1px dashed #ef4444', 
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '0 2px',
        position: 'relative' as const,
      }
    : {};
  
  // In development, add a data attribute to make it easier to inspect
  const devAttributes = process.env.NODE_ENV === 'development' 
    ? { 
        'data-i18n-key': translationKey,
        'data-i18n-missing': isMissing ? 'true' : 'false',
        'data-i18n-exists-both': existsInBothLanguages ? 'true' : 'false'
      } 
    : {};
    
  // Add tooltip for missing translations in development
  const warningTooltip = process.env.NODE_ENV === 'development' && highlightMissing && isMissing
    ? (
        <div 
          className="translation-issue-tooltip"
          style={{
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
            zIndex: 9999,
          }}
        >
          Missing: {translationKey}
        </div>
      )
    : null;
    
  return (
    <Component 
      className={className} 
      style={warningStyle}
      {...devAttributes} 
      onMouseEnter={isMissing ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.translation-issue-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '1';
        }
      } : undefined}
      onMouseLeave={isMissing ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.translation-issue-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '0';
        }
      } : undefined}
    >
      {warningTooltip}
      {/* Use children as fallback if provided and translation is missing */}
      {isMissing && children ? children : translatedText}
    </Component>
  );
};

export default I18nText;
