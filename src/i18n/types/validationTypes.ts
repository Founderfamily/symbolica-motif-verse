
/**
 * Types for translation validation
 */
export interface ValidationReport {
  isValid: boolean;
  missingInFr: string[];
  missingInEn: string[];
  formatIssues: FormatIssue[];
  invalidFormatKeys: string[];
  completionRate: number;
  timestamp: string;
  error?: string;
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
