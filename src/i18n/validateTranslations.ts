
import { diagnoseTranslations, generateFixReport } from './translationUtils';
import { LegacyValidationReport } from './types/validationTypes';

/**
 * Simple command-line tool to validate translations
 * 
 * Usage: npm run validate-translations
 */
const runValidation = () => {
  console.log('======================================');
  console.log('Translation Validation Tool');
  console.log('======================================\n');
  
  // Use as LegacyValidationReport since this script expects the old format
  const diagnosis = diagnoseTranslations() as LegacyValidationReport;
  
  console.log('DIAGNOSIS RESULTS:');
  console.log('----------------');
  console.log(`Total keys: ${diagnosis.missingKeys.total.en} (EN), ${diagnosis.missingKeys.total.fr} (FR)`);
  
  // Display missing keys
  if (diagnosis.missingKeys.missingInFr.length > 0) {
    console.log(`\n❌ MISSING IN FRENCH (${diagnosis.missingKeys.missingInFr.length} keys):`);
    diagnosis.missingKeys.missingInFr.forEach((key) => {
      console.log(`  • ${key}`);
    });
  } else {
    console.log('\n✅ No keys missing in French!');
  }
  
  if (diagnosis.missingKeys.missingInEn.length > 0) {
    console.log(`\n❌ MISSING IN ENGLISH (${diagnosis.missingKeys.missingInEn.length} keys):`);
    diagnosis.missingKeys.missingInEn.forEach((key) => {
      console.log(`  • ${key}`);
    });
  } else {
    console.log('\n✅ No keys missing in English!');
  }
  
  // Display format issues
  if (diagnosis.formatIssues.length > 0) {
    console.log(`\n⚠️ FORMAT INCONSISTENCIES (${diagnosis.formatIssues.length} keys):`);
    diagnosis.formatIssues.forEach((issue) => {
      console.log(`  • ${issue.key}: ${issue.issue}`);
    });
  } else {
    console.log('\n✅ No format inconsistencies!');
  }
  
  // Summarize results
  console.log('\nSUMMARY:');
  console.log('--------');
  const totalIssues = diagnosis.summary.missingCount + diagnosis.summary.formatIssuesCount;
  
  if (totalIssues === 0) {
    console.log('✅ No translation issues found! Everything looks good.');
  } else {
    console.log(`❌ Found ${totalIssues} translation issues that need attention.`);
    console.log('\nRECOMMENDATION:');
    console.log('1. Add missing translations to both language files');
    console.log('2. Run this validator again to verify fixes');
  }
  
  console.log('\n======================================\n');
  
  return totalIssues === 0;
};

// Run the validation if this file is executed directly
if (require.main === module) {
  const success = runValidation();
  process.exit(success ? 0 : 1); // Exit with error code if issues found
}

export default runValidation;
