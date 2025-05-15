
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
  const { t, i18n } = useTranslation();
  const [isMissing, setIsMissing] = useState(false);
  const [isMismatched, setIsMismatched] = useState(false);
  
  // Get the translated text
  const translatedText = t(translationKey, params);
  
  // Check if translation is missing or mismatched between languages
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Check if translation exists for current language
      const keyExists = i18n.exists(translationKey, { lng: i18n.language });
      setIsMissing(!keyExists);
      
      // If key exists, check for format mismatches between languages
      if (keyExists) {
        const currentLang = i18n.language;
        const otherLangs = (i18n.options.supportedLngs || ['fr', 'en']).filter(
          lang => lang !== currentLang && lang !== 'cimode'
        );
        
        // Check all other languages for mismatches
        let mismatchFound = false;
        
        for (const otherLang of otherLangs) {
          if (!i18n.exists(translationKey, { lng: otherLang })) {
            // Translation missing in other language
            mismatchFound = true;
            break;
          }
          
          const otherTranslation = i18n.getFixedT(otherLang)(translationKey);
          
          if (otherTranslation && translatedText) {
            // Check for format mismatches using improved algorithm
            if (!hasSimilarContent(translatedText.toString(), otherTranslation.toString())) {
              mismatchFound = true;
              break;
            }
            
            // Check for placeholder differences (like {name} vs no placeholder)
            const currentPlaceholders = extractPlaceholders(translatedText.toString());
            const otherPlaceholders = extractPlaceholders(otherTranslation.toString());
            
            if (!haveSamePlaceholders(currentPlaceholders, otherPlaceholders)) {
              mismatchFound = true;
              break;
            }
          }
        }
        
        setIsMismatched(mismatchFound);
      }
    }
  }, [translationKey, translatedText, i18n]);
  
  // In development, add a data attribute to make it easier to inspect translation keys
  const devAttributes = process.env.NODE_ENV === 'development' 
    ? { 
        'data-i18n-key': translationKey,
        'data-i18n-missing': isMissing ? 'true' : 'false',
        'data-i18n-mismatched': isMismatched ? 'true' : 'false'
      } 
    : {};
  
  // Add visual styling for missing or mismatched translations in development
  const warningStyle = process.env.NODE_ENV === 'development' && highlightMissing && (isMissing || isMismatched)
    ? { 
        outline: `1px dashed ${isMissing ? '#ef4444' : '#eab308'}`, 
        backgroundColor: isMissing ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
        padding: '0 2px',
        position: 'relative' as const,
      }
    : {};
  
  // Add tooltip for missing/mismatched translations in development
  const warningTooltip = process.env.NODE_ENV === 'development' && highlightMissing && (isMissing || isMismatched)
    ? (
        <div style={{
          position: 'absolute',
          top: '-20px',
          left: '0',
          backgroundColor: isMissing ? '#ef4444' : '#eab308',
          color: 'white',
          fontSize: '10px',
          padding: '2px 4px',
          borderRadius: '3px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.2s',
          zIndex: 9999,
        }} className="translation-issue-tooltip">
          {isMissing ? `Missing: ${translationKey}` : `Format mismatch: ${translationKey}`}
        </div>
      )
    : null;
      
  return (
    <Component 
      className={className} 
      style={warningStyle}
      {...devAttributes} 
      onMouseEnter={(isMissing || isMismatched) ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.translation-issue-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '1';
        }
      } : undefined}
      onMouseLeave={(isMissing || isMismatched) ? (e) => {
        const tooltip = (e.currentTarget as HTMLElement).querySelector('.translation-issue-tooltip');
        if (tooltip) {
          (tooltip as HTMLElement).style.opacity = '0';
        }
      } : undefined}
    >
      {warningTooltip}
      {isMissing && children ? children : translatedText}
    </Component>
  );
};

/**
 * Helper function to check if two translation strings have similar content
 */
const hasSimilarContent = (text1: string, text2: string): boolean => {
  // Normalize texts for comparison (lowercase, remove punctuation)
  const normalize = (text: string) => 
    text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
  
  const normalized1 = normalize(text1);
  const normalized2 = normalize(text2);
  
  // Check if one contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  // Check if they share significant words (more than 50% in common)
  const words1 = normalized1.split(/\s+/).filter(w => w.length > 2); // Only significant words
  const words2 = normalized2.split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return true; // Short strings considered similar
  
  let matchCount = 0;
  words1.forEach(word => {
    if (words2.includes(word)) matchCount++;
  });
  
  // If more than 50% of words match, consider them similar
  return matchCount / Math.max(words1.length, words2.length) > 0.5;
};

/**
 * Extract placeholders like {name} from a string
 */
const extractPlaceholders = (text: string): string[] => {
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches : [];
};

/**
 * Check if two arrays of placeholders have the same elements
 */
const haveSamePlaceholders = (placeholders1: string[], placeholders2: string[]): boolean => {
  if (placeholders1.length !== placeholders2.length) return false;
  
  const sorted1 = [...placeholders1].sort();
  const sorted2 = [...placeholders2].sort();
  
  return sorted1.every((val, idx) => val === sorted2[idx]);
};

export default I18nText;
