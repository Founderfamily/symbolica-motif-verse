
/**
 * Types for translation validation system
 */

export interface FormatIssue {
  key: string;
  enValue?: string;
  frValue?: string;
  issue: string;
  details?: {
    missingInEn?: string[];
    missingInFr?: string[];
  };
}

export interface ValidationReport {
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
