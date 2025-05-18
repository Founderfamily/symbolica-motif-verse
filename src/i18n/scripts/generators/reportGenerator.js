
/**
 * Report generation utilities for translations
 */

const fs = require('fs');
const path = require('path');

/**
 * Generate missing translations report
 */
const generateReport = (keysWithContext, allMissingKeys, languages, isDryRun) => {
  const reportPath = path.join(process.cwd(), 'translation-missing-report.md');
  let report = `# Missing Translation Keys Report\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Group missing keys by language
  const byLanguage = {};
  
  languages.forEach(lang => {
    byLanguage[lang] = allMissingKeys[lang] || [];
    
    report += `## Missing in ${lang} (${byLanguage[lang].length} keys)\n\n`;
    
    if (byLanguage[lang].length === 0) {
      report += `No missing keys found. Great job! 🎉\n\n`;
    } else {
      // Create a table
      report += `| Key | File | Line |\n`;
      report += `| --- | ---- | ---- |\n`;
      
      byLanguage[lang].forEach(key => {
        // Find where this key is used
        const usages = keysWithContext.filter(k => k.key === key);
        
        if (usages.length > 0) {
          const usage = usages[0]; // Take the first usage
          const shortFilePath = usage.file.replace(process.cwd(), '');
          report += `| \`${key}\` | ${shortFilePath} | ${usage.line} |\n`;
        } else {
          report += `| \`${key}\` | Unknown | - |\n`;
        }
      });
      
      report += `\n`;
    }
  });
  
  if (isDryRun) {
    console.log(`Would write ${reportPath} (dry run)`);
  } else {
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`✅ Report saved to ${reportPath}`);
  }
};

module.exports = {
  generateReport
};
