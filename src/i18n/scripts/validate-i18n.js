
#!/usr/bin/env node

/**
 * Script de validation automatique i18n
 * 
 * Ce script vérifie :
 * - Les clés manquantes entre les langues
 * - Les inconsistances de format (placeholders)
 * - Les clés utilisées dans le code mais non définies
 * - Génère un rapport détaillé
 * 
 * Usage:
 *   node src/i18n/scripts/validate-i18n.js [--fix] [--report=rapport.csv]
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const LOCALES_DIR = path.join(__dirname, '../locales');
const SRC_DIR = path.join(__dirname, '../../');
const SUPPORTED_LANGUAGES = ['en', 'fr'];

// Arguments de ligne de commande
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const reportArg = args.find(arg => arg.startsWith('--report='));
const reportPath = reportArg ? reportArg.split('=')[1] : null;

console.log('🔍 Validation automatique des traductions i18n');
console.log('===============================================\n');

// Charger toutes les traductions d'une langue
const loadTranslations = (lang) => {
  const langDir = path.join(LOCALES_DIR, lang);
  if (!fs.existsSync(langDir)) {
    console.error(`❌ Dossier de langue manquant: ${langDir}`);
    return {};
  }

  const translations = {};
  const files = fs.readdirSync(langDir).filter(file => file.endsWith('.json'));
  
  files.forEach(file => {
    try {
      const namespace = path.basename(file, '.json');
      const content = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
      translations[namespace] = content;
    } catch (error) {
      console.error(`❌ Erreur lecture ${lang}/${file}:`, error.message);
    }
  });

  return translations;
};

// Aplatir un objet de traductions
const flattenTranslations = (obj, prefix = '') => {
  const flattened = {};
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(flattened, flattenTranslations(obj[key], fullKey));
    } else {
      flattened[fullKey] = obj[key];
    }
  }
  
  return flattened;
};

// Extraire les placeholders d'un texte
const extractPlaceholders = (text) => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
};

// Scanner le code source pour les clés t()
const scanSourceCode = () => {
  const usedKeys = new Set();
  const tUsagePattern = /t\(['"`]([^'"`]+)['"`]/g;
  
  // Chercher dans tous les fichiers .tsx, .ts, .jsx, .js
  const sourceFiles = glob.sync(`${SRC_DIR}/**/*.{tsx,ts,jsx,js}`, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/scripts/**']
  });
  
  sourceFiles.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      let match;
      
      while ((match = tUsagePattern.exec(content)) !== null) {
        usedKeys.add(match[1]);
      }
    } catch (error) {
      console.warn(`⚠️ Impossible de lire ${file}:`, error.message);
    }
  });
  
  return Array.from(usedKeys);
};

// Validation principale
const validateTranslations = () => {
  const results = {
    languages: {},
    missing: {},
    formatIssues: [],
    unusedKeys: [],
    undefinedKeys: [],
    summary: {}
  };
  
  // Charger toutes les traductions
  SUPPORTED_LANGUAGES.forEach(lang => {
    results.languages[lang] = loadTranslations(lang);
  });
  
  // Aplatir les traductions pour comparaison
  const flatTranslations = {};
  SUPPORTED_LANGUAGES.forEach(lang => {
    flatTranslations[lang] = {};
    Object.keys(results.languages[lang]).forEach(namespace => {
      const flattened = flattenTranslations(results.languages[lang][namespace], namespace);
      Object.assign(flatTranslations[lang], flattened);
    });
  });
  
  // 1. Détecter les clés manquantes
  SUPPORTED_LANGUAGES.forEach(sourceLang => {
    SUPPORTED_LANGUAGES.forEach(targetLang => {
      if (sourceLang !== targetLang) {
        const sourceKeys = Object.keys(flatTranslations[sourceLang]);
        const targetKeys = Object.keys(flatTranslations[targetLang]);
        
        const missing = sourceKeys.filter(key => !targetKeys.includes(key));
        if (missing.length > 0) {
          results.missing[`${sourceLang}->${targetLang}`] = missing;
        }
      }
    });
  });
  
  // 2. Détecter les problèmes de format
  const enKeys = Object.keys(flatTranslations.en || {});
  const frKeys = Object.keys(flatTranslations.fr || {});
  const commonKeys = enKeys.filter(key => frKeys.includes(key));
  
  commonKeys.forEach(key => {
    const enValue = flatTranslations.en[key];
    const frValue = flatTranslations.fr[key];
    
    if (typeof enValue === 'string' && typeof frValue === 'string') {
      const enPlaceholders = extractPlaceholders(enValue);
      const frPlaceholders = extractPlaceholders(frValue);
      
      // Vérifier que les placeholders correspondent
      const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
      const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
      
      if (missingInFr.length > 0 || missingInEn.length > 0) {
        results.formatIssues.push({
          key,
          en: enValue,
          fr: frValue,
          missingInFr,
          missingInEn
        });
      }
    }
  });
  
  // 3. Scanner le code source
  console.log('📱 Scan du code source...');
  const usedKeys = scanSourceCode();
  
  // 4. Détecter les clés utilisées mais non définies
  const definedKeys = new Set([...enKeys, ...frKeys]);
  results.undefinedKeys = usedKeys.filter(key => !definedKeys.has(key));
  
  // 5. Détecter les clés définies mais non utilisées
  results.unusedKeys = [...definedKeys].filter(key => !usedKeys.includes(key));
  
  // 6. Générer le résumé
  results.summary = {
    totalKeysEn: enKeys.length,
    totalKeysFr: frKeys.length,
    totalUsedKeys: usedKeys.length,
    missingKeysCount: Object.values(results.missing).reduce((sum, arr) => sum + arr.length, 0),
    formatIssuesCount: results.formatIssues.length,
    undefinedKeysCount: results.undefinedKeys.length,
    unusedKeysCount: results.unusedKeys.length
  };
  
  return results;
};

// Affichage des résultats
const displayResults = (results) => {
  const { summary, missing, formatIssues, undefinedKeys, unusedKeys } = results;
  
  console.log('📊 RÉSUMÉ');
  console.log('=========');
  console.log(`Clés EN: ${summary.totalKeysEn}`);
  console.log(`Clés FR: ${summary.totalKeysFr}`);
  console.log(`Clés utilisées dans le code: ${summary.totalUsedKeys}`);
  console.log(`Clés manquantes: ${summary.missingKeysCount}`);
  console.log(`Problèmes de format: ${summary.formatIssuesCount}`);
  console.log(`Clés non définies: ${summary.undefinedKeysCount}`);
  console.log(`Clés inutilisées: ${summary.unusedKeysCount}\n`);
  
  // Afficher les clés manquantes
  Object.keys(missing).forEach(direction => {
    const [source, target] = direction.split('->');
    console.log(`❌ MANQUANT EN ${target.toUpperCase()} (${missing[direction].length} clés):`);
    missing[direction].slice(0, 10).forEach(key => {
      console.log(`   ${key}`);
    });
    if (missing[direction].length > 10) {
      console.log(`   ... et ${missing[direction].length - 10} autres\n`);
    } else {
      console.log('');
    }
  });
  
  // Afficher les problèmes de format
  if (formatIssues.length > 0) {
    console.log(`⚠️ PROBLÈMES DE FORMAT (${formatIssues.length}):`);
    formatIssues.slice(0, 5).forEach(issue => {
      console.log(`   ${issue.key}:`);
      console.log(`     EN: ${issue.en}`);
      console.log(`     FR: ${issue.fr}`);
      if (issue.missingInFr.length > 0) {
        console.log(`     Manquant en FR: {${issue.missingInFr.join('}, {')}}`);
      }
      if (issue.missingInEn.length > 0) {
        console.log(`     Manquant en EN: {${issue.missingInEn.join('}, {')}}`);
      }
      console.log('');
    });
    if (formatIssues.length > 5) {
      console.log(`   ... et ${formatIssues.length - 5} autres problèmes\n`);
    }
  }
  
  // Afficher les clés non définies
  if (undefinedKeys.length > 0) {
    console.log(`🔍 CLÉS UTILISÉES MAIS NON DÉFINIES (${undefinedKeys.length}):`);
    undefinedKeys.slice(0, 10).forEach(key => {
      console.log(`   ${key}`);
    });
    if (undefinedKeys.length > 10) {
      console.log(`   ... et ${undefinedKeys.length - 10} autres\n`);
    } else {
      console.log('');
    }
  }
  
  // Afficher les clés inutilisées (uniquement les 5 premières)
  if (unusedKeys.length > 0) {
    console.log(`♻️ CLÉS DÉFINIES MAIS NON UTILISÉES (${unusedKeys.length}):`);
    unusedKeys.slice(0, 5).forEach(key => {
      console.log(`   ${key}`);
    });
    if (unusedKeys.length > 5) {
      console.log(`   ... et ${unusedKeys.length - 5} autres (potentiellement utilisées)\n`);
    } else {
      console.log('');
    }
  }
};

// Génération du rapport CSV
const generateCSVReport = (results, filePath) => {
  const rows = [
    ['Type', 'Clé', 'Description', 'Valeur EN', 'Valeur FR', 'Problème']
  ];
  
  // Clés manquantes
  Object.keys(results.missing).forEach(direction => {
    const [source, target] = direction.split('->');
    results.missing[direction].forEach(key => {
      rows.push([
        'Manquant',
        key,
        `Manquant en ${target.toUpperCase()}`,
        source === 'en' ? results.languages.en?.[key] || '' : '',
        source === 'fr' ? results.languages.fr?.[key] || '' : '',
        `Traduction manquante en ${target}`
      ]);
    });
  });
  
  // Problèmes de format
  results.formatIssues.forEach(issue => {
    rows.push([
      'Format',
      issue.key,
      'Placeholders incohérents',
      issue.en,
      issue.fr,
      `EN manquant: {${issue.missingInEn.join(', ')}} | FR manquant: {${issue.missingInFr.join(', ')}}`
    ]);
  });
  
  // Clés non définies
  results.undefinedKeys.forEach(key => {
    rows.push([
      'Non définie',
      key,
      'Utilisée dans le code mais non définie',
      '',
      '',
      'Ajouter la traduction'
    ]);
  });
  
  const csvContent = rows.map(row => 
    row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  
  fs.writeFileSync(filePath, csvContent, 'utf8');
  console.log(`📄 Rapport CSV généré: ${filePath}`);
};

// Correction automatique (version basique)
const autoFix = (results) => {
  console.log('🔧 Proposition de corrections automatiques...\n');
  
  let fixCount = 0;
  
  // Proposer l'ajout des clés manquantes
  Object.keys(results.missing).forEach(direction => {
    const [source, target] = direction.split('->');
    
    if (results.missing[direction].length > 0) {
      console.log(`Proposition d'ajout de ${results.missing[direction].length} clés manquantes en ${target.toUpperCase()}:`);
      
      results.missing[direction].slice(0, 5).forEach(key => {
        console.log(`  + "${key}": "[TODO] Traduction requise"`);
        fixCount++;
      });
      
      if (results.missing[direction].length > 5) {
        console.log(`  ... et ${results.missing[direction].length - 5} autres clés`);
      }
      console.log('');
    }
  });
  
  console.log(`\n💡 ${fixCount} corrections automatiques proposées`);
  console.log('⚠️ Les clés [TODO] doivent être traduites manuellement');
  console.log('📝 Ajoutez-les aux fichiers de traduction appropriés\n');
  
  return fixCount;
};

// Exécution principale
const main = () => {
  const results = validateTranslations();
  displayResults(results);
  
  // Générer le rapport CSV si demandé
  if (reportPath) {
    generateCSVReport(results, reportPath);
  }
  
  // Proposer des corrections automatiques si demandé
  if (shouldFix) {
    autoFix(results);
  }
  
  // Code de sortie pour CI/CD
  const hasErrors = results.summary.undefinedKeysCount > 0 || results.summary.missingKeysCount > 0;
  
  console.log('\n🚀 COMMENT UTILISER CE SCRIPT:');
  console.log('================================');
  console.log('node src/i18n/scripts/validate-i18n.js           # Validation simple');
  console.log('node src/i18n/scripts/validate-i18n.js --fix     # Avec propositions');
  console.log('node src/i18n/scripts/validate-i18n.js --report=rapport.csv # Avec rapport');
  
  if (hasErrors) {
    console.log('\n❌ Des problèmes critiques ont été détectés');
    process.exit(1);
  } else {
    console.log('\n✅ Validation réussie !');
    process.exit(0);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

module.exports = { validateTranslations, displayResults, generateCSVReport };
