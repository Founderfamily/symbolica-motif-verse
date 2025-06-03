
/**
 * Application versioning utilities
 * Updated for stability improvements release
 */

export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
  build: string;
  fullVersion: string;
}

// Current application version - Updated for stability improvements (ErrorBoundary, SafeImage, Performance Monitoring)
export const APP_VERSION: AppVersion = {
  major: 1,
  minor: 0,
  patch: 1,
  build: 'stable',
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
};

// Version history with changelog entries
export const VERSION_HISTORY = [
  {
    version: '1.0.1',
    date: '2025-06-03',
    changes: [
      'Système ErrorBoundary complet pour isolation des erreurs',
      'Composant SafeImage avec gestion des fallbacks',
      'Monitoring des performances en temps réel',
      'Gestion centralisée des erreurs via ErrorHandler',
      'Restructuration du système de traductions (fichiers modulaires)',
      'Types TypeScript pour les clés de traduction',
      'Amélioration de la stabilité globale',
      'Documentation complète mise à jour',
      'Système de toast notifications intégré',
      'Debug modes et outils de développement améliorés'
    ]
  },
  {
    version: '1.0.0',
    date: '2025-05-26',
    changes: [
      'Version stable de Symbolica',
      'Système de contributions complet',
      'Interface multilingue (FR/EN)',
      'Gestion avancée des utilisateurs',
      'Système de gamification',
      'Dashboard administrateur complet',
      'Intégration Supabase',
      'Plus de 300 commits de développement'
    ]
  },
  {
    version: '1.0.0-alpha',
    date: '2025-05-14',
    changes: [
      'Version initiale du site Symbolica',
      'Implémentation du tableau de bord administrateur',
      'Ajout de la gestion des symboles',
      'Amélioration de la gestion des images'
    ]
  }
];

/**
 * Check if current version is newer than a specified version
 */
export const isNewerVersion = (targetVersion: string): boolean => {
  const current = APP_VERSION.fullVersion;
  
  // Simple string comparison works if following semver
  return current > targetVersion;
};

/**
 * Find changelog entries for a specific version
 */
export const getChangelogForVersion = (version: string): string[] => {
  const entry = VERSION_HISTORY.find(entry => entry.version === version);
  return entry?.changes || [];
};

/**
 * Get formatted version string for display
 */
export const getDisplayVersion = (): string => {
  return `Version ${APP_VERSION.fullVersion}`;
};

/**
 * Get full version info with build details
 */
export const getFullVersionInfo = () => {
  return {
    version: APP_VERSION.fullVersion,
    build: APP_VERSION.build,
    displayVersion: getDisplayVersion(),
    releaseDate: VERSION_HISTORY[0]?.date,
    changelog: VERSION_HISTORY[0]?.changes || [],
    stabilityFeatures: [
      'ErrorBoundary System',
      'SafeImage Component', 
      'Performance Monitoring',
      'Centralized Error Handling',
      'Modular Translation System',
      'TypeScript Type Safety'
    ]
  };
};

/**
 * Check if version includes stability improvements
 */
export const hasStabilityFeatures = (version: string = APP_VERSION.fullVersion): boolean => {
  // Stability features introduced in 1.0.1+
  const [major, minor, patch] = version.split('.').map(Number);
  return major > 1 || (major === 1 && minor > 0) || (major === 1 && minor === 0 && patch >= 1);
};

/**
 * Get stability features for current version
 */
export const getStabilityFeatures = () => {
  if (!hasStabilityFeatures()) return [];
  
  return [
    {
      name: 'ErrorBoundary System',
      description: 'Isolation des erreurs par section avec fallback UI',
      version: '1.0.1'
    },
    {
      name: 'SafeImage Component',
      description: 'Gestion robuste du chargement d\'images avec fallbacks',
      version: '1.0.1'
    },
    {
      name: 'Performance Monitoring',
      description: 'Métriques temps réel et alertes de performance',
      version: '1.0.1'
    },
    {
      name: 'Centralized Error Handling',
      description: 'Système ErrorHandler singleton avec notifications',
      version: '1.0.1'
    },
    {
      name: 'Modular Translation System',
      description: 'Architecture modulaire avec types TypeScript',
      version: '1.0.1'
    }
  ];
};
