
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
  }
  
  // Convert genericKey to lowercase for consistency
  const keyPart = genericKey.toLowerCase();
  
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

module.exports = {
  suggestBetterKey,
  generateFixSuggestions,
  generateFixCode
};
