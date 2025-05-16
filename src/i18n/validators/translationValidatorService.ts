
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import { ValidationReport } from '../types/validationTypes';
import { findMissingKeys, findInvalidFormatKeys } from './validatorUtils';
import { findFormatIssues } from './formatIssueValidator';

/**
 * A utility to validate translations across different languages
 */
export const translationValidatorService = {
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
    const missingInFrench = findMissingKeys(en, fr);
    if (missingInFrench.length > 0) {
      report.valid = false;
      report.missingKeys.fr = missingInFrench;
    }
    
    // Check if all French keys exist in English
    const missingInEnglish = findMissingKeys(fr, en);
    if (missingInEnglish.length > 0) {
      report.valid = false;
      report.missingKeys.en = missingInEnglish;
    }
    
    // Check for format issues (placeholders mismatch, etc)
    const formatIssues = findFormatIssues(en, fr);
    if (formatIssues.length > 0) {
      report.valid = false;
      report.formatIssues = formatIssues;
    }
    
    // Check for key format issues
    const invalidFormatKeys = findInvalidFormatKeys(en);
    if (invalidFormatKeys.length > 0) {
      // We don't fail validation for key format issues, just report them
      report.invalidKeyFormat = invalidFormatKeys;
    }
    
    return report;
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

// Attach to window in development mode for easy debugging
if (process.env.NODE_ENV === 'development') {
  (window as any).translationValidatorService = translationValidatorService;
}

export default translationValidatorService;
