
/**
 * Reporting utilities for generic keys
 */

const fs = require('fs');
const { suggestBetterKey, generateFixCode } = require('./suggestions');

/**
 * Generate a detailed report of generic keys
 */
const generateReport = (occurrences) => {
  const reportContent = `
# Generic Translation Keys Report

Generated on: ${new Date().toLocaleString()}

## Summary
- Found ${occurrences.length} generic translation keys across ${Object.keys(groupByFile(occurrences)).length} files

## Recommendations

${Object.entries(groupByFile(occurrences)).map(([file, fileOccurrences]) => {
  const shortPath = file.replace(process.cwd(), '');
  return `### ${shortPath} (${fileOccurrences.length} keys)

${fileOccurrences.map(occurrence => {
  const suggestion = suggestBetterKey(occurrence);
  return `- Line ${occurrence.line}: \`${occurrence.key}\` → \`${suggestion}\`
  - Current: \`${occurrence.context.current}\`
  - Suggested: \`${generateFixCode(occurrence, suggestion)}\`
`;
}).join('\n')}
`;
}).join('\n')}

## Next Steps

1. Replace generic keys with more specific, hierarchical keys
2. Update translation files with new key structure
3. Re-run this tool to verify all generic keys have been replaced
`;

  fs.writeFileSync('generic-keys-report.md', reportContent);
  console.log('\n✅ Generated report at: generic-keys-report.md');
};

/**
 * Group occurrences by file
 */
const groupByFile = (occurrences) => {
  const fileGroups = {};
  
  occurrences.forEach(occurrence => {
    if (!fileGroups[occurrence.file]) {
      fileGroups[occurrence.file] = [];
    }
    fileGroups[occurrence.file].push(occurrence);
  });
  
  return fileGroups;
};

/**
 * Print results to console
 */
const printResults = (occurrences, showDetail) => {
  const fileGroups = groupByFile(occurrences);
  
  console.log('\n📄 Generic keys by file:');
  Object.keys(fileGroups).forEach(file => {
    const shortPath = file.replace(process.cwd(), '');
    console.log(`\n${shortPath} (${fileGroups[file].length} keys):`);
    
    fileGroups[file].forEach(occurrence => {
      const suggestion = suggestBetterKey(occurrence);
      console.log(`- Line ${occurrence.line}: "${occurrence.key}" → "${suggestion}"`);
      
      if (showDetail) {
        console.log(`  Current: ${occurrence.context.current}`);
        console.log(`  Suggested: ${generateFixCode(occurrence, suggestion)}\n`);
      }
    });
  });
};

module.exports = {
  generateReport,
  printResults,
  groupByFile
};
