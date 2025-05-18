
/**
 * Types for translation validation system
 */

export interface FormatIssue {
  key: string;
  en: string;        // Changed from enValue
  fr: string;        // Changed from frValue
  issue: string;
  details?: {
    missingInEn: string[];
    missingInFr: string[];
  };
}

export interface ValidationReport {
  valid: boolean;    // Added valid property
  missingKeys: {
    en: string[];    // Changed structure to match implementation
    fr: string[];
  };
  formatIssues: FormatIssue[];
  invalidKeyFormat: string[];  // Added invalidKeyFormat property
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
