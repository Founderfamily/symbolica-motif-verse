
import fs from 'fs';
import path from 'path';

const LOCALES_DIR = path.join(process.cwd(), 'src/i18n/locales');

/**
 * Ensure the locales directory exists
 */
function ensureLocalesDir() {
  if (!fs.existsSync(LOCALES_DIR)) {
    fs.mkdirSync(LOCALES_DIR, { recursive: true });
  }
}

/**
 * Write translations to a file
 */
export async function writeTranslationsToFile(
  language: string, 
  translations: Record<string, any>
): Promise<void> {
  try {
    ensureLocalesDir();
    const filePath = path.join(LOCALES_DIR, `${language}.json`);
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(translations, null, 2),
      'utf8'
    );
    console.log(`Translations written to ${filePath}`);
  } catch (error) {
    console.error(`Error writing ${language} translations to file:`, error);
    throw error;
  }
}

/**
 * Read translations from a file
 */
export async function readTranslationsFromFile(
  language: string
): Promise<Record<string, any>> {
  try {
    const filePath = path.join(LOCALES_DIR, `${language}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Translation file ${filePath} not found`);
      return {};
    }
    
    const content = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading ${language} translations from file:`, error);
    return {};
  }
}

/**
 * Compare translations from database with local files
 */
export async function compareTranslations(
  dbTranslations: Record<string, any>,
  fileTranslations: Record<string, any>
): Promise<{
  added: string[];
  modified: string[];
  removed: string[];
}> {
  const dbKeys = Object.keys(dbTranslations);
  const fileKeys = Object.keys(fileTranslations);
  
  const added = dbKeys.filter(key => !fileKeys.includes(key));
  const removed = fileKeys.filter(key => !dbKeys.includes(key));
  
  const modified = dbKeys
    .filter(key => fileKeys.includes(key))
    .filter(key => dbTranslations[key] !== fileTranslations[key]);
  
  return { added, modified, removed };
}
