
#!/usr/bin/env node

/**
 * Translation Status Export Tool
 * 
 * This script exports the translation status of all symbols and other
 * translatable content to a CSV file for reporting and tracking.
 * 
 * Usage:
 *   SUPABASE_URL=... SUPABASE_KEY=... node src/scripts/export-translation-status.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Check required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY environment variables are required');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * Convert JSON data to CSV format
 * @param {Array} data - Array of objects to convert to CSV
 * @returns {string} CSV formatted string
 */
function jsonToCsv(data) {
  if (!data || !data.length) return '';
  
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
      .map(value => {
        // Handle values that might contain commas or quotes
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') {
          // Escape quotes and wrap in quotes if contains comma or quotes
          if (value.includes(',') || value.includes('"')) {
            return `"${value.replace(/"/g, '""')}"`;
          }
        }
        return value;
      })
      .join(',')
  );
  
  return [header, ...rows].join('\n');
}

/**
 * Check if translations exist for a given language and field
 * @param {Object} item - The database record to check
 * @param {string} lang - Language code
 * @param {string} field - Field name
 * @returns {boolean} True if translation exists
 */
function hasTranslation(item, lang, field) {
  return !!(
    item.translations && 
    typeof item.translations === 'object' && 
    item.translations[lang] && 
    typeof item.translations[lang] === 'object' &&
    item.translations[lang][field] !== undefined &&
    item.translations[lang][field] !== null
  );
}

/**
 * Calculate completion percentage for an item
 * @param {Object} item - The database record to check
 * @returns {number} Percentage complete (0-100)
 */
function calculateCompletion(item, fields = ['name', 'description']) {
  if (!item.translations) return 0;
  
  const languages = ['fr', 'en'];
  let total = fields.length * languages.length;
  let completed = 0;
  
  languages.forEach(lang => {
    fields.forEach(field => {
      if (hasTranslation(item, lang, field)) {
        completed++;
      }
    });
  });
  
  return Math.round((completed / total) * 100);
}

/**
 * Export symbols translation status
 */
async function exportSymbolsTranslationStatus() {
  try {
    // Fetch symbols
    const { data: symbols, error } = await supabase
      .from('symbols')
      .select('id, name, description, translations, culture, period');
    
    if (error) throw error;
    
    // Process symbols data for CSV
    const processedData = symbols.map(symbol => ({
      id: symbol.id,
      name: symbol.name,
      culture: symbol.culture,
      period: symbol.period,
      has_fr_name: hasTranslation(symbol, 'fr', 'name') ? 'Yes' : 'No',
      has_fr_description: hasTranslation(symbol, 'fr', 'description') ? 'Yes' : 'No',
      has_fr_culture: hasTranslation(symbol, 'fr', 'culture') ? 'Yes' : 'No',
      has_fr_period: hasTranslation(symbol, 'fr', 'period') ? 'Yes' : 'No',
      has_en_name: hasTranslation(symbol, 'en', 'name') ? 'Yes' : 'No',
      has_en_description: hasTranslation(symbol, 'en', 'description') ? 'Yes' : 'No',
      has_en_culture: hasTranslation(symbol, 'en', 'culture') ? 'Yes' : 'No',
      has_en_period: hasTranslation(symbol, 'en', 'period') ? 'Yes' : 'No',
      completion_percentage: `${calculateCompletion(symbol, ['name', 'description', 'culture', 'period'])}%`
    }));
    
    // Convert to CSV
    const csv = jsonToCsv(processedData);
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'export');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write CSV file
    const timestamp = new Date().toISOString().split('T')[0];
    const outputFile = path.join(outputDir, `symbols-translation-status-${timestamp}.csv`);
    fs.writeFileSync(outputFile, csv);
    
    console.log(`✅ Exported ${processedData.length} symbols to ${outputFile}`);
    return processedData.length;
  } catch (error) {
    console.error('Error exporting symbols translation status:', error);
    return 0;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('\n📊 Exporting Translation Status...');
  
  const symbolCount = await exportSymbolsTranslationStatus();
  
  // Add other translatable content types here as needed
  // const groupCount = await exportGroupsTranslationStatus();
  
  console.log(`\n✨ Export complete! Total records: ${symbolCount}`);
}

// Run main function if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { exportSymbolsTranslationStatus };
