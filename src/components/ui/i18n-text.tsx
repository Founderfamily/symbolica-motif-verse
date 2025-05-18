
import React, { ReactNode, useState, useMemo } from 'react';
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
  const { t, i18n, currentLanguage } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Get the translated text with memoization based on key, params and language
  const translatedText = useMemo(() => {
    try {
      return t(translationKey, params);
    } catch (error) {
      console.error(`Error translating key: ${translationKey}`, error);
      return translationKey;
    }
  }, [t, translationKey, params, currentLanguage]);
  
  const keyExists = i18n.exists(translationKey);
  
  // Consider key missing if it doesn't exist or if the translation is the same as the key
  // (which happens for generic keys like "Title", "Description" etc.)
  const isGenericKey = ['title', 'description', 'subtitle', 'name', 'button', 'text', 'label', 'header', 'content'].includes(
    translationKey.toLowerCase()
  );
  
  // Check if translation result is the same as the key (fallback behavior)
  // or if we're dealing with a known generic key
  const isMissing = !keyExists || translatedText === translationKey || isGenericKey;
  
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
        'data-i18n-lang': currentLanguage
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
          {isGenericKey ? 'Generic key:' : 'Missing translation:'} {translationKey}
        </div>
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
      {displayText}
    </Component>
  );
};

export default I18nText;
