
import en from './locales/en.json';
import fr from './locales/fr.json';
import { validateKeyFormat } from './translationKeyConventions';

/**
 * A utility to validate translations across different languages
 */
export const translationValidator = {
  /**
   * Validate all translation keys and report any issues
   */
  validateAll(): ValidationReport {
    const report: ValidationReport = {
      valid: true,
      missingKeys: {
        fr: [],
        en: []
      },
      formatIssues: [],
      invalidKeyFormat: []
    };
    
    // Check if all English keys exist in French
    const missingInFrench = this.findMissingKeys(en, fr);
    if (missingInFrench.length > 0) {
      report.valid = false;
      report.missingKeys.fr = missingInFrench;
    }
    
    // Check if all French keys exist in English
    const missingInEnglish = this.findMissingKeys(fr, en);
    if (missingInEnglish.length > 0) {
      report.valid = false;
      report.missingKeys.en = missingInEnglish;
    }
    
    // Check for format issues (placeholders mismatch, etc)
    const formatIssues = this.findFormatIssues(en, fr);
    if (formatIssues.length > 0) {
      report.valid = false;
      report.formatIssues = formatIssues;
    }
    
    // Check for key format issues
    const invalidFormatKeys = this.findInvalidFormatKeys(en);
    if (invalidFormatKeys.length > 0) {
      // We don't fail validation for key format issues, just report them
      report.invalidKeyFormat = invalidFormatKeys;
    }
    
    return report;
  },
  
  /**
   * Find keys that exist in source but not in target
   */
  findMissingKeys(source: any, target: any, prefix = ''): string[] {
    const missingKeys: string[] = [];
    
    for (const key in source) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Recurse into nested objects
        if (!target[key] || typeof target[key] !== 'object') {
          missingKeys.push(fullKey);
        } else {
          missingKeys.push(...this.findMissingKeys(source[key], target[key], fullKey));
        }
      } else if (!target.hasOwnProperty(key)) {
        missingKeys.push(fullKey);
      }
    }
    
    return missingKeys;
  },
  
  /**
   * Find keys with format mismatches (e.g., different placeholders)
   */
  findFormatIssues(en: any, fr: any, prefix = ''): FormatIssue[] {
    const issues: FormatIssue[] = [];
    
    const checkValue = (enValue: string, frValue: string, key: string) => {
      // Check for placeholder differences
      const enPlaceholders = this.extractPlaceholders(enValue);
      const frPlaceholders = this.extractPlaceholders(frValue);
      
      // Different number of placeholders
      if (enPlaceholders.length !== frPlaceholders.length) {
        issues.push({
          key,
          en: enValue,
          fr: frValue,
          issue: 'placeholderCount'
        });
        return;
      }
      
      // Different placeholder names
      const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
      const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
      if (missingInFr.length > 0 || missingInEn.length > 0) {
        issues.push({
          key,
          en: enValue,
          fr: frValue,
          issue: 'placeholderNames',
          details: {
            missingInFr,
            missingInEn
          }
        });
      }
    };
    
    const compareObjects = (enObj: any, frObj: any, currentPrefix = '') => {
      for (const key in enObj) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        const enValue = enObj[key];
        const frValue = frObj?.[key];
        
        if (!frValue) continue; // Skip already reported missing keys
        
        if (typeof enValue === 'object' && enValue !== null && !Array.isArray(enValue)) {
          // Recurse into nested objects
          compareObjects(enValue, frValue, fullKey);
        } else if (typeof enValue === 'string' && typeof frValue === 'string') {
          // Compare string values
          checkValue(enValue, frValue, fullKey);
        }
      }
    };
    
    compareObjects(en, fr);
    return issues;
  },
  
  /**
   * Extract placeholders like {name} from a string
   */
  extractPlaceholders(text: string): string[] {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
  },
  
  /**
   * Find keys that don't follow the format conventions
   */
  findInvalidFormatKeys(translations: any, prefix = ''): string[] {
    const invalidKeys: string[] = [];
    
    const checkKeys = (obj: any, currentPrefix = '') => {
      for (const key in obj) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          // Check nested objects
          checkKeys(obj[key], fullKey);
        } else if (!validateKeyFormat(fullKey)) {
          invalidKeys.push(fullKey);
        }
      }
    };
    
    checkKeys(translations);
    return invalidKeys;
  },
  
  /**
   * Generate a report of translation issues
   */
  generateReport(): string {
    const report = this.validateAll();
    let output = '# Translation Validation Report\n\n';
    
    if (report.valid && report.invalidKeyFormat.length === 0) {
      output += '✅ All translations are valid and follow conventions!\n';
      return output;
    }
    
    if (!report.valid) {
      output += '❌ Translation validation failed\n\n';
      
      if (report.missingKeys.en.length > 0) {
        output += `## Missing in English (${report.missingKeys.en.length} keys)\n\n`;
        report.missingKeys.en.forEach(key => {
          output += `- \`${key}\`\n`;
        });
        output += '\n';
      }
      
      if (report.missingKeys.fr.length > 0) {
        output += `## Missing in French (${report.missingKeys.fr.length} keys)\n\n`;
        report.missingKeys.fr.forEach(key => {
          output += `- \`${key}\`\n`;
        });
        output += '\n';
      }
      
      if (report.formatIssues.length > 0) {
        output += `## Format Issues (${report.formatIssues.length} keys)\n\n`;
        report.formatIssues.forEach(issue => {
          output += `### \`${issue.key}\`\n`;
          output += `- **English**: \`${issue.en}\`\n`;
          output += `- **French**: \`${issue.fr}\`\n`;
          output += `- **Issue**: ${issue.issue}\n`;
          if (issue.details) {
            if (issue.details.missingInEn.length > 0) {
              output += `  - Missing in English: ${issue.details.missingInEn.join(', ')}\n`;
            }
            if (issue.details.missingInFr.length > 0) {
              output += `  - Missing in French: ${issue.details.missingInFr.join(', ')}\n`;
            }
          }
          output += '\n';
        });
      }
    }
    
    if (report.invalidKeyFormat.length > 0) {
      output += `## Keys Not Following Convention (${report.invalidKeyFormat.length} keys)\n\n`;
      report.invalidKeyFormat.forEach(key => {
        output += `- \`${key}\`\n`;
      });
      output += '\n';
    }
    
    output += '## Recommendations\n\n';
    output += '1. Add missing translations for both languages\n';
    output += '2. Fix format issues by ensuring placeholders match between languages\n';
    output += '3. Update keys to follow the established format convention\n';
    
    return output;
  },
  
  /**
   * Run validation and log results to console
   */
  validateAndLog() {
    const report = this.validateAll();
    const totalIssues = 
      report.missingKeys.en.length + 
      report.missingKeys.fr.length + 
      report.formatIssues.length + 
      report.invalidKeyFormat.length;
    
    console.group(`Translation Validation (${totalIssues} issues found)`);
    
    if (report.missingKeys.en.length > 0) {
      console.warn(`Missing in English (${report.missingKeys.en.length}):`);
      console.table(report.missingKeys.en);
    }
    
    if (report.missingKeys.fr.length > 0) {
      console.warn(`Missing in French (${report.missingKeys.fr.length}):`);
      console.table(report.missingKeys.fr);
    }
    
    if (report.formatIssues.length > 0) {
      console.warn(`Format Issues (${report.formatIssues.length}):`);
      console.table(report.formatIssues.map(i => ({
        key: i.key,
        en: i.en,
        fr: i.fr,
        issue: i.issue
      })));
    }
    
    if (report.invalidKeyFormat.length > 0) {
      console.warn(`Keys Not Following Convention (${report.invalidKeyFormat.length}):`);
      console.table(report.invalidKeyFormat);
    }
    
    console.groupEnd();
    
    return report.valid;
  }
};

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

// Attach to window in development mode for easy debugging
if (process.env.NODE_ENV === 'development') {
  (window as any).translationValidator = translationValidator;
}

export default translationValidator;
