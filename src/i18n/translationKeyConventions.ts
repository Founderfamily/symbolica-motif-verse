
/**
 * Translation Key Conventions
 * 
 * This file documents the conventions for translation keys in the project.
 * These conventions ensure consistency across the application and make it easier
 * to find and manage translations.
 */

/**
 * Key Structure Format:
 * 
 * Keys should follow the format: `namespace.section.element.qualifier`
 * 
 * Examples:
 * - map.labels.culture
 * - faq.questions.general.what
 * - profile.buttons.save
 * - auth.errors.invalidEmail
 */

/**
 * Namespaces
 * Top-level organization of keys into functional areas of the application.
 * Common namespaces include:
 */
export const namespaces = [
  'app',       // App-wide elements like app name, tagline
  'auth',      // Authentication related 
  'map',       // Map explorer related
  'faq',       // FAQ sections and pages
  'profile',   // User profile related
  'symbols',   // Symbol-related content
  'footer',    // Footer sections
  'header',    // Header and navigation
  'explore',   // Exploration sections
  'about',     // About page and sections
  'common',    // Common UI elements
  'errors',    // Error messages
  'gamification', // Points, achievements, etc.
] as const;

/**
 * Sections
 * Second-level organization within a namespace.
 * Common sections include:
 */
export const commonSections = [
  'labels',     // Text labels for UI elements
  'buttons',    // Button text
  'titles',     // Page or section titles
  'subtitles',  // Page or section subtitles
  'placeholders', // Input placeholders
  'errors',     // Error messages
  'success',    // Success messages
  'tooltips',   // Tooltip text
  'badges',     // Badge text
  'questions',  // For FAQ questions
  'answers',    // For FAQ answers
  'filters',    // Filter options
  'sections',   // Page sections
] as const;

/**
 * Elements
 * Third-level specification of what element the key refers to.
 * Examples: save, cancel, submit, email, password, etc.
 */

/**
 * Qualifiers
 * Optional fourth level to further specify variants.
 * Examples: hover, active, disabled, etc.
 */

/**
 * Validation function that can be used to check if a key follows the conventions
 */
export function validateKeyFormat(key: string): boolean {
  // A valid key should have at least 2 levels (namespace.section)
  const parts = key.split('.');
  if (parts.length < 2) return false;
  
  // Namespace should be one of the predefined namespaces
  const namespace = parts[0];
  if (!namespaces.includes(namespace as any)) {
    console.warn(`Key "${key}" uses non-standard namespace "${namespace}"`);
    return false;
  }
  
  return true;
}

/**
 * Helper to create a key following the conventions
 */
export function createKey(
  namespace: typeof namespaces[number], 
  section: string,
  element: string,
  qualifier?: string
): string {
  return qualifier 
    ? `${namespace}.${section}.${element}.${qualifier}`
    : `${namespace}.${section}.${element}`;
}

/**
 * Examples of using the conventions:
 * 
 * Button text:
 * - auth.buttons.login
 * - auth.buttons.signup
 * - profile.buttons.save
 * 
 * Form labels:
 * - auth.labels.email
 * - auth.labels.password
 * - profile.labels.username
 * 
 * Page titles:
 * - map.titles.main
 * - explore.titles.symbols
 * - about.titles.team
 * 
 * Error messages:
 * - auth.errors.invalidEmail
 * - form.errors.required
 */
