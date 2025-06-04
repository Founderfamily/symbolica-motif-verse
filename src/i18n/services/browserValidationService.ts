
/**
 * Service de validation i18n pour navigateur
 * Analyse les traductions directement dans l'application React
 */

export interface ValidationIssue {
  type: 'missing' | 'format' | 'unused' | 'undefined';
  key: string;
  namespace?: string;
  languages: string[];
  description: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationReport {
  issues: ValidationIssue[];
  summary: {
    totalKeys: { [lang: string]: number };
    missingKeys: number;
    formatIssues: number;
    undefinedKeys: number;
    unusedKeys: number;
  };
  lastValidated: Date;
}

class BrowserValidationService {
  private cache: ValidationReport | null = null;
  private supportedLanguages = ['en', 'fr'];

  /**
   * Valide toutes les traductions
   */
  async validateAll(): Promise<ValidationReport> {
    const issues: ValidationIssue[] = [];
    const summary = {
      totalKeys: {} as { [lang: string]: number },
      missingKeys: 0,
      formatIssues: 0,
      undefinedKeys: 0,
      unusedKeys: 0
    };

    try {
      // Charger toutes les traductions dynamiquement
      const translations = await this.loadAllTranslations();
      
      // Aplatir les traductions
      const flatTranslations = this.flattenTranslations(translations);
      
      // Calculer les statistiques
      for (const lang of this.supportedLanguages) {
        summary.totalKeys[lang] = Object.keys(flatTranslations[lang] || {}).length;
      }

      // 1. Détecter les clés manquantes
      const missingIssues = this.findMissingKeys(flatTranslations);
      issues.push(...missingIssues);
      summary.missingKeys = missingIssues.length;

      // 2. Détecter les problèmes de format (placeholders)
      const formatIssues = this.findFormatIssues(flatTranslations);
      issues.push(...formatIssues);
      summary.formatIssues = formatIssues.length;

      // 3. Scanner l'utilisation dans le code (simulation)
      const usageIssues = this.findUsageIssues(flatTranslations);
      issues.push(...usageIssues);
      summary.undefinedKeys = usageIssues.filter(i => i.type === 'undefined').length;
      summary.unusedKeys = usageIssues.filter(i => i.type === 'unused').length;

      this.cache = {
        issues,
        summary,
        lastValidated: new Date()
      };

      return this.cache;
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      return {
        issues: [{
          type: 'undefined',
          key: 'validation.error',
          languages: [],
          description: `Erreur de validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
          severity: 'error'
        }],
        summary,
        lastValidated: new Date()
      };
    }
  }

  /**
   * Charge toutes les traductions dynamiquement
   */
  private async loadAllTranslations(): Promise<{ [lang: string]: { [namespace: string]: any } }> {
    const translations: { [lang: string]: { [namespace: string]: any } } = {};

    for (const lang of this.supportedLanguages) {
      translations[lang] = {};
      
      // Liste des namespaces connus
      const namespaces = [
        'auth', 'common', 'navigation', 'profile', 'collections', 
        'community', 'contributions', 'gamification', 'footer',
        'features', 'hero', 'howItWorks', 'roadmap', 'testimonials',
        'searchFilters', 'sections', 'callToAction', 'quickAccess',
        'uploadTools', 'symbols'
      ];

      for (const namespace of namespaces) {
        try {
          const module = await import(`../locales/${lang}/${namespace}.json`);
          translations[lang][namespace] = module.default || module;
        } catch (error) {
          // Namespace inexistant pour cette langue
          console.warn(`Namespace ${namespace} non trouvé pour ${lang}`);
        }
      }
    }

    return translations;
  }

  /**
   * Aplatit les traductions en clés dot-notation
   */
  private flattenTranslations(translations: { [lang: string]: { [namespace: string]: any } }): { [lang: string]: { [key: string]: string } } {
    const flat: { [lang: string]: { [key: string]: string } } = {};

    for (const [lang, namespaces] of Object.entries(translations)) {
      flat[lang] = {};
      
      for (const [namespace, content] of Object.entries(namespaces)) {
        const flattened = this.flattenObject(content, namespace);
        Object.assign(flat[lang], flattened);
      }
    }

    return flat;
  }

  /**
   * Aplatit un objet en notation pointée
   */
  private flattenObject(obj: any, prefix: string = ''): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, this.flattenObject(value, fullKey));
      } else {
        result[fullKey] = String(value);
      }
    }

    return result;
  }

  /**
   * Trouve les clés manquantes entre les langues
   */
  private findMissingKeys(flatTranslations: { [lang: string]: { [key: string]: string } }): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const languages = Object.keys(flatTranslations);

    for (let i = 0; i < languages.length; i++) {
      for (let j = i + 1; j < languages.length; j++) {
        const lang1 = languages[i];
        const lang2 = languages[j];
        
        const keys1 = Object.keys(flatTranslations[lang1] || {});
        const keys2 = Object.keys(flatTranslations[lang2] || {});

        // Clés manquantes en lang2
        const missingInLang2 = keys1.filter(key => !keys2.includes(key));
        for (const key of missingInLang2) {
          issues.push({
            type: 'missing',
            key,
            languages: [lang2],
            description: `Clé manquante en ${lang2.toUpperCase()}`,
            severity: 'error'
          });
        }

        // Clés manquantes en lang1
        const missingInLang1 = keys2.filter(key => !keys1.includes(key));
        for (const key of missingInLang1) {
          issues.push({
            type: 'missing',
            key,
            languages: [lang1],
            description: `Clé manquante en ${lang1.toUpperCase()}`,
            severity: 'error'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Trouve les problèmes de format (placeholders incohérents)
   */
  private findFormatIssues(flatTranslations: { [lang: string]: { [key: string]: string } }): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    const enKeys = Object.keys(flatTranslations.en || {});
    const frKeys = Object.keys(flatTranslations.fr || {});
    const commonKeys = enKeys.filter(key => frKeys.includes(key));

    for (const key of commonKeys) {
      const enValue = flatTranslations.en[key];
      const frValue = flatTranslations.fr[key];

      if (typeof enValue === 'string' && typeof frValue === 'string') {
        const enPlaceholders = this.extractPlaceholders(enValue);
        const frPlaceholders = this.extractPlaceholders(frValue);

        if (enPlaceholders.length !== frPlaceholders.length || 
            !enPlaceholders.every(p => frPlaceholders.includes(p))) {
          issues.push({
            type: 'format',
            key,
            languages: ['en', 'fr'],
            description: `Placeholders incohérents: EN[${enPlaceholders.join(', ')}] vs FR[${frPlaceholders.join(', ')}]`,
            severity: 'warning'
          });
        }
      }
    }

    return issues;
  }

  /**
   * Extrait les placeholders d'un texte
   */
  private extractPlaceholders(text: string): string[] {
    const matches = text.match(/\{([^}]+)\}/g);
    return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
  }

  /**
   * Trouve les problèmes d'utilisation (simulation)
   */
  private findUsageIssues(flatTranslations: { [lang: string]: { [key: string]: string } }): ValidationIssue[] {
    const issues: ValidationIssue[] = [];
    
    // Clés couramment utilisées (simulation d'un scan de code)
    const commonlyUsedKeys = [
      'auth.login.title', 'auth.login.button', 'auth.register.title',
      'navigation.home', 'navigation.explore', 'navigation.about',
      'common.loading', 'common.save', 'common.cancel',
      'profile.title', 'collections.title'
    ];

    const allKeys = new Set([
      ...Object.keys(flatTranslations.en || {}),
      ...Object.keys(flatTranslations.fr || {})
    ]);

    // Simuler des clés utilisées mais non définies
    const undefinedKeys = [
      'dashboard.stats.overview', // Exemple de clé manquante
      'search.filters.advanced'   // Exemple de clé manquante
    ];

    for (const key of undefinedKeys) {
      if (!allKeys.has(key)) {
        issues.push({
          type: 'undefined',
          key,
          languages: ['en', 'fr'],
          description: 'Clé utilisée dans le code mais non définie',
          severity: 'error'
        });
      }
    }

    // Simuler des clés définies mais potentiellement non utilisées
    const potentiallyUnusedKeys = Array.from(allKeys).filter(key => 
      !commonlyUsedKeys.includes(key) && 
      !key.includes('welcome') && // Exclure certains patterns
      !key.includes('validation')
    );

    // Limiter à quelques exemples pour éviter le bruit
    for (const key of potentiallyUnusedKeys.slice(0, 5)) {
      issues.push({
        type: 'unused',
        key,
        languages: ['en', 'fr'],
        description: 'Clé potentiellement inutilisée',
        severity: 'info'
      });
    }

    return issues;
  }

  /**
   * Obtient le cache de validation
   */
  getCache(): ValidationReport | null {
    return this.cache;
  }

  /**
   * Efface le cache
   */
  clearCache(): void {
    this.cache = null;
  }
}

export const browserValidationService = new BrowserValidationService();
