
import React, { ReactNode, useState } from 'react';
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
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Get the translated text
  const translatedText = t(translationKey, params);
  const keyExists = i18n.exists(translationKey);
  const isMissing = !keyExists || translatedText === translationKey;
  
  // Check if translation exists in both languages
  const existsInBothLanguages = keyExistsInBothLanguages(translationKey);
  
  // Add visual styling for missing translations in development
  const warningStyle = process.env.NODE_ENV === 'development' && highlightMissing && isMissing
    ? { 
        outline: '2px dashed #ef4444', 
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        padding: '0 4px',
        position: 'relative' as const,
        cursor: 'help',
        borderRadius: '2px'
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
            top: '-28px',
            left: '0',
            backgroundColor: '#ef4444',
            color: 'white',
            fontSize: '11px',
            padding: '2px 5px',
            borderRadius: '3px',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: showTooltip ? 1 : 0,
            transition: 'opacity 0.2s',
            zIndex: 9999,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            fontWeight: 'bold'
          }}
        >
          {!existsInBothLanguages ? 'Missing translation:' : 'Possibly incorrect:'} {translationKey}
        </div>
      )
    : null;
    
  // Add indicator for language that's missing translation
  const missingLanguageIndicator = process.env.NODE_ENV === 'development' && highlightMissing && isMissing && !existsInBothLanguages
    ? (
        <span 
          style={{
            fontSize: '9px',
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0px 2px',
            borderRadius: '2px',
            position: 'absolute',
            top: '-7px',
            right: '-7px',
            lineHeight: '1.2',
            fontWeight: 'bold'
          }}
        >
          {i18n.exists(translationKey, { lng: 'en' }) ? 'FR' : 
           i18n.exists(translationKey, { lng: 'fr' }) ? 'EN' : 'ALL'}
        </span>
      )
    : null;
    
  // In production, provide best experience with fallback
  const displayText = isMissing && children 
    ? children 
    : (isMissing && process.env.NODE_ENV === 'production' 
        ? translationKey.split('.').pop()?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) 
        : translatedText);
    
  return (
    <Component 
      className={className} 
      style={warningStyle}
      {...devAttributes} 
      onMouseEnter={isMissing ? () => setShowTooltip(true) : undefined}
      onMouseLeave={isMissing ? () => setShowTooltip(false) : undefined}
    >
      {warningTooltip}
      {missingLanguageIndicator}
      {displayText}
    </Component>
  );
};

export default I18nText;
