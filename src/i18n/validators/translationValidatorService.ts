
import { ValidationReport, FormatIssue } from '../types/validationTypes';
import { getFlattenedTranslations } from '../translationUtils';
import { extractPlaceholders, findMissingKeys, findInvalidFormatKeys } from './validatorUtils';
import { findFormatIssues } from './formatIssueValidator';

class TranslationValidatorService {
  /**
   * Validates all translations and returns a comprehensive report
   */
  validateAll(): ValidationReport {
    try {
      const enTranslations = getFlattenedTranslations('en');
      const frTranslations = getFlattenedTranslations('fr');
      
      const missingInFr = findMissingKeys(enTranslations, frTranslations);
      const missingInEn = findMissingKeys(frTranslations, enTranslations);
      const formatIssues = findFormatIssues(enTranslations, frTranslations);
      const invalidFormatKeys = findInvalidFormatKeys({
        en: enTranslations,
        fr: frTranslations
      });
      
      const completionRate = this.calculateCompletionRate(enTranslations, frTranslations);
      
      return {
        missingInFr,
        missingInEn,
        formatIssues,
        invalidFormatKeys,
        completionRate,
        isValid: missingInFr.length === 0 && missingInEn.length === 0 && formatIssues.length === 0,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Translation validation failed:', error);
      return {
        missingInFr: [],
        missingInEn: [],
        formatIssues: [],
        invalidFormatKeys: [],
        completionRate: 0,
        isValid: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Validates a specific language pair
   */
  validateLanguagePair(sourceLang: string, targetLang: string): ValidationReport {
    const sourceTranslations = getFlattenedTranslations(sourceLang);
    const targetTranslations = getFlattenedTranslations(targetLang);
    
    const missingKeys = findMissingKeys(sourceTranslations, targetTranslations);
    const formatIssues = findFormatIssues(sourceTranslations, targetTranslations);
    const completionRate = this.calculateCompletionRate(sourceTranslations, targetTranslations);
    
    return {
      missingInFr: targetLang === 'fr' ? missingKeys : [],
      missingInEn: targetLang === 'en' ? missingKeys : [],
      formatIssues,
      invalidFormatKeys: [],
      completionRate,
      isValid: missingKeys.length === 0 && formatIssues.length === 0,
      timestamp: new Date().toISOString()
    };
  }
  
  /**
   * Calculates completion rate between two translation sets
   */
  private calculateCompletionRate(source: Record<string, string>, target: Record<string, string>): number {
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    const missingCount = sourceKeys.filter(key => !targetKeys.includes(key)).length;
    
    if (sourceKeys.length === 0) return 100;
    
    return Math.round(((sourceKeys.length - missingCount) / sourceKeys.length) * 100);
  }
  
  /**
   * Quick validation check
   */
  isValid(): boolean {
    const report = this.validateAll();
    return report.isValid;
  }
}

const translationValidatorService = new TranslationValidatorService();
export default translationValidatorService;
