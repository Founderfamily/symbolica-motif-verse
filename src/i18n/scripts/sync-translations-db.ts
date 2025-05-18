
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

// Function to unflatten an object with dot notation keys
function unflatten(data: Record<string, string>): object {
  const result: any = {};
  
  for (const key in data) {
    const keys = key.split('.');
    let current = result;
    
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (i === keys.length - 1) {
        // Last key, set the value
        current[k] = data[key];
      } else {
        // Create the object if it doesn't exist
        current[k] = current[k] || {};
        current = current[k];
      }
    }
  }
  
  return result;
}

// Function to fetch translations from Supabase and write to files
async function syncTranslationsToFiles() {
  console.log('Fetching translations from database...');
  
  const { data: translations, error } = await supabase
    .from('translations')
    .select('key, en, fr')
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching translations:', error);
    return;
  }
  
  console.log(`Found ${translations.length} translations in the database.`);
  
  // Organize translations by language
  const enFlat: Record<string, string> = {};
  const frFlat: Record<string, string> = {};
  
  translations.forEach(translation => {
    if (translation.en) {
      enFlat[translation.key] = translation.en;
    }
    if (translation.fr) {
      frFlat[translation.key] = translation.fr;
    }
  });
  
  // Unflatten the objects
  const en = unflatten(enFlat);
  const fr = unflatten(frFlat);
  
  // Ensure the locales directory exists
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
    console.log(`Created locales directory: ${localesDir}`);
  }
  
  // Write to files
  fs.writeFileSync(englishFile, JSON.stringify(en, null, 2), 'utf-8');
  fs.writeFileSync(frenchFile, JSON.stringify(fr, null, 2), 'utf-8');
  
  console.log(`English translations written to: ${englishFile}`);
  console.log(`French translations written to: ${frenchFile}`);
}

// Function to fetch translations from files and update the database
async function syncFilesToDatabase() {
  console.log('Reading translation files...');
  
  // Check if files exist
  if (!fs.existsSync(englishFile) || !fs.existsSync(frenchFile)) {
    console.error('Translation files not found.');
    return;
  }
  
  // Read and parse files
  const enContent = JSON.parse(fs.readFileSync(englishFile, 'utf-8'));
  const frContent = JSON.parse(fs.readFileSync(frenchFile, 'utf-8'));
  
  console.log('Flattening translation objects...');
  
  // Function to flatten nested objects into dot notation
  function flattenObject(obj: any, prefix = ''): Record<string, string> {
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
  
  // Flatten the objects
  const enFlat = flattenObject(enContent);
  const frFlat = flattenObject(frContent);
  
  console.log(`Found ${Object.keys(enFlat).length} English translations`);
  console.log(`Found ${Object.keys(frFlat).length} French translations`);
  
  // Combine into a single array of keys
  const allKeys = new Set([...Object.keys(enFlat), ...Object.keys(frFlat)]);
  console.log(`Total unique keys: ${allKeys.size}`);
  
  // Prepare data for insertion/update
  const translationRows = Array.from(allKeys).map(key => ({
    key,
    en: enFlat[key] || null,
    fr: frFlat[key] || null,
    last_updated: new Date().toISOString(),
    status: 'active'
  }));
  
  // Insert/update data in batches
  const batchSize = 100;
  for (let i = 0; i < translationRows.length; i += batchSize) {
    const batch = translationRows.slice(i, i + batchSize);
    
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1} of ${Math.ceil(translationRows.length / batchSize)}`);
    
    const { data, error } = await supabase
      .from('translations')
      .upsert(batch, { onConflict: 'key' });
    
    if (error) {
      console.error('Error updating translations:', error);
    } else {
      console.log(`Successfully processed ${batch.length} translations`);
    }
  }
}

// Main function
async function main() {
  // Check command line arguments
  const args = process.argv.slice(2);
  
  if (args.includes('--db-to-files')) {
    console.log('Syncing translations from database to files...');
    await syncTranslationsToFiles();
  } else if (args.includes('--files-to-db')) {
    console.log('Syncing translations from files to database...');
    await syncFilesToDatabase();
  } else {
    console.log('No direction specified. Please use:');
    console.log('  --db-to-files    Sync from database to local files');
    console.log('  --files-to-db    Sync from local files to database');
  }
}

// Run the script
main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
