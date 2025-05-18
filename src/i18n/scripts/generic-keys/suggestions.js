
/**
 * Utilities for suggesting better translation keys and generating fixes
 */
const path = require('path');
const fs = require('fs');

/**
 * Generate better key suggestions based on file context
 * 
 * @param {string} genericKey - The generic key that needs replacement
 * @param {string} filePath - File path where the key was found
 * @param {number} lineNumber - Line number in file
 * @returns {string} Suggested key
 */
const suggestBetterKey = (genericKey, filePath, lineNumber) => {
  // Extract component name from file path
  const fileName = path.basename(filePath, path.extname(filePath));
  const fileContent = fs.readFileSync(filePath, 'utf8').split('\n');
  const line = fileContent[lineNumber - 1] || '';
  
  // Try to determine context from file structure
  const pathParts = filePath.split(path.sep);
  const isPagesDir = pathParts.includes('pages');
  const isComponentsDir = pathParts.includes('components');
  const isSectionsDir = pathParts.includes('sections');
  
  let namespace = 'common';
  let section = 'general';
  
  // Extract namespace from directory structure
  if (isPagesDir) {
    namespace = pathParts[pathParts.indexOf('pages') + 1] || 'pages';
    section = fileName.toLowerCase();
  } else if (isComponentsDir) {
    const componentType = pathParts[pathParts.indexOf('components') + 1];
    namespace = componentType || 'components';
    section = fileName.toLowerCase();
  } else if (isSectionsDir) {
    namespace = 'sections';
    section = fileName.toLowerCase();
  }
  
  // Try to infer a better section name from the component context
  // Look for React component or function names near the key
  const componentPattern = /function\s+([A-Z][a-zA-Z0-9]*)|class\s+([A-Z][a-zA-Z0-9]*)|const\s+([A-Z][a-zA-Z0-9]*)\s+=\s+(React\.)?function|const\s+([A-Z][a-zA-Z0-9]*)\s+=\s+\(/g;
  let match;
  let componentName = '';
  
  // Search nearby lines for component names
  const contextRange = 10; // Expanded range to check more lines before the occurrence
  const startLine = Math.max(0, lineNumber - contextRange - 1);
  const contextLines = fileContent.slice(startLine, lineNumber);
  
  const contextContent = contextLines.join('\n');
  while ((match = componentPattern.exec(contextContent)) !== null) {
    // Extract the component name from the matched groups
    componentName = match[1] || match[2] || match[3] || match[5] || '';
  }
  
  if (componentName) {
    // Convert component name to kebab case for section
    section = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  
  // Look for patterns in the line that could give more context
  // Check if the key is inside specific UI elements
  if (line.includes('<Button') || line.includes('button')) {
    section = section + '.buttons';
  } else if (line.includes('<Input') || line.includes('input') || 
            line.includes('placeholder=') || line.includes('label=')) {
    section = section + '.form';
  } else if (line.includes('<h1') || line.includes('<h2') || line.includes('title')) {
    section = section + '.headings';
  } else if (line.includes('error') || line.includes('Error')) {
    section = section + '.errors';
  }
  
  // Convert genericKey to lowercase for consistency
  // Remove any non-alphanumeric characters except dots and hyphens
  const keyPart = genericKey.toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
  
  // Build the suggested key
  return `${namespace}.${section}.${keyPart}`;
};

/**
 * Generate fix suggestions for generic keys
 * 
 * @param {Array} occurrences - List of generic key occurrences
 * @returns {Array} List of fix suggestions
 */
const generateFixSuggestions = (occurrences) => {
  return occurrences.map(occurrence => {
    const { file, line, key, lineNumber } = occurrence;
    
    const suggestedKey = suggestBetterKey(key, file, lineNumber);
    
    return {
      file,
      line,
      lineNumber,
      originalKey: key,
      suggestedKey,
      replacement: line.replace(`"${key}"`, `"${suggestedKey}"`)
    };
  });
};

/**
 * Generate fix code that can be automatically applied
 * 
 * @param {Array} fixes - List of fix suggestions
 * @returns {Object} Map of file paths to fixes
 */
const generateFixCode = (fixes) => {
  const fileChanges = {};
  
  fixes.forEach(fix => {
    if (!fileChanges[fix.file]) {
      fileChanges[fix.file] = {
        path: fix.file,
        changes: []
      };
    }
    
    fileChanges[fix.file].changes.push({
      lineNumber: fix.lineNumber,
      original: fix.line,
      replacement: fix.replacement
    });
  });
  
  return fileChanges;
};

/**
 * Apply fixes to files directly
 * 
 * @param {Array} fixes - List of fix suggestions
 * @returns {Object} Results of the fix operation
 */
const applyFixes = (fixes) => {
  const results = {
    totalFiles: 0,
    totalFixes: fixes.length,
    modifiedFiles: [],
    errors: []
  };
  
  // Group fixes by file
  const fixesByFile = {};
  fixes.forEach(fix => {
    if (!fixesByFile[fix.file]) {
      fixesByFile[fix.file] = [];
    }
    fixesByFile[fix.file].push(fix);
  });
  
  // Apply fixes to each file
  Object.keys(fixesByFile).forEach(filePath => {
    try {
      const fileFixes = fixesByFile[filePath];
      let content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Apply fixes in reverse line order to avoid position shifts
      fileFixes
        .sort((a, b) => b.lineNumber - a.lineNumber)
        .forEach(fix => {
          lines[fix.lineNumber - 1] = fix.replacement;
        });
      
      // Write back the modified content
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      
      results.totalFiles++;
      results.modifiedFiles.push({
        path: filePath,
        fixCount: fileFixes.length,
        keys: fileFixes.map(f => ({ from: f.originalKey, to: f.suggestedKey }))
      });
    } catch (error) {
      results.errors.push({
        file: filePath,
        error: error.message
      });
    }
  });
  
  return results;
};

module.exports = {
  suggestBetterKey,
  generateFixSuggestions,
  generateFixCode,
  applyFixes
};
