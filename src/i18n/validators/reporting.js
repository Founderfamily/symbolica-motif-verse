
/**
 * Translation validation reporting utilities
 */

const fs = require('fs');

/**
 * Generate a markdown report
 */
const generateReport = (results, data, reportPath) => {
  const { en: flatEn, fr: flatFr } = data;
  
  let report = `# Translation Validation Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  
  // Statistics
  report += `## Statistics\n\n`;
  report += `- Total English keys: ${Object.keys(flatEn).length}\n`;
  report += `- Total French keys: ${Object.keys(flatFr).length}\n`;
  
  const completionRate = Math.round(
    (Object.keys(flatEn).length - results.missingInFr.length) / 
    Object.keys(flatEn).length * 100
  );
  
  report += `- Completion rate: ${completionRate}%\n\n`;
  
  // Missing keys
  if (results.missingInFr.length > 0) {
    report += `## Missing in French (${results.missingInFr.length} keys)\n\n`;
    results.missingInFr.forEach(key => {
      report += `- \`${key}\`: \`${flatEn[key]}\`\n`;
    });
    report += '\n';
  }
  
  if (results.missingInEn.length > 0) {
    report += `## Missing in English (${results.missingInEn.length} keys)\n\n`;
    results.missingInEn.forEach(key => {
      report += `- \`${key}\`: \`${flatFr[key]}\`\n`;
    });
    report += '\n';
  }
  
  // Format issues
  if (results.formatIssues.length > 0) {
    report += `## Format Issues (${results.formatIssues.length} keys)\n\n`;
    results.formatIssues.forEach(issue => {
      report += `### \`${issue.key}\`\n\n`;
      report += `- **English**: \`${issue.en}\`\n`;
      report += `- **French**: \`${issue.fr}\`\n`;
      report += `- **Issue**: ${issue.issue}\n`;
      
      if (issue.details) {
        if (issue.details.missingInEn && issue.details.missingInEn.length > 0) {
          report += `- **Missing in English**: ${issue.details.missingInEn.join(', ')}\n`;
        }
        if (issue.details.missingInFr && issue.details.missingInFr.length > 0) {
          report += `- **Missing in French**: ${issue.details.missingInFr.join(', ')}\n`;
        }
        if (issue.details.enTags) {
          report += `- **EN Tags**: ${issue.details.enTags.join(', ')}\n`;
          report += `- **FR Tags**: ${issue.details.frTags.join(', ')}\n`;
        }
      }
      
      report += '\n';
    });
  }
  
  // Key format issues
  if (results.keyFormatIssues.length > 0) {
    report += `## Key Format Issues (${results.keyFormatIssues.length} keys)\n\n`;
    report += `These keys don't follow the \`namespace.section.element[.qualifier]\` convention:\n\n`;
    results.keyFormatIssues.forEach(key => {
      report += `- \`${key}\`\n`;
    });
    report += '\n';
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  if (results.missingInFr.length > 0 || results.missingInEn.length > 0) {
    report += `- Add the ${results.missingInFr.length + results.missingInEn.length} missing translations\n`;
  }
  
  if (results.formatIssues.length > 0) {
    report += `- Fix the ${results.formatIssues.length} format inconsistencies\n`;
  }
  
  if (results.keyFormatIssues.length > 0) {
    report += `- Update the ${results.keyFormatIssues.length} keys to follow naming conventions\n`;
  }
  
  if (results.fixes && results.fixes.length > 0) {
    report += `\n## Applied Fixes\n\n`;
    results.fixes.forEach(fix => {
      report += `- \`${fix.key}\`: ${fix.action}\n`;
    });
  }
  
  fs.writeFileSync(reportPath, report, 'utf8');
  console.log(`\n📝 Report generated at: ${reportPath}`);
  
  return report;
};

/**
 * Print validation results to console
 */
const printResults = (results) => {
  if (results.missingInFr.length === 0) {
    console.log('✅ All English keys are present in French');
  } else {
    console.log(`❌ ${results.missingInFr.length} English keys are missing in French:`);
    results.missingInFr.slice(0, 10).forEach(key => console.log(` - ${key}`));
    if (results.missingInFr.length > 10) {
      console.log(` - ... and ${results.missingInFr.length - 10} more`);
    }
  }
  
  console.log('');
  
  if (results.missingInEn.length === 0) {
    console.log('✅ All French keys are present in English');
  } else {
    console.log(`❌ ${results.missingInEn.length} French keys are missing in English:`);
    results.missingInEn.slice(0, 10).forEach(key => console.log(` - ${key}`));
    if (results.missingInEn.length > 10) {
      console.log(` - ... and ${results.missingInEn.length - 10} more`);
    }
  }
  
  console.log('');
  
  if (results.formatIssues.length === 0) {
    console.log('✅ All translations have consistent formats');
  } else {
    console.log(`⚠️ ${results.formatIssues.length} keys have format issues between languages:`);
    results.formatIssues.slice(0, 5).forEach(issue => {
      console.log(` - ${issue.key}:`);
      console.log(`   EN: ${issue.en}`);
      console.log(`   FR: ${issue.fr}`);
      console.log(`   Issue: ${issue.issue}`);
      
      if (issue.details) {
        if (issue.details.missingInEn && issue.details.missingInEn.length > 0) {
          console.log(`   Missing in English: ${issue.details.missingInEn.join(', ')}`);
        }
        if (issue.details.missingInFr && issue.details.missingInFr.length > 0) {
          console.log(`   Missing in French: ${issue.details.missingInFr.join(', ')}`);
        }
      }
    });
    
    if (results.formatIssues.length > 5) {
      console.log(` - ... and ${results.formatIssues.length - 5} more format issues`);
    }
  }
  
  console.log('');
  
  if (results.keyFormatIssues.length === 0) {
    console.log('✅ All keys follow the naming convention');
  } else {
    console.log(`⚠️ ${results.keyFormatIssues.length} keys don't follow the naming convention:`);
    results.keyFormatIssues.slice(0, 10).forEach(key => console.log(` - ${key}`));
    if (results.keyFormatIssues.length > 10) {
      console.log(` - ... and ${results.keyFormatIssues.length - 10} more`);
    }
  }
  
  if (results.fixes && results.fixes.length > 0) {
    console.log('\n✅ Applied automatic fixes:');
    results.fixes.forEach(fix => {
      console.log(` - ${fix.key}: ${fix.action}`);
    });
  }
  
  console.log('\n=== Summary ===');
  console.log(`Total English keys: ${results.totalEnKeys}`);
  console.log(`Total French keys: ${results.totalFrKeys}`);
  
  const completionRate = Math.round(
    (results.totalEnKeys - results.missingInFr.length) / 
    results.totalEnKeys * 100
  );
  
  console.log(`Completion rate: ${completionRate}%`);
};

module.exports = {
  generateReport,
  printResults
};
