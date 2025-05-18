
/**
 * Generic Translation Key Finder
 */

const fs = require('fs');
const glob = require('glob');

/**
 * Find all occurrences of translationKey="..." with generic keys
 */
const findGenericKeyUsage = (genericKeys = []) => {
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { nodir: true });
  const results = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      // Check for translationKey="..." pattern
      const matches = line.match(/translationKey=["']([^"']+)["']/g);
      
      if (matches) {
        for (const match of matches) {
          // Extract the key value
          const keyMatch = match.match(/translationKey=["']([^"']+)["']/);
          const key = keyMatch ? keyMatch[1] : null;
          
          if (key && genericKeys.some(genericKey => {
            // Check exact match or if it's a short key without hierarchy
            return key === genericKey || (key.indexOf('.') === -1 && key.toLowerCase() === genericKey.toLowerCase());
          })) {
            results.push({
              file,
              line: lineIndex + 1, // 1-based line number
              key,
              content: line.trim(),
              context: {
                before: lines[lineIndex - 1]?.trim() || '',
                current: line.trim(),
                after: lines[lineIndex + 1]?.trim() || ''
              }
            });
          }
        }
      }
    });
  });
  
  return results;
};

module.exports = {
  findGenericKeyUsage
};
