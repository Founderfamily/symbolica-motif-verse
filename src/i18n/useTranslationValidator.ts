
import { useState, useEffect } from 'react';
import { useTranslation } from './useTranslation';
import { getFlattenedTranslations } from './translationUtils';

export interface ValidationResult {
  missingKeys: string[];
  extraKeys: string[];
  formatIssues: Array<{
    key: string;
    issue: string;
  }>;
}

export const useTranslationValidator = () => {
  const { currentLanguage } = useTranslation();
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    missingKeys: [],
    extraKeys: [],
    formatIssues: []
  });

  useEffect(() => {
    validateTranslations();
  }, [currentLanguage]);

  const validateTranslations = () => {
    try {
      const enTranslations = getFlattenedTranslations('en');
      const frTranslations = getFlattenedTranslations('fr');
      
      const enKeys = Object.keys(enTranslations);
      const frKeys = Object.keys(frTranslations);
      
      const missingKeys = enKeys.filter(key => !frKeys.includes(key));
      const extraKeys = frKeys.filter(key => !enKeys.includes(key));
      
      // Check for format issues (placeholders, etc.)
      const formatIssues: Array<{ key: string; issue: string }> = [];
      
      enKeys.forEach(key => {
        if (frTranslations[key]) {
          const enValue = enTranslations[key];
          const frValue = frTranslations[key];
          
          // Check for placeholder consistency
          const enPlaceholders = (enValue.match(/\{[^}]+\}/g) || []);
          const frPlaceholders = (frValue.match(/\{[^}]+\}/g) || []);
          
          if (enPlaceholders.length !== frPlaceholders.length) {
            formatIssues.push({
              key,
              issue: `Placeholder mismatch: EN has ${enPlaceholders.length}, FR has ${frPlaceholders.length}`
            });
          }
        }
      });
      
      setValidationResult({
        missingKeys,
        extraKeys,
        formatIssues
      });
    } catch (error) {
      console.error('Translation validation error:', error);
    }
  };

  return {
    validationResult,
    validateTranslations,
    isValid: validationResult.missingKeys.length === 0 && 
             validationResult.extraKeys.length === 0 && 
             validationResult.formatIssues.length === 0
  };
};
