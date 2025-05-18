
/**
 * Key suggestion utilities for generic translation keys
 */

/**
 * Suggest better keys based on file path and component context
 */
const suggestBetterKey = (occurrence) => {
  const { file, key, context } = occurrence;
  
  // Extract component name from file path
  const fileMatch = file.match(/\/([^\/]+)\.[jt]sx?$/);
  const componentName = fileMatch ? fileMatch[1].replace(/[A-Z]/g, letter => letter.toLowerCase()) : '';
  
  // Determine section from file path
  let section = '';
  if (file.includes('/components/')) {
    section = file.split('/components/')[1].split('/')[0].toLowerCase();
  } else if (file.includes('/pages/')) {
    section = file.split('/pages/')[1].split('/')[0].toLowerCase();
  } else if (file.includes('/sections/')) {
    section = file.split('/sections/')[1].split('/')[0].toLowerCase();
  }
  
  // Look for parent component in context
  const componentMatch = context.before.match(/function\s+([A-Za-z0-9_]+)/);
  const parentComponent = componentMatch 
    ? componentMatch[1].replace(/[A-Z]/g, letter => `.${letter.toLowerCase()}`).substring(1) 
    : '';
  
  // Build suggested key
  let suggestion = '';
  
  if (section && componentName) {
    suggestion = `${section}.${componentName}.${key.toLowerCase()}`;
  } else if (parentComponent) {
    suggestion = `components.${parentComponent}.${key.toLowerCase()}`;
  } else if (componentName) {
    suggestion = `components.${componentName}.${key.toLowerCase()}`;
  } else {
    suggestion = `ui.${key.toLowerCase()}`;
  }
  
  return suggestion;
};

/**
 * Generate fix code
 */
const generateFixCode = (occurrence, suggestion) => {
  const { content, key } = occurrence;
  
  return content.replace(
    `translationKey="${key}"`, 
    `translationKey="${suggestion}"`
  );
};

module.exports = {
  suggestBetterKey,
  generateFixCode
};
