
/**
 * Application versioning utilities
 */

export interface AppVersion {
  major: number;
  minor: number;
  patch: number;
  build: string;
  fullVersion: string;
}

// Current application version - Updated to reflect project maturity (300+ commits)
export const APP_VERSION: AppVersion = {
  major: 1,
  minor: 0,
  patch: 0,
  build: 'stable',
  get fullVersion() {
    return `${this.major}.${this.minor}.${this.patch}`;
  }
};

// Version history with changelog entries
export const VERSION_HISTORY = [
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
    changelog: VERSION_HISTORY[0]?.changes || []
  };
};
