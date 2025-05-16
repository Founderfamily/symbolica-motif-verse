
#!/usr/bin/env node

/**
 * Comprehensive Translation Validation Utility
 * 
 * This script performs thorough validation of translation files:
 * - Missing keys between languages
 * - Format inconsistencies (placeholders, HTML tags)
 * - Structure consistency
 * - Key naming convention compliance
 * 
 * Usage:
 *   node check-translation-completeness.js [--fix] [--report=file.md]
 * 
 * Options:
 *   --fix       Attempt to automatically fix simple issues
 *   --report    Generate a markdown report file
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const reportArg = args.find(arg => arg.startsWith('--report='));
const reportPath = reportArg ? reportArg.split('=')[1] : null;

// Load translation files
const loadTranslations = () => {
  try {
    const enPath = path.join(__dirname, 'locales/en.json');
    const frPath = path.join(__dirname, 'locales/fr.json');
    
    if (!fs.existsSync(enPath) || !fs.existsSync(frPath)) {
      console.error('❌ Translation files not found. Expected at:');
      console.error(`   - ${enPath}`);
      console.error(`   - ${frPath}`);
      process.exit(1);
    }
    
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    
    return { en, fr };
  } catch (error) {
    console.error('❌ Error loading translation files:', error.message);
    process.exit(1);
  }
};

// Validate key naming convention
const validateKeyFormat = (key) => {
  // Keys should follow: namespace.section.element[.qualifier]
  const keyPattern = /^[a-z0-9]+(\.[a-z0-9]+){2,4}$/;
  return keyPattern.test(key);
};

// Flatten the nested structure of a translation file
const flattenTranslations = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
};

// Extract placeholders like {name} from a string
const extractPlaceholders = (text) => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches : [];
};

// Check HTML tags consistency
const extractHtmlTags = (text) => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/<[^>]+>/g);
  return matches ? matches : [];
};

// Main validation function
const validateTranslations = () => {
  console.log('=== Translation Validation ===\n');
  
  const { en, fr } = loadTranslations();
  const flatEn = flattenTranslations(en);
  const flatFr = flattenTranslations(fr);
  
  // Results collections
  const results = {
    missingInFr: [],
    missingInEn: [],
    formatIssues: [],
    keyFormatIssues: [],
    fixes: []
  };
  
  // 1. Find keys missing in each language
  results.missingInFr = Object.keys(flatEn).filter(key => !flatFr[key]);
  results.missingInEn = Object.keys(flatFr).filter(key => !flatEn[key]);
  
  // 2. Find format inconsistencies (placeholders, HTML)
  Object.keys(flatEn).forEach(key => {
    if (!flatFr[key]) return; // Skip already reported missing keys
    
    const enVal = flatEn[key];
    const frVal = flatFr[key];
    
    // Check placeholder consistency
    const enPlaceholders = extractPlaceholders(enVal);
    const frPlaceholders = extractPlaceholders(frVal);
    
    // Check for missing placeholders
    const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
    const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
    
    if (missingInFr.length > 0 || missingInEn.length > 0) {
      results.formatIssues.push({
        key,
        en: enVal,
        fr: frVal,
        issue: 'placeholders',
        details: { missingInFr, missingInEn }
      });
    }
    
    // Check HTML tag consistency
    const enTags = extractHtmlTags(enVal);
    const frTags = extractHtmlTags(frVal);
    
    if (enTags.length !== frTags.length) {
      results.formatIssues.push({
        key,
        en: enVal,
        fr: frVal,
        issue: 'htmlTags',
        details: { enTags, frTags }
      });
    }
  });
  
  // 3. Check key naming convention
  const allKeys = [...new Set([...Object.keys(flatEn), ...Object.keys(flatFr)])];
  results.keyFormatIssues = allKeys.filter(key => !validateKeyFormat(key));
  
  // Auto fix if requested
  if (shouldFix) {
    // Fix missing translations with placeholders
    results.missingInFr.forEach(key => {
      const enValue = flatEn[key];
      const placeholderValue = typeof enValue === 'string' 
        ? `[FR] ${enValue}` 
        : enValue;
      
      // Update the fr object (need to handle nested paths)
      const parts = key.split('.');
      let current = fr;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      current[parts[parts.length - 1]] = placeholderValue;
      results.fixes.push({ key, action: 'Added missing French translation' });
    });
    
    results.missingInEn.forEach(key => {
      const frValue = flatFr[key];
      const placeholderValue = typeof frValue === 'string' 
        ? `[EN] ${frValue}` 
        : frValue;
      
      // Update the en object
      const parts = key.split('.');
      let current = en;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      
      current[parts[parts.length - 1]] = placeholderValue;
      results.fixes.push({ key, action: 'Added missing English translation' });
    });
    
    // Write back the fixed files
    fs.writeFileSync(
      path.join(__dirname, 'locales/en.json'), 
      JSON.stringify(en, null, 2), 
      'utf8'
    );
    
    fs.writeFileSync(
      path.join(__dirname, 'locales/fr.json'), 
      JSON.stringify(fr, null, 2), 
      'utf8'
    );
  }
  
  // Print results
  const printResults = () => {
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
    
    if (shouldFix && results.fixes.length > 0) {
      console.log('\n✅ Applied automatic fixes:');
      results.fixes.forEach(fix => {
        console.log(` - ${fix.key}: ${fix.action}`);
      });
    }
    
    console.log('\n=== Summary ===');
    console.log(`Total English keys: ${Object.keys(flatEn).length}`);
    console.log(`Total French keys: ${Object.keys(flatFr).length}`);
    
    const completionRate = Math.round(
      (Object.keys(flatEn).length - results.missingInFr.length) / 
      Object.keys(flatEn).length * 100
    );
    
    console.log(`Completion rate: ${completionRate}%`);
    
    // Generate markdown report if requested
    if (reportPath) {
      const report = generateReport(results, { en: flatEn, fr: flatFr });
      fs.writeFileSync(reportPath, report, 'utf8');
      console.log(`\n📝 Report generated at: ${reportPath}`);
    }
  };
  
  printResults();
  
  // Return exit code for CI usage
  const hasErrors = results.missingInFr.length > 0 || results.missingInEn.length > 0;
  
  return {
    exitCode: hasErrors ? 1 : 0,
    results
  };
};

// Generate a markdown report
const generateReport = (results, data) => {
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
  
  if (shouldFix && results.fixes.length > 0) {
    report += `\n## Applied Fixes\n\n`;
    results.fixes.forEach(fix => {
      report += `- \`${fix.key}\`: ${fix.action}\n`;
    });
  }
  
  return report;
};

// Run validation
const { exitCode } = validateTranslations();

// Exit with appropriate code for CI integration
if (!module.parent) {
  process.exit(exitCode);
}
