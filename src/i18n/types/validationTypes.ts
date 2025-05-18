
/**
 * Types for translation validation
 */
export interface ValidationReport {
  valid: boolean;
  missingKeys: {
    en: string[];
    fr: string[];
  };
  formatIssues: FormatIssue[];
  invalidKeyFormat: string[];
}

export interface FormatIssue {
  key: string;
  en: string;
  fr: string;
  issue: 'placeholderCount' | 'placeholderNames' | 'format';
  details?: {
    missingInEn: string[];
    missingInFr: string[];
  };
}
