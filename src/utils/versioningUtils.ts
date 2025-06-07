
/**
 * Application versioning utilities
 * Updated to Version 1.2.0 - Mature platform with 500+ commits
 */

export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
  build: string;
  fullVersion: string;
}

// Current application version - Updated to reflect mature platform status
export const APP_VERSION: AppVersion = {
  major: 1,
  minor: 2,
  patch: 0,
  build: 'stable',
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
};

// Version history with changelog entries
export const VERSION_HISTORY = [
  {
    version: '1.2.0',
    date: '2025-06-07',
    changes: [
      'Mise à jour majeure de version pour refléter la maturité du projet',
      'Plus de 500 commits de développement',
      'Feuille de route mise à jour pour 2025',
      'Système de traductions complètement stabilisé',
      'Interface utilisateur mature et fonctionnelle',
      'Système d\'administration complet',
      'Gestion avancée des collections et symboles',
      'Performance et stabilité optimisées'
    ]
  },
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
    maturityFeatures: [
      'Complete Authentication System',
      'Advanced Collections Management',
      'Admin Dashboard',
      'Multilingual Support (FR/EN)',
      'Performance Monitoring',
      'Error Boundary System',
      'TypeScript Type Safety',
      'Modular Translation System'
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
 * Get maturity features for current version
 */
export const getMaturityFeatures = () => {
  return [
    {
      name: 'Complete Authentication System',
      description: 'Système d\'authentification robuste avec gestion des rôles',
      version: '1.0.0'
    },
    {
      name: 'Advanced Collections Management',
      description: 'Gestion complète des collections avec traductions',
      version: '1.0.0'
    },
    {
      name: 'Admin Dashboard',
      description: 'Interface d\'administration complète et fonctionnelle',
      version: '1.0.0'
    },
    {
      name: 'Multilingual Support',
      description: 'Support complet français/anglais avec système modulaire',
      version: '1.0.1'
    },
    {
      name: 'Performance Monitoring',
      description: 'Monitoring en temps réel avec métriques détaillées',
      version: '1.0.1'
    },
    {
      name: 'Error Boundary System',
      description: 'Gestion robuste des erreurs avec recovery automatique',
      version: '1.0.1'
    }
  ];
};
