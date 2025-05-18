
#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or key not found in environment variables.');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Path to translation files
const localesDir = path.resolve(__dirname, '../locales');
const englishFile = path.join(localesDir, 'en.json');
const frenchFile = path.join(localesDir, 'fr.json');

// Function to read and parse translation files
async function readTranslationFiles() {
  try {
    const englishContent = fs.readFileSync(englishFile, 'utf-8');
    const frenchContent = fs.readFileSync(frenchFile, 'utf-8');
    
    return {
      en: JSON.parse(englishContent),
      fr: JSON.parse(frenchContent)
    };
  } catch (error) {
    console.error('Error reading translation files:', error);
    process.exit(1);
  }
}

// Function to flatten nested objects into dot notation
function flattenObject(obj: any, prefix = '') {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const prefixKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixKey));
    } else {
      acc[prefixKey] = obj[key];
    }
    
    return acc;
  }, {});
}

// Function to insert translations into Supabase
async function insertTranslations(translations: { en: any, fr: any }) {
  // Flatten nested objects
  const flattenedEn = flattenObject(translations.en);
  const flattenedFr = flattenObject(translations.fr);
  
  // Combine into a single array of keys
  const allKeys = new Set([...Object.keys(flattenedEn), ...Object.keys(flattenedFr)]);
  
  // Prepare data for insertion
  const translationRows = Array.from(allKeys).map(key => ({
    key,
    en: flattenedEn[key] || '',
    fr: flattenedFr[key] || '',
    last_updated: new Date().toISOString(),
    status: 'active'
  }));
  
  // Insert data in batches to prevent request size limits
  const batchSize = 100;
  for (let i = 0; i < translationRows.length; i += batchSize) {
    const batch = translationRows.slice(i, i + batchSize);
    
    console.log(`Inserting batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(translationRows.length / batchSize)}`);
    
    const { data, error } = await supabase
      .from('translations')
      .upsert(batch, { onConflict: 'key' });
    
    if (error) {
      console.error('Error inserting translations:', error);
    } else {
      console.log(`Successfully inserted/updated ${batch.length} translations`);
    }
  }
}

// Main function
async function main() {
  console.log('Initializing translation database...');
  
  // Read translation files
  const translations = await readTranslationFiles();
  
  // Insert translations into Supabase
  await insertTranslations(translations);
  
  console.log('Translation database initialization complete!');
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
