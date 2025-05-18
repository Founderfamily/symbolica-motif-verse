
import { diagnoseTranslations, generateFixReport } from './translationUtils';
import { LegacyValidationReport, ValidationReport } from './types/validationTypes';
import { translationDatabaseService } from './services/translationDatabaseService';

/**
 * Simple command-line tool to validate translations
 * 
 * Usage: npm run validate-translations
 */
const runValidation = async () => {
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
  
  // Save validation results to the database
  try {
    await saveValidationResult(diagnosis);
    console.log('✅ Validation results saved to database');
  } catch (error) {
    console.error('❌ Failed to save validation results to database:', error);
  }
  
  return totalIssues === 0;
};

/**
 * Save validation results to the database
 */
async function saveValidationResult(diagnosis: LegacyValidationReport) {
  const validationEntry = {
    valid: diagnosis.summary.missingCount === 0 && diagnosis.summary.formatIssuesCount === 0,
    missing_count_fr: diagnosis.missingKeys.missingInFr.length,
    missing_count_en: diagnosis.missingKeys.missingInEn.length,
    format_issues_count: diagnosis.formatIssues.length,
    invalid_key_format_count: 0, // This is not tracked in LegacyValidationReport
    summary: `${diagnosis.summary.missingCount} missing translations, ${diagnosis.summary.formatIssuesCount} format issues`,
    details: {
      missingInFr: diagnosis.missingKeys.missingInFr,
      missingInEn: diagnosis.missingKeys.missingInEn,
      formatIssues: diagnosis.formatIssues
    }
  };
  
  await translationDatabaseService.saveValidationResult(validationEntry);
}

// Run the validation if this file is executed directly
if (require.main === module) {
  runValidation()
    .then(success => {
      process.exit(success ? 0 : 1); // Exit with error code if issues found
    })
    .catch(error => {
      console.error('Error during validation:', error);
      process.exit(1);
    });
}

export default runValidation;
