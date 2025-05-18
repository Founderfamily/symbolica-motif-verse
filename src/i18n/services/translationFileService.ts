
import en from '../locales/en.json';
import fr from '../locales/fr.json';

/**
 * In the browser environment, we can't read/write disk files.
 * Instead, we expose the imported JSON dictionaries directly
 * and use localStorage for optional persistent storage.
 */
type LocaleCode = 'en' | 'fr';
type FlatDict = Record<string, string>;

const CACHE_KEY = '__symbolica_translations_cache__';

function getCached(): Record<LocaleCode, FlatDict> | null {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
  } catch {
    return null;
  }
}

function setCached(obj: Record<LocaleCode, FlatDict>) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(obj));
}

function flatten(obj: any, prefix = '', acc: FlatDict = {}): FlatDict {
  Object.entries(obj).forEach(([k, v]) => {
    const path = prefix ? `${prefix}.${k}` : k;
    typeof v === 'object' && v !== null && !Array.isArray(v) 
      ? flatten(v, path, acc) 
      : (acc[path] = v as string);
  });
  return acc;
}

/**
 * Browser-compatible file service that uses imported JSON files and localStorage
 */
export const browserFileService = {
  /**
   * Read translations from imported JSON files or localStorage cache
   */
  readAll(): Record<LocaleCode, FlatDict> {
    return getCached() ?? { en: flatten(en), fr: flatten(fr) };
  },

  /**
   * Write translations to localStorage (useful after live editing)
   */
  writeAll(dict: Record<LocaleCode, FlatDict>) {
    setCached(dict);
  },
};

/**
 * Legacy compatibility functions that use the browser service
 * These are needed to maintain compatibility with existing code
 */
export async function readTranslationsFromFile(language: string): Promise<Record<string, any>> {
  const allTranslations = browserFileService.readAll();
  return allTranslations[language as LocaleCode] || {};
}

export async function writeTranslationsToFile(
  language: string, 
  translations: Record<string, any>
): Promise<void> {
  const allTranslations = browserFileService.readAll();
  allTranslations[language as LocaleCode] = translations;
  browserFileService.writeAll(allTranslations);
  console.log(`Translations written to localStorage cache for ${language}`);
}

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
