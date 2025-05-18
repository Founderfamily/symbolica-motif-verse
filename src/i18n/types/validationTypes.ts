
/**
 * Types for translation validation system
 */

export interface FormatIssue {
  key: string;
  en: string;        // English value
  fr: string;        // French value
  issue: string;
  details?: {
    missingInEn: string[];
    missingInFr: string[];
  };
}

export interface ValidationReport {
  valid: boolean;    // Whether all validations passed
  missingKeys: {
    en: string[];    // Keys missing in English
    fr: string[];    // Keys missing in French
  };
  formatIssues: FormatIssue[];
  invalidKeyFormat: string[];  // Keys that don't follow format conventions
}

// Also include the original ValidationReport structure for backward compatibility
export interface LegacyValidationReport {
  missingKeys: {
    missingInFr: string[];
    missingInEn: string[];
    total: {
      en: number;
      fr: number;
    }
  };
  formatIssues: FormatIssue[];
  summary: {
    missingCount: number;
    formatIssuesCount: number;
  };
}
