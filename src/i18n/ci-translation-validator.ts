
/**
 * CI/CD Translation Validation Script
 * 
 * This script is designed to run in CI/CD environments to validate translation keys.
 * It will exit with a non-zero code if issues are found, failing the build.
 */

import translationValidatorService from './validators/translationValidatorService';
import { validateKeyFormat } from './translationKeyConventions';

// Run validation and collect results
const validateForCI = () => {
  console.log('🔍 Running translation validation in CI mode...');
  
  const report = translationValidatorService.validateAll();
  let exitCode = 0;
  
  // Report missing keys (critical issue)
  if (report.missingInEn.length > 0 || report.missingInFr.length > 0) {
    console.error('❌ CRITICAL: Missing translation keys detected');
    
    if (report.missingInEn.length > 0) {
      console.error(`\n🇺🇸 Missing ${report.missingInEn.length} keys in English:`);
      report.missingInEn.forEach(key => console.error(`  - ${key}`));
    }
    
    if (report.missingInFr.length > 0) {
      console.error(`\n🇫🇷 Missing ${report.missingInFr.length} keys in French:`);
      report.missingInFr.forEach(key => console.error(`  - ${key}`));
    }
    
    exitCode = 1;
  }
  
  // Report format issues (critical issue)
  if (report.formatIssues.length > 0) {
    console.error('❌ CRITICAL: Format inconsistencies detected between languages');
    console.error(`\nFound ${report.formatIssues.length} format issues:`);
    
    report.formatIssues.forEach(issue => {
      console.error(`  - Key: ${issue.key}`);
      console.error(`    EN: ${issue.en}`);
      console.error(`    FR: ${issue.fr}`);
      console.error(`    Issue: ${issue.issue}\n`);
    });
    
    exitCode = 1;
  }
  
  // Report key format issues (warning)
  if (report.invalidFormatKeys.length > 0) {
    console.warn('⚠️ WARNING: Keys not following the naming convention');
    console.warn(`\nFound ${report.invalidFormatKeys.length} keys with non-standard format:`);
    report.invalidFormatKeys.forEach(key => console.warn(`  - ${key}`));
    
    // Don't fail the build for format warnings, just report them
    console.warn('\nPlease update these keys to follow the established format convention.');
  }
  
  // Summary
  if (exitCode === 0) {
    console.log('✅ Translation validation passed!');
  } else {
    console.error('❌ Translation validation failed! Please fix the issues before committing.');
  }
  
  return exitCode;
};

// If this script is run directly (not imported)
if (require.main === module) {
  const exitCode = validateForCI();
  process.exit(exitCode);
}

export default validateForCI;
