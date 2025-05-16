
#!/usr/bin/env node

/**
 * Convert Direct t() Usage to I18nText Components
 * 
 * This utility attempts to automatically convert direct t() calls to I18nText components.
 * It handles both simple and complex cases, including attribute usage.
 * 
 * Usage:
 *   node convert-t-to-i18ntext.js <file_path>
 * 
 * Example:
 *   node convert-t-to-i18ntext.js src/components/MyComponent.tsx
 */

const fs = require('fs');
const path = require('path');

// Check if file path is provided
if (process.argv.length < 3) {
  console.error('Please provide a file path to convert.');
  console.error('Usage: node convert-t-to-i18ntext.js <file_path>');
  process.exit(1);
}

const filePath = process.argv[2];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`File does not exist: ${filePath}`);
  process.exit(1);
}

// Read the file content
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n');

// Regular expressions for finding different patterns of t() calls
const patterns = {
  // Standard t() in JSX: {t('key')}
  directTCallRegex: /\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g,
  
  // t() in attributes: placeholder={t('key')}
  attributeTCallRegex: /(\w+)=\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g,
  
  // t() with parameters: {t('key', { param: value })}
  paramTCallRegex: /\{t\(['"`](.+?)['"`],\s*(\{.+?\})\)\}/g,
  
  // Complex nested t(): {someFunction(t('key'))}
  nestedTCallRegex: /\{[\w.]+\(t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\)\}/g,
  
  // t() in multi-line expressions
  multilineTCallRegex: /\{\s*t\s*\(\s*['"]([\w.-]+)['"]\s*\)\s*\}/g
};

// Check if I18nText is already imported
let hasI18nTextImport = fileContent.includes("I18nText");
let newContent = [...lines];

// Add I18nText import if needed
if (!hasI18nTextImport) {
  // Find the last import statement
  const lastImportIndex = lines.reduce((lastIndex, line, index) => {
    if (line.trim().startsWith('import ')) {
      return index;
    }
    return lastIndex;
  }, -1);
  
  if (lastImportIndex !== -1) {
    // Add import after the last import
    newContent.splice(lastImportIndex + 1, 0, `import { I18nText } from '@/components/ui/i18n-text';`);
  } else {
    // Add at the top if no imports found
    newContent.unshift(`import { I18nText } from '@/components/ui/i18n-text';`);
  }
}

// Track all replacements for reporting
const replacements = [];

// Helper function to extract parameter object from t() call with params
const extractParams = (paramsString) => {
  return paramsString.trim();
};

// Create a mapping of parameter variables that will need to be defined
const parameterDefinitions = new Map();
let paramCounter = 0;

// Apply replacements in a safe order (complex cases first)
// Start from the end to avoid line number issues when making replacements
for (let i = lines.length - 1; i >= 0; i--) {
  let line = newContent[i];
  let modified = false;
  
  // Check if line is inside a comment
  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
    continue;
  }
  
  // CASE 1: Handle t() calls with parameters
  let paramMatch;
  while ((paramMatch = patterns.paramTCallRegex.exec(line)) !== null) {
    const [fullMatch, key, params] = paramMatch;
    const paramVarName = `translationParams${paramCounter++}`;
    
    // Create a variable for the parameters
    const paramDeclaration = `  const ${paramVarName} = ${params};`;
    
    // Find a good place to add the param declaration (before the JSX return)
    let insertLine = i;
    for (let j = i; j >= 0; j--) {
      if (newContent[j].includes('return (') || newContent[j].match(/^\s*<[\w]/)) {
        insertLine = j;
        break;
      }
    }
    
    // Add the parameter declaration
    parameterDefinitions.set(insertLine, paramDeclaration);
    
    // Replace with I18nText using the parameter variable
    const replacement = `<I18nText translationKey="${key}" params={${paramVarName}} />`;
    line = line.replace(fullMatch, replacement);
    modified = true;
    
    replacements.push({
      type: 'param',
      line: i + 1,
      original: fullMatch,
      replacement
    });
  }
  
  // CASE 2: Handle attribute t() calls (more complex)
  let attrMatch;
  while ((attrMatch = patterns.attributeTCallRegex.exec(line)) !== null) {
    const [fullMatch, attribute, key] = attrMatch;
    
    // Create a variable for the translated text
    const varName = `${attribute}Text${paramCounter++}`;
    const paramDeclaration = `  const ${varName} = t("${key}");`;
    
    // Find a good place to add the variable declaration
    let insertLine = i;
    for (let j = i; j >= 0; j--) {
      if (newContent[j].includes('return (') || newContent[j].match(/^\s*<[\w]/)) {
        insertLine = j;
        break;
      }
    }
    
    // Add the variable declaration if not already present
    if (!parameterDefinitions.has(insertLine)) {
      parameterDefinitions.set(insertLine, paramDeclaration);
    } else {
      parameterDefinitions.set(insertLine, parameterDefinitions.get(insertLine) + '\n' + paramDeclaration);
    }
    
    // Replace with the variable
    const replacement = `${attribute}={${varName}}`;
    line = line.replace(fullMatch, replacement);
    modified = true;
    
    replacements.push({
      type: 'attribute',
      line: i + 1,
      original: fullMatch,
      replacement,
      variable: paramDeclaration
    });
  }
  
  // CASE 3: Handle nested t() calls
  let nestedMatch;
  while ((nestedMatch = patterns.nestedTCallRegex.exec(line)) !== null) {
    // Add a comment about manual review needed here
    newContent.splice(i, 0, `{/* TODO: Complex nested t() call detected. Manual review required */}`);
    replacements.push({
      type: 'nested',
      line: i + 1,
      original: nestedMatch[0],
      replacement: 'Manual review required'
    });
  }
  
  // CASE 4: Handle direct t() calls (simplest case)
  line = line.replace(patterns.directTCallRegex, (match, key) => {
    const replacement = `<I18nText translationKey="${key}" />`;
    replacements.push({
      type: 'direct',
      line: i + 1,
      original: match,
      replacement
    });
    modified = true;
    return replacement;
  });
  
  // CASE 5: Handle multiline t() calls
  line = line.replace(patterns.multilineTCallRegex, (match, key) => {
    const replacement = `<I18nText translationKey="${key}" />`;
    replacements.push({
      type: 'multiline',
      line: i + 1,
      original: match,
      replacement
    });
    modified = true;
    return replacement;
  });
  
  // Update the line if modified
  if (modified) {
    newContent[i] = line;
  }
}

// Add all the parameter variables we collected
parameterDefinitions.forEach((declaration, lineIndex) => {
  newContent.splice(lineIndex, 0, declaration);
  
  // Adjust line numbers for replacements that come after this insertion
  replacements.forEach(rep => {
    if (rep.line > lineIndex) {
      rep.line++;
    }
  });
});

// Write the updated content
fs.writeFileSync(filePath, newContent.join('\n'), 'utf-8');

// Report results
console.log(`✅ Conversion completed for ${filePath}`);
console.log(`   Made ${replacements.length} replacements:`);

// Group by type for better reporting
const byType = {
  direct: replacements.filter(r => r.type === 'direct'),
  param: replacements.filter(r => r.type === 'param'),
  attribute: replacements.filter(r => r.type === 'attribute'),
  nested: replacements.filter(r => r.type === 'nested'),
  multiline: replacements.filter(r => r.type === 'multiline')
};

Object.entries(byType).forEach(([type, items]) => {
  if (items.length > 0) {
    console.log(`\n   ${items.length} ${type} replacements:`);
    items.slice(0, 3).forEach(item => {
      console.log(`   - Line ${item.line}: ${item.original} -> ${item.replacement}`);
    });
    
    if (items.length > 3) {
      console.log(`   - ... and ${items.length - 3} more`);
    }
  }
});

if (byType.nested.length > 0) {
  console.log('\n⚠️ WARNING: Complex nested t() calls found that require manual review.');
  console.log('   These are marked with TODO comments in the code.');
}

console.log('\n🔍 Please review the changes carefully and test the application.');
console.log('   Run your validation suite to ensure all translations work correctly.');
